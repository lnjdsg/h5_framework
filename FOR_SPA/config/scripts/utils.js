import store from "@src/store";
import ajax from "./ajax";
import { Toast } from "@src/toast";
import { getUrlParam } from "@src/utils/utils";

export default function jsonp(url, params = {}) {
    params._t = Date.now();
    const realUrl = urlJoin(url, obj2query(params));
    return appendJsScript(realUrl);
}

/**
 * 执行js脚本
 * @param {string} script - 脚本文本
 * @param {HTMLElement} [parentNode=document.head] - 父节点
 */
export function evalJsScript(script, parentNode = document.head) {
    const el = document.createElement('script');
    el.innerHTML = script;
    parentNode.appendChild(el);
    setTimeout(() => {
        parentNode.removeChild(el);
    }, 1);
}

function getRequestParams(value) {
    if (typeof value === 'string') {
        return { uri: value, method: 'get' };
    } else if (typeof value === 'object') {
        const { uri, method = 'get', headers, withToken, secret, secretKey, contentType = 'form' } = value;
        return { uri, method, headers, withToken, secret, secretKey, contentType };
    } else {
        console.error('getRequestParams: 传参有误');
        return {};
    }
}

async function callApi(uri, params, method = 'get', headers, justData = true, secret = false, secretKey, requestContentType) {
    const responseText = await ajax(uri, params, method, headers, requestContentType, secret, secretKey);

    try {
        const response = JSON.parse(responseText);
        if (justData) {
            return response.success ? response.data : handleErrorResponse(response);
        }
        return response;
    } catch (e) {
        console.error('JSON 解析错误:', e);
        throw new Error('网络异常，请稍后再试~');
    }
}

function handleErrorResponse(response) {
    console.error(response.message || '网络异常，请稍后再试~');
    Toast(response.message || '网络异常，请稍后再试~');
    return { success: false, data: '' };
}

/**
 * 请求API通用处理
 * @param {Object} apiList - API 列表
 * @returns {Object} api - 生成的 API 方法
 */
export function generateAPI(apiList) {
    const api = {};
    for (const key in apiList) {
        const value = apiList[key];
        const { method, uri, headers: mHeaders, withToken, secret, secretKey, contentType } = getRequestParams(value);

        api[key] = async (params = {}, headers) => {
            let token;
            if (withToken) {
                token = await getPxToken().catch(() => {
                    console.log('网络异常，请稍后再试~');
                    return null;
                });
            }

            const mergedHeaders = { ...mHeaders, ...headers };
            if (withToken && token) params.token = token;
            params = { ...params };

            try {
                const result = await callApi(uri, params, method, mergedHeaders, false, secret, secretKey, contentType);
                return result || { success: false, data: '' };
            } catch (e) {
                console.log('网络异常，请稍后再试~');
                return { success: false, data: '' };
            }
        };
    }
    return api;
}

/**
 * 轮询接口
 * @param {function} successFunc - 成功判断方法
 * @param {string} uri - 相对链接
 * @param {object} [params] - 参数
 * @param {number} [maxTimes=10] - 轮询次数
 * @param {number} [delay=500] - 轮询间隔(ms)
 * @param {'get' | 'post'} [method='get'] - http方法
 * @param {object} [headers] - 头部
 * @param {boolean} [justData=true] - 只返回data
 * @returns {Promise<object>} data object
 * @throws {{code:'210001'}} 网络异常
 * @throws {{code:'210003'}} 请求超时
 */
export function polling(successFunc, uri, params, maxTimes = 10, delay = 500, method = 'get', headers, justData = true) {
    const promises = Array.from({ length: maxTimes }, (_, i) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (store.EndPolling) return resolve(); // 结束轮询
                func().then(resolve).catch(resolve); // 捕获错误并解决
            }, i * delay);
        });
    });

    return Promise.all(promises).then((results) => {
        const lastResp = results.find(response => response); // 找到最后一个有效的响应
        if (lastResp) {
            return justData ? lastResp.data : lastResp;
        }
        throw new Error('请求失败'); // 如果没有有效响应，抛出错误
    });

    function func() {
        return callApi(uri, params, method, headers, false).then((resp) => {
            if (successFunc(resp)) {
                return resp; // 返回满足条件的响应
            }
            return null; // 继续轮询
        });
    }
}


/**
 * Created by 六年级的时光 on 2023/4/09.
 */
import store from "@src/store";
import ajax from "./ajax";
import { Toast } from "@src/toast";
import { getUrlParam } from "@src/utils/utils"
export default function jsonp(url, params = {}) {
    params._t = Date.now();
    const realUrl = urlJoin(url, obj2query(params));
    return appendJsScript(realUrl);
}

/**
 * 执行js脚本
 * @ctype PROCESS
 * @description 执行js脚本
 * @param {string} script - 脚本文本
 * @param {HTMLElement} [parentNode=document.head] - 父节点
 */
export function evalJsScript(script, parentNode = document.head) {
    let el = document.createElement('script');
    el.innerHTML = script;
    document.head.appendChild(el);
    setTimeout(() => {
        document.head.removeChild(el);
    }, 1);
}

// const mergeData = {
//     user_type: newUser ? '0' : '1',
//     is_from_share: isFromShare ? '0' : '1',
// }
/**
 * 请求方法get、post处理
 * @param {*} value 
 * @returns 
 */
function getRequestParams(value) {
    if (typeof value === 'string') {
        return {
            uri: value,
            method: 'get'
        }
    } else if (typeof value === 'object') {
        const { uri, method = 'get', headers, withToken, secret, secretKey, contentType = 'form' } = value;
        return {
            uri,
            method,
            headers,
            withToken,
            secret,
            secretKey,
            contentType,
        }
    } else {
        console.error('getRequestParams: 传参有误');
    }
}

async function callApi(uri, params, method = 'get', headers, justData = true, secret = false, secretKey, requestContentType) {
    const responseText = await ajax(uri, params, method, headers, requestContentType, secret, secretKey);

    let response;
    try {
        response = JSON.parse(responseText);
    }
    catch (e) {
        // todo错误提示 不写也没事，外面抛
    }
    if (justData) {
        if (response.success) {
            return response.data;
        }
        else {
            // todo错误提示 不写也没事，外面抛
        }
    }
    else {
        return response;
    }
}
/**
 * 请求API通用处理
 * @param {*} value 
 * @returns 
 */
export function generateAPI(apiList) {
    const api = {};
    for (const key in apiList) {
        const value = apiList[key];

        const { method, uri, headers: mHeaders, withToken, secret, secretKey, contentType } = getRequestParams(value);
        api[key] = async (params = {}, headers) => {
            let token;
            if (withToken) {   // 是否携带token
                try {
                    token = await getPxToken(); // 获取token
                } catch (e) {
                    // Toast('网络异常，请稍后再试~');
                    console.log('网络异常，请稍后再试~')
                    return ({ success: false, data: '' });
                }
            }
            const mergedHeaders = { ...mHeaders, ...headers, userToken: getUrlParam('token') || "", userId: getUrlParam('userId') || "" }
            // const mergedHeaders = { ...mHeaders, ...headers }
            if (withToken && token) {
                params.token = token;
            }

            // params = { ...params, ...mergeData };
            //简单点 暂时不拼接分享参数
            params = { ...params }

            const result = await callApi(uri, params, method, mergedHeaders, false, secret, secretKey, contentType)
                .catch(e => {
                    // 捕获网络异常
                    // Toast(e.message || '网络异常，请稍后再试~');
                    console.log('网络异常，请稍后再试~')
                });
            return new Promise((resolve) => {
                if (result) {
                    // 判断接口错误
                    if (!result.success) {
                        // Toast(result.message || '网络异常，请稍后再试~');
                        console.log('网络异常，请稍后再试~')
                    }
                    // 返回整个结果
                    resolve(result);
                } else {
                    resolve({ success: false, data: '' });
                }
            })
        }
    }

    return api;
}
/**
 * 轮询接口
 * @ctype PROCESS
 * @description 轮询接口
 * @outputs {success:'轮询成功',failed:'轮询失败'}
 * @param {function} successFunc - 成功判断方法
 * @param {string} uri - 相对链接
 * @param {object} [params] - 参数
 * @param {number} [maxTimes=10] - 轮询次数
 * @param {number} [delay=500] - 轮询间隔(ms)
 * @param {'get' | 'post'} [method='get'] - http方法
 * @param {object} [headers] - 头部
 * @param {boolean} [justData=true] - 只返回data
 * @returns
 * data object data字段
 * @throws {{code:'210001'}} 网络异常
 * @throws {{code:'210003'}} 请求超时
 * @example 轮询状态查询的请求
 * const data = await polling(resp=>resp.status == 1, 'getOrderStatus.query').catch(e=>{
 *   console.log('轮询失败，失败原因:', e.code, e.message)
 * })
 * if(data){
 *   console.log('轮询成功，data字段：', data)
 * }
 */


export function polling(successFunc, uri, params, maxTimes = 10, delay = 500, method = 'get', headers, justData = true) {
    let p = Promise.resolve();
    for (let i = 0; i < maxTimes; i++) {
        p = p.then(func);
        p = p.then(() => {
            return new Promise(resolve => setTimeout(resolve, delay));
        });
    }
    let lastResp;
    return p.then((res) => {
        // console.log('轮询一次结束',res)
    }, (e) => {
        if (e === 'success') {
            if (justData) {
                //后端统一返回data字段
                if (lastResp.success) {
                    return lastResp.data;
                }
                else {
                    console.log(lastResp)
                    Toast(lastResp.message)
                    //错误处理
                }
            }
            else {
                return lastResp;
            }
        }
        throw e;
    });
    function func() {
        if (store.EndPolling) {
            return
        }
        return callApi(uri, params, method, headers, false).then((resp) => {
            if (successFunc(resp)) {
                lastResp = resp;
                return Promise.reject('success');
            }
        }, (e) => {
            // debugger
            return Promise.reject(e);
        });
    }
}
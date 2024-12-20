import { currentEnvironment } from '../../config/scripts/assets/currentEnvironment';
import jsmd5 from 'js-md5';

/**
 * 发送 HTTP 请求
 * @param {string} url - 请求的 URL
 * @param {Object} [params={}] - 请求参数
 * @param {string} [method='GET'] - 请求方法 ('GET' 或 'POST')
 * @param {Object} [headers={}] - 请求头
 * @param {string} [requestContentType='form'] - 请求内容类型 ('form', 'json', 'plain')
 * @param {boolean} [secret=false] - 是否加密
 * @param {string} [secretKey] - 加密 key
 * @returns {Promise<string>} - 返回响应文本的 Promise
 */
export default async function fetchRequest(url, params = {}, method = 'GET', headers = {}, requestContentType = 'form', secret = false, secretKey) {
    try {
        // 处理请求参数
        params = JSON.parse(JSON.stringify(params)); // 过滤掉 undefined
        const isGet = method.toUpperCase() === 'GET';
        let body, now = Date.now();

        // 设置请求体和 Content-Type
        switch (requestContentType) {
            case "form":
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
                params._t = now;
                body = paramsToQuery(params, secret, secretKey);
                break;
            case "json":
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(params);
                break;
            case "plain":
                headers['Content-Type'] = 'text/plain';
                body = params;
                break;
            default:
                throw new Error(`Unsupported requestContentType: ${requestContentType}`);
        }

        // 处理 URL
        let openUrl = url;
        const urlProcess = window['url_process'];
        if (urlProcess) {
            openUrl = urlProcess(openUrl);
        }
        openUrl = isGet ? urlJoin(openUrl, body) : urlJoin(openUrl, `_t=${now}`);

        // 发送请求
        const response = await fetch(openUrl, {
            method: method.toUpperCase(),
            headers,
            body: isGet ? undefined : body
        });

        if (!response.ok) {
            handleFetchError(response);
        }

        const responseText = await response.text();
        return responseText;
    } catch (error) {
        // 处理网络错误
        throw new Error(`Network error: ${error.message}`);
    }
}

/**
 * 将对象转换为查询字符串
 * @param {Object} params - 请求参数
 * @param {boolean|function} secret - 是否加密或加密函数
 * @param {string} [key] - 加密 key
 * @returns {string} - 查询字符串
 */
export function paramsToQuery(params, secret, key) {
    if (params && Object.keys(params).length > 0) {
        if (typeof secret === 'function') {
            params['sign'] = secret(params, key);
        } else if (secret) {
            params['sign'] = signQuery(params, key);
        }
    }
    return obj2query(params);
}

/**
 * 生成加密签名
 * @param {Object} params - 请求参数
 * @param {string} key - 加密 key
 * @returns {string} - MD5 签名
 */
export function signQuery(params, key) {
    const sortedKeys = Object.keys(params).sort();
    const queryString = sortedKeys.map(k => `${k}=${params[k]}`).concat(`key=${key}`).join('&');
    return md5(queryString);
}

/**
 * 拼接 URL 和查询字符串
 * @param {string} url - 基础 URL
 * @param {string} [query] - 查询字符串
 * @returns {string} - 拼接后的 URL
 */
export function urlJoin(url, query) {
    if (!query) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${query}`;
}

/**
 * 将对象转换为查询字符串
 * @param {Object} obj - 待转对象
 * @returns {string} - 查询字符串
 */
export function obj2query(obj) {
    if (!obj) return '';
    return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('&');
}

/**
 * 获取字符串的 MD5 值
 * @param {string} source - 源字符串
 * @returns {string} - MD5 字符串
 */
export function md5(source) {
    return jsmd5(source);
}

/**
 * 处理 fetch 错误
 * @param {Response} response - fetch 的 Response 对象
 * @throws {Error} - 抛出错误
 */
export function handleFetchError(response) {
    let message = 'Network error, please check your connection.';
    switch (response.status) {
        case 404:
            message = `${response.url} 404 (Not Found)`;
            break;
        case 429:
            message = 'The service is too busy, please try again later.';
            break;
        default:
            break;
    }
    throw new Error(message);
}

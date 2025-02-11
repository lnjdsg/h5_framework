import axios from 'axios';

/**
 * 发送 HTTP 请求
 * @param {string} url - 请求的 URL
 * @param {Object} [params={}] - 请求参数
 * @param {string} [method='GET'] - 请求方法 ('GET' 或 'POST')
 * @param {Object} [headers={}] - 请求头
 * @param {string} [requestContentType='form'] - 请求内容类型 ('form', 'json', 'plain')
 * @param {boolean} [secret=false] - 是否加密
 * @param {string} [secretKey] - 加密 key
 * @param {string} [responseType='json'] - 响应类型 ('json', 'blob', etc.)
 * @returns {Promise<any>} - 返回响应数据
 */
export default async function ajax(url, params = {}, method = 'GET', headers = {}, requestContentType = 'form', secret = false, secretKey, responseType = 'json') {
    try {
        // 设置默认请求头
        headers = { 'Content-Type': 'application/json', ...headers };

        // 处理请求参数
        const isGet = method.toUpperCase() === 'GET';
        let body;

        // 根据 requestContentType 设置请求体
        switch (requestContentType) {
            case "form":
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
                body = obj2query(params);  // 如果是 form，转换为 query string
                break;
            case "json":
                body = JSON.stringify(params);
                break;
            case "plain":
                body = params;
                break;
            default:
                throw new Error(`Unsupported requestContentType: ${requestContentType}`);
        }

        // 使用 axios 发送请求
        const config = {
            method: method.toUpperCase(),
            url,
            headers,
            params: isGet ? params : undefined,  // GET 请求的参数通过 params
            data: !isGet ? body : undefined,   // 非 GET 请求通过 data
            responseType,  // 设置响应类型
        };

        const response = await axios(config);

        // 如果是 Blob 类型，返回 Blob 数据，适用于文件下载等场景
        if (responseType === 'blob') {
            return response.data;  // 返回 Blob 数据
        }

        return response.data;  // 对于其他类型的响应，直接返回响应数据
    } catch (error) {
        // 错误处理
        console.error('Request failed:', error);
        throw new Error('请求失败，请稍后再试');
    }
}

/**
 * 将对象转换为查询字符串
 * @param {Object} obj - 待转对象
 * @returns {string} - 查询字符串
 */
export function obj2query(obj) {
    if (!obj) return '';
    return Object.entries(obj)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
}

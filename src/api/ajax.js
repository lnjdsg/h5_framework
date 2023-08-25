
/**
 * Created by 六年级的时光 on 2023/4/09.
 */
import { currentEnvironment } from '../../config/scripts/assets/currentEnvironment';
import jsmd5 from 'js-md5';
/**
 * ajax请求
 * @param url
 * @param params
 * @param method
 * @param headers
 * @param requestContentType
 * @param secret 是否加密
 * @param secretKey 加密key
 */
export default function ajax(url, params = {}, method = 'get', headers = {}, requestContentType = 'form', secret = false, secretKey) {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window["XMLHttpRequest"]) {
            xhr = new XMLHttpRequest();
        }
        else if (window["ActiveXObject"]) {
            xhr = new window["ActiveXObject"](undefined);
        }
        else {
            alert('no xhr');
        }
        if (xhr != null) {
            if (params) {
                params = JSON.parse(JSON.stringify(params)); //过滤掉undefined
            }
            const isGet = method.toUpperCase() === 'GET';
            let body, now = Date.now();
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
            }

            headers['userToken'] = getUrlParam('userToken') || "";
            headers['userId'] = getUrlParam('userId') || "";
            headers['staffToken'] = getUrlParam('staffToken') || "";
            // headers['appKey'] = 'custombus-js';

            document.cookie = "SESSION=NjQzOGVlMTMtODNmMC00ZTMyLWFlYjItNDc0ZWVjNWI5YzRh"

            let openUrl = url;
            let urlProcess = window['url_process'];
            if (urlProcess) {
                openUrl = urlProcess(openUrl);
            }
            if (isGet) {
                openUrl = urlJoin(openUrl, body);

            }
            else {
                openUrl = urlJoin(openUrl, '_t=' + now);
            }

            //可以 const NODE_ENV = process.env.NODE_ENV，直接取值。
            //这里先绕一下吧，跑命令的时候 可以看到输出当前是啥环境，不容易搞错值，QAQ
            // if (currentEnvironment === 'test') {
            //     openUrl = 'https://custom-webapi-test.ibuscloud.com/' + openUrl
            // }

            // else if (currentEnvironment === 'production') {    
            //     openUrl = 'https://customapi.ibuscloud.com/' + openUrl
            // }
            // else if (currentEnvironment === 'development') {
            //     //  开发环境好像 不需要？？？？  看数知梦后台怎么搞吧
            //     openUrl = 'https://custom-webapi-dev.ibuscloud.com/' + openUrl
            // }
            // openUrl = 'http://192.168.0.120:8087/' + openUrl
            openUrl = 'https://custom-webapi-dev.ibuscloud.com/' + openUrl
            xhr.timeout = 10000;

            xhr.open(method, openUrl, true);
            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
            xhr.responseType = 'text';
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(xhr.response);
                }
            };
            xhr.onerror = () => {
                //todo 网络错误，请检查网络是否通畅  最好外面去做这一层toast
            };
            xhr.onloadend = () => {
                const { status } = xhr;

                if (status !== 200) {
                    // let code = ERRORS.NET_ERROR;
                    let message = '网络错误，请检查网络是否通畅';
                    switch (status) {
                        case 404:
                            message = url + ' 404 (Not Found)';
                            break;
                        case 429: //接口限流
                            message = '活动太火爆了，请稍后再试~';
                            try {
                                const respObj = JSON.parse(xhr.response);
                                message = respObj.message;
                            }
                            catch (e) {
                            }
                            break;
                    }
                    /*todo 网络错误，请检查网络是否通畅  最好外面去做这一层toast*/
                    reject();
                }
            };
            xhr.ontimeout = () => {
                /*请求超时*/
                reject();
            };
            if (isGet) {
                xhr.send();
            }
            else {
                xhr.send(body);
            }
        }
    });
}
export function paramsToQuery(params, secret, key) {
    if (params && Object.keys(params).length > 0) {
        if (typeof secret === 'function') {
            params['sign'] = secret(params, key);
        }
        else if (secret) {
            params['sign'] = signQuery(params, key);
        }
    }
    return obj2query(params);
}

function signQuery(params, key) {
    let keys = Object.keys(params);
    keys.sort();
    let arr = [];
    for (let key of keys) {
        arr.push(key + '=' + params[key]);
    }
    arr.push('key=' + key);
    let query = arr.join('&');
    return md5(query);
}
/**
 * url拼接
 * @ctype PROCESS
 * @description url拼接
 * @param {string} url - url
 * @param {string} query - query
 * @returns
 * url string 拼接后的url
 * @example 一般用法
 * const url = urlJoin('http://baidu.com.cn', 'xxx=hello&xx=777')
 * console.log(url); //http://baidu.com.cn?xxx=hello&xx=777
 */
export function urlJoin(url, query) {
    if (query) {
        url += url.indexOf('?') < 0 ? '?' : '';
        url += url[url.length - 1] === '?' ? '' : '&';
        return url + query;
    }
    else {
        return url;
    }
}
/**
 * 对象转query字符串
 * @ctype PROCESS
 * @description 对象转query字符串
 * @param {string} obj - 待转对象
 * @returns
 * queryString string query字符串
 * @example 一般用法
 * const query = obj2query({aaa: 'hello', bb: 123})
 * console.log(query); //aaa=hello&bb=123
 */
export function obj2query(obj) {
    if (!obj) {
        return '';
    }
    let arr = [];
    for (let key in obj) {
        arr.push(key + (key ? '=' : '') + obj[key]);
    }
    return arr.join('&');
}


/**
 * MD5
 * @ctype PROCESS
 * @description 获取字符串的md5
 * @param {string} source 源字符串
 * @returns
 * md5 string md5字符串
 */
export function md5(source) {
    return jsmd5(source);
}




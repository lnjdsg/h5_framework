//前端监控
export const frontendMonitoring111 = function () {

    // 全局统一处理Promise
    window.addEventListener("unhandledrejection", function (e) {
        console.log('捕获到异常：', e);
    });

    // 图片、script、css加载错误，都能被捕获 
    window.addEventListener('error', (error) => {
        console.log('捕获到异常：', error);
    }, true)

    /**
    * @param {String}  message    错误信息  
    * @param {String}  source    出错文件
    * @param {Number}  lineno    行号
    * @param {Number}  colno    列号
    * @param {Object}  error  Error对象
    */
    // 常规运行时错误，可以捕获  异步错误，可以捕获
    window.onerror = function (message, source, lineno, colno, error) {
        console.log('捕获到异常：', { message, source, lineno, colno, error });
    }

}
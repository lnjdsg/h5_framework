/**
 * Created by 六年级的时光 on 2021/12/26.
 *
 * toast队列管理
 */
import { Toast } from "./toast";
const toastQueue = [];
let toastShowing = false;
/**
 * 追加一个Toast
 * @ctype PROCESS
 * @description 一个接一个弹出
 * @param {string|HTMLElement} content - 内容
 * @param {number} [time=2000] - 停留时间ms
 * @param {Object} [options] - 配置项
 * @param {string} [options.itemClass] - 单项包装样式类
 * @param {string} [options.contentClass] - 单项内容样式类
 * @param {boolean} [options.hideOthers=false] - 隐藏其他Toast
 * @param {function} [options.didClose] - 当关闭后触发
 */
export function appendToast(content, time, options = {}) {
    toastQueue.push({ content, time, options });
    if (!toastShowing) {
        _showAToast();
    }
}
function _showAToast() {
    if (toastQueue.length === 0) {
        return;
    }
    const { content, time, options } = toastQueue.shift();
    toastShowing = true;
    const { didClose } = options;
    options.didClose = function () {
        toastShowing = false;
        _showAToast();
        didClose && didClose();
    };
    Toast(content, time, options);
}

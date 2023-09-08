/**
 * Created by 六年级的时光 on 2023/4.17.
 */
import { parseHtml } from "@src/utils/utils";
import "./style.less";
import { getLayer } from "./utils";
let toastWrapper;
const toastItems = [];
function getWrapper() {
    
    if (!toastWrapper) {
        const layer = getLayer('toast');
        toastWrapper = document.createElement("div");
        toastWrapper.className = 'wrapper';
        layer.appendChild(toastWrapper);
    }
    return toastWrapper;
}
function createToastItem(opt) {
    let content = opt.content;
    let options = opt.options;
    const wrapperClass = options.itemClass || '';
    const contentClass = options.contentClass || '';
    let el = parseHtml(`<div class="toast-message ${wrapperClass}">
	<div class="toast-content ${contentClass}"></div>
</div>`);
    let contentEl = el.children[0];
    if (typeof content === 'string') {
        if (content.indexOf('<') >= 0 && content.indexOf('>') >= 0) {
            contentEl.innerHTML = content;
        }
        else {
            contentEl.innerText = content;
        }
    }
    else {
        contentEl.appendChild(content);
    }
    return el;
}
/**
 * Toast
 * @ctype PROCESS
 * @description Toast
 * @param {string|HTMLElement} content - 内容
 * @param {number} [time=2000] - 停留时间ms
 * @param {Object} [options] - 配置项
 * @param {string} [options.itemClass] - 单项包装样式类
 * @param {string} [options.contentClass] - 单项内容样式类
 * @param {boolean} [options.hideOthers=false] - 隐藏其他Toast
 * @param {function} [options.didClose] - 当关闭后触发
 * @returns
 * hide function 主动隐藏当前Toast实例的方法
 * @example 一般调用
 * Toast('hello')
 * @example 主动隐藏
 * const hideMe = Toast('hello', 0)  //时间传入0表示不自动隐藏
 * setTimeout(hideMe, 5000) //5秒后隐藏
 */
export function Toast(content, time = 2000, options = {}) {
    const wrapper = getWrapper();
    const { hideOthers = false, didClose } = options;
    if (hideOthers) {
        for (let item of toastItems) {
            item(false);
        }
    }
    let hidden = false;
    let toastItem = createToastItem({ content, options });
    toastItems.push(hide);
    wrapper.appendChild(toastItem);
    setTimeout(() => {
        toastItem.style.opacity = '1';
        if (time > 0) {
            setTimeout(hide, time);
        }
    });
    return hide;
    function hide(anim = true) {
        if (hidden) {
            return;
        }
        hidden = true;
        hideToast(toastItem, anim, didClose);
    }
}
function hideToast(toastItem, anim = true, didClose) {
    toastItems.splice(toastItems.indexOf(toastItem), 1);
    const wrapper = getWrapper();
    if (anim) {
        toastItem.style.opacity = '0';
        setTimeout(() => {
            if (toastItem.parentNode) {
                wrapper.removeChild(toastItem);
            }
            didClose && didClose();
        }, 300);
    }
    else {
        if (toastItem.parentNode) {
            wrapper.removeChild(toastItem);
        }
        didClose && didClose();
    }
}

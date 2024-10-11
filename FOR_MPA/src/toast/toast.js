import { parseHtml } from "@src/utils/utils";
import "./style.less";
import { getLayer } from "./utils";

let toastWrapper;
const toastItems = [];
let lastToastTime = 0; // 存储上一次显示 Toast 的时间

function getWrapper() {
    if (!toastWrapper) {
        const layer = getLayer('toast');
        toastWrapper = document.createElement("div");
        toastWrapper.className = 'wrapper';
        layer.appendChild(toastWrapper);
    }
    return toastWrapper;
}

function createToastItem({ content, options }) {
    const wrapperClass = options.itemClass || '';
    const contentClass = options.contentClass || '';
    const el = parseHtml(`
        <div class="toast-message ${wrapperClass}">
            <div class="toast-content ${contentClass}"></div>
        </div>
    `);
    const contentEl = el.querySelector('.toast-content');

    // 设置内容并防止 XSS
    if (typeof content === 'string') {
        contentEl.innerHTML = content.includes('<') ? content : escapeHtml(content);
    } else {
        contentEl.appendChild(content);
    }

    return el;
}

// 转义 HTML 防止 XSS 攻击
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Toast
 * @param {string|HTMLElement} content - Toast 内容
 * @param {number} [time=2000] - 停留时间 ms
 * @param {Object} [options] - 配置项
 * @param {string} [options.itemClass] - 单项包装样式类
 * @param {string} [options.contentClass] - 单项内容样式类
 * @param {boolean} [options.hideOthers=false] - 隐藏其他 Toast
 * @param {function} [options.didClose] - 关闭后触发的回调
 * @returns {function} 主动隐藏当前 Toast 的方法
 */
export function Toast(content, time = 2000, options = {}) {
    if (!content) return;

    const currentTime = Date.now();
    // 检查是否距离上一次 Toast 超过 2000ms
    if (currentTime - lastToastTime < 2000) return;

    lastToastTime = currentTime; // 更新上一次 Toast 的时间

    const wrapper = getWrapper();
    const { hideOthers = false, didClose } = options;

    // 隐藏其他 Toast
    if (hideOthers) {
        toastItems.forEach(hide => hide(false));
    }

    let hidden = false;
    const toastItem = createToastItem({ content, options });
    toastItems.push(hide);
    wrapper.appendChild(toastItem);

    setTimeout(() => {
        toastItem.style.opacity = '1';
        if (time > 0) {
            setTimeout(hide, time);
        }
    }, 0); // 确保在添加到 DOM 后运行

    return hide;

    function hide(anim = true) {
        if (hidden) return;
        hidden = true;
        hideToast(toastItem, anim, didClose);
    }
}

function hideToast(toastItem, anim = true, didClose) {
    const index = toastItems.indexOf(toastItem);
    if (index > -1) {
        toastItems.splice(index, 1);
    }
    const wrapper = getWrapper();

    if (anim) {
        toastItem.style.opacity = '0';
        setTimeout(() => {
            if (toastItem.parentNode) {
                wrapper.removeChild(toastItem);
            }
            didClose?.(); // 使用可选链调用回调
        }, 300);
    } else {
        if (toastItem.parentNode) {
            wrapper.removeChild(toastItem);
        }
        didClose?.();
    }
}

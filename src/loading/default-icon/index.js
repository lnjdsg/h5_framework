
import { parseHtml } from '@src/utils/utils';
import './index.less';
export function DefaultIcon() {
    const loading = document.createElement("div");
    loading.className = 'sui-default-icon';
    let count = 8;
    let perDelay = 1500 / count;
    let perDeg = 360 / count;
    for (let i = 0; i < count; i++) {
        let part = parseHtml(`<div class="part" style="transform:rotate(${i * perDeg}deg); ">
            <div class="part-body" style="animation-delay:${-(count - i) * perDelay}ms;"></div>
            </div>`);
        loading.appendChild(part);
    }
    return loading;
}

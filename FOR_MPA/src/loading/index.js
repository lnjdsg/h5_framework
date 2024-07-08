/**
 * Created by wengyang on 2023/4/11
 */
import "./style.less";
import './top-layer.less';
import { DefaultIcon } from "./default-icon";
export * from "./default-icon";
let LoadingIcon = DefaultIcon;
let _wrapper, _loading, _label;
let _visible = false;
let _timerHide;
function prepare() {
    if (!_wrapper) {
        _wrapper = document.createElement('div');
        _wrapper.className = 'wrapper';
        _loading = LoadingIcon();
        _wrapper.appendChild(_loading);
        _label = document.createElement("div");
        _label.className = 'label';
        _wrapper.appendChild(_label);
    }
}
export function configLoading(loadingIcon) {
    LoadingIcon = loadingIcon;
}
/**
 * 显示loading
 * @ctype PROCESS
 * @description 显示loading
 * @param {string} [text] - 文本内容
 * @param {Object} [options] - 配置项
 * @param {number} [options.bgOpacity=0.7] - 背景不透明度
 * @example 一般调用
 * showLoading('加载中…')
 */
export function showLoading(text, options) {
    _visible = true;
    clearTimeout(_timerHide);
    prepare();
    const layer = getLayer('loading');
    layer.style.pointerEvents = 'auto';
    layer.appendChild(_wrapper);
    _label.innerHTML = text !== undefined && text !== null ? text : '';
    const opacity = (options === null || options === void 0 ? void 0 : options.bgOpacity) || 0.7;
    layer.style.opacity = opacity.toString();
}
/**
 * 隐藏loading
 * @ctype PROCESS
 * @description 隐藏loading
 * @outputs {success:'成功:隐藏成功'}
 * @example 一般调用
 * hideLoading()
 */
export function hideLoading() {
    if (!_visible) {
        return;
    }
    _visible = false;
    prepare();
    const layer = getLayer('loading');
    layer.style.opacity = '0';
    _timerHide = setTimeout(() => {
        layer.removeChild(_wrapper);
        layer.style.pointerEvents = 'none';
    }, 300);
}
export const Loading = {
    show: showLoading,
    hide: hideLoading,
};


let topLayer;
const layerNames = ['loading', 'toast'];
const layers = [];
export function getLayer(name) {
    if (!topLayer) {
        topLayer = document.createElement("div");
        topLayer.id = 'overlay_layer';
        for (let name of layerNames) {
            let layer = document.createElement("div");
            layer.id = name + '_layer';
            topLayer.appendChild(layer);
            layers[name] = layer;
        }
        document.body.appendChild(topLayer);
    }
    return layers[name];
}
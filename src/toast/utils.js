/**
 * Created by 六年级的时光 on 2020/12/16.
 */
import './top-layer.less';
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

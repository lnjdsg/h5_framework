(function (document, window) {
    var rootElement = document.documentElement;
    var isIOS = navigator.userAgent.match(/iphone|ipod|ipad/gi);
    var devicePixelRatio = isIOS ? Math.min(window.devicePixelRatio, 3) : 1;
    //事件作为页面大小调整的触发事件
    var resizeEvent = "orientationchange" in window ? "orientationchange" : "resize";
    
    rootElement.dataset.dpr = devicePixelRatio;

    var viewportMeta, hasViewportMeta = false;
    var metaTags = document.getElementsByTagName("meta");
    for (var i = 0; i < metaTags.length; i++) {
        var metaTag = metaTags[i];
        if (metaTag.name === "viewport") {
            hasViewportMeta = true;
            viewportMeta = metaTag;
            break;
        }
    }
    //width=device-width ：将视口的宽度设置为设备的宽度，以确保页面在不同设备上以正确的比例显示。 
    //initial-scale=1.0 ：设置初始缩放比例为 1.0，即不进行缩放。 
    //maximum-scale=1.0 ：设置最大缩放比例为 1.0，禁止用户进行放大操作。 
    //minimum-scale=1.0 ：设置最小缩放比例为 1.0，禁止用户进行缩小操作。 
    //user-scalable=no ：禁止用户进行缩放操作。 
    if (hasViewportMeta) {
        viewportMeta.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no";
    } else {
        var newViewportMeta = document.createElement("meta");
        newViewportMeta.name = "viewport";
        newViewportMeta.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no";
        rootElement.firstElementChild.appendChild(newViewportMeta);
    }

    var setFontSize = function () {
        //获取根元素的客户端宽度
        var clientWidth = rootElement.clientWidth;
        //获取设计宽度（即期望的页面宽度）并存储在变量  designWidth  中。如果没有指定设计宽度，则默认为 750。 
        var designWidth = window['designWidth'] || 750;
        //判断当前设备的屏幕宽度是否超过了设计宽度。如果超过了，则将  clientWidth  重新计算为  designWidth * devicePixelRatio ，以适应高像素密度的设备（如 Retina 屏幕）。
        if (clientWidth / devicePixelRatio > designWidth) {
            clientWidth = designWidth * devicePixelRatio;
        }
        //计算并存储缩放比例  remScale ，即当前设备的实际宽度与设计宽度的比值
        window.remScale = clientWidth / designWidth;
        rootElement.style.fontSize = 100 * (clientWidth / designWidth) + "px";
    };

    setFontSize();

    if (document.addEventListener) {
        window.addEventListener(resizeEvent, setFontSize, false);
    }
})(document, window);
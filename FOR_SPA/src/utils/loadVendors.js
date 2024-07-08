//加载第三方sdk
export const loadVendors = function () {

    var ua = navigator.userAgent.toLowerCase();
    console.log('ua:', ua)
    if (ua.indexOf("miniprogram") != -1) {
        //微信小程序;
        console.log('微信小程序')
        return
    }
    if (ua.indexOf("alipay") != -1) {
        //支付宝小程序;
        console.log('支付宝小程序')
        return
    }
    //判断是支付宝 
    if (ua.match(/AlipayClient/i) == 'alipayclient') {
        console.log('支付宝')
        return
    }

    if (/android/i.test(navigator.userAgent)) {
        console.log("Android");//Android
        const script = document.createElement('script');
        script.src = '第三方sdk';
        // script.async = true;
        document.body.appendChild(script);
        setTimeout(() => {
            dd.ready(function () {
                dd.ui.pullToRefresh.disable();
            });
        }, 2000)

    }


}
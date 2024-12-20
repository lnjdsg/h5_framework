//性能检测
export const launchPerformance = function () {
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes;
    var regex = /(localhost|test|dev)/i; // 正则表达式匹配 localhost、test 或 dev
    var filterateUrl =  !regex.test(window.location.hostname);
    console.log('filterateUrl:',filterateUrl)
    // 创建一个PerformanceObserver对象
    const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // 遍历所有 paint 类型的性能条目
        for (const entry of entries) {
            //首次绘制，绘制Body
            if (entry.name === 'first-paint') {
                let t = (entry.startTime / 1000).toFixed(2)
                console.log('白屏 时间：', t, '秒');

                if (!filterateUrl) {
                    console.log('本地调试不上报 first-paint')
                } else {
                    let str = `time=${t}&msg=first-paint`
                    window?.__bl && window?.__bl.error(new Error(str))
                }
            }
            //首次有内容的绘制，第一个dom元素绘制完成
            if (entry.name === 'first-contentful-paint') {
                let t = (entry.startTime / 1000).toFixed(2)
                console.log('首次有内容的绘制 时间：', t, '秒');

                if (!filterateUrl) {
                    console.log('本地调试不上报 first-contentful-paint')
                } else {
                    let str = `time=${t}&msg=first-contentful-paint`
                    window?.__bl && window?.__bl.error(new Error(str))
                }
            }
        }

    });
    // 开始观察 paint 类型的性能条目
    // if (supportedEntryTypes.includes('paint')) {
    try {
        paintObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
        console.log(' paintObserver.observe({ entryTypes: [paint] }); 不支持')
    }
    // }

    // 网页需要多长时间才能提供完整交互功能 长任务
    const longtaskobserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            let t = (entry.startTime / 1000).toFixed(2)
            console.log('完整交互功能 时间：', t, '秒');

            if (!filterateUrl) {
                console.log('本地调试不上报 longtask')
            } else {
                let str = `time=${t}&msg=longtask`
                window?.__bl && window?.__bl.error(new Error(str))
            }
        }

    });
    try {
        longtaskobserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {
        console.log('longtaskobserver.observe({ entryTypes: [longtask] }) 不支持')
    }

    // 计算一些关键的性能指标 TTI
    window.addEventListener('load', (event) => {
        //可交互时间是指网页需要多长时间才能提供完整交互功能
        let timing = performance.getEntriesByType('navigation')[0];
        let diff = timing.domInteractive - timing.fetchStart;
        let t = (diff / 1000).toFixed(2)
        console.log('网页需要多长时间才能提供完整交互功能: 时间：', t, '秒');

        if (!filterateUrl) {
            console.log('本地调试不上报 tti' )
        } else {
            let str = `time=${t}&msg=tti`
            window?.__bl && window?.__bl.error(new Error(str))
        }

    })

    //“累积布局偏移”旨在衡量可见元素在视口内的移动情况 正常是小于0.1
    let cls = 0;
    var clsVal = null
    const entryHandler = (list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                cls += entry.value;
            }
        }
        clsVal && clearTimeout(clsVal)
        clsVal = setTimeout(() => {
            let t = (cls / 1000).toFixed(0)
            console.log('累计偏移量 时间：', t, '毫秒');

            if (!filterateUrl) {
                console.log('本地调试不上报 cls')
            } else {
                let str = `time=${t}&msg=cls`
                window?.__bl && window?.__bl.error(new Error(str))
            }

        }, 2000)
    };
    const clsObserver = new PerformanceObserver(entryHandler);

    try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
        console.log(error)
        console.log('clsObserver.observe({ type: layout-shift, buffered: true });; 不支持')
    }


    // 首次内容渲染和可交互时间之间的所有时间段的总和
    const tblObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let totalBlockingTime = 0;

        for (const entry of entries) {
            if (entry.entryType === 'longtask') {
                totalBlockingTime += entry.duration;
            }
        }
        console.log('首次内容渲染和可交互时间之间的所有时间段的总和：', totalBlockingTime, '毫秒');

        if (!filterateUrl) {
            console.log('本地调试不上报 totalBlockingTime')
        } else {
            // let str = `time=${t}&msg=totalBlockingTime`
            // window?.__bl && window?.__bl.error(new Error(str))
        }

    });

    try {
        tblObserver.observe({ type: 'longtask', buffered: true });
    } catch (error) {
        console.log(error)
        console.log('tblObserver.observe({ type: longtask, buffered: true }) 不支持')
    }

    //标记了渲染出最大文本或图片的时间
    var lcpTime = 0
    var lcpTimeVal = null
    window.addEventListener('DOMContentLoaded', function () {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcpEntry = entries[entries.length - 1];
            lcpTime += lcpEntry.renderTime || lcpEntry.loadTime;
            // 如果还没有显示过结果，则输出
            lcpTimeVal && clearTimeout(lcpTimeVal)
            lcpTimeVal = setTimeout(() => {
                let t = (lcpTime / 1000).toFixed(1)
                console.log('最大文本或图片的时间：', t, '秒');

                if (!filterateUrl) {
                    console.log('本地调试不上报 largest-contentful-paint')
                } else {
                    let str = `time=${t}&msg=largest-contentful-paint`
                    window?.__bl && window?.__bl.error(new Error(str))
                }

            }, 2000)

        });

        try {
            observer.observe({ type: 'largest-contentful-paint', buffered: true })
        } catch (error) {
            console.log('observer.observe({ type: largest-contentful-paint, buffered: true }) 不支持')
        }
        // }
    });

    //速度指数表明了网页内容的可见填充速度
    // function calculateSpeedIndex() {
    // 测量页面开始渲染的时间
    performance.mark('startRender');
    // 等待页面完全加载
    window.addEventListener('load', () => {
        // 测量页面渲染完成的时间
        performance.mark('endRender');
        // 计算Speed Index
        performance.measure('renderTime', 'startRender', 'endRender');
        const renderTime = performance.getEntriesByName('renderTime')[0].duration;
        const speedIndex = renderTime / 2; // 根据您的具体需求进行调整

        let t = (speedIndex / 1000).toFixed(2)
        console.log('网页内容的可见填充速度：', t, '秒');

        if (!filterateUrl) {
            console.log('本地调试不上报 speedIndex')
        } else {
            let str = `time=${t}&msg=speedIndex`
            window?.__bl && window?.__bl.error(new Error(str))
        }

    });

}


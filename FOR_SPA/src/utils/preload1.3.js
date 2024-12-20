
import { RES_PATH } from '../../crimsonrc'

/**
 * 预加载资源（/png|jpg|jpeg|svga|spi|json|mp3|wav/）
 * @param {string[]} urlList 资源地址列表
 * @param {number} batchNum 每批并行加载的资源个数（一般来说该数字越大整体加载速度越快，但加载前期会更卡顿）
 * @param {Function} [onProgress] 加载进度回调，每加载完一个资源回调一次，入参为进度值（0，1]
 * @returns {Promise} 返回一个只会resolve(loadedData)的promise，loadedData保存了所有预加载好的资源，可通过相对路径索引
 * @example 
 * //例
 * const loadedData = await PreloadAsset(urlList, 10, onProgress);
 * const image = loadedData['image/fish.png'];
 * const svgaData = loadedData['svga/fish.svga'];
 * const spiData = loadedData['spine/fish.spi'];
 * const lottieData = loadedData['lottie/fish.json'];
 */
export function preloadAsset(urlList, batchNum, onProgress) {
    return new Promise((resolve) => {
        /** 要加载资源总数 */
        const totalNum = urlList.length;
        /** 要加载的资源索引 */
        let assetIndex = -1;
        /** 已加载完毕的资源个数 */
        let loadedNum = 0;
        /** 存放加载好的数据，用地址索引 */
        const loadedData = {};
        /** 加载逻辑 */
        const doLoad = async () => {
            if (loadedNum >= totalNum) {
                totalNum == 0 && onProgress && onProgress(1);  // 无加载资源时，即为假loading
                resolve(loadedData); // 加载完毕
            } else {
                assetIndex++;
                if (assetIndex >= totalNum) return
                const key = urlList[assetIndex];
                const url = RES_PATH + urlList[assetIndex];
                const result = await loadOneAsset(url);
                if (!result) {
                    console.warn('加载异常', url);
                }
                loadedData[key] = result;
                loadedNum++;
                onProgress && onProgress(loadedNum / totalNum);
                doLoad();
            }
        }
        batchNum = batchNum || 1;
        for (let index = 0; index < batchNum; index++) {
            doLoad();
        }
    })
}

/**
 * 加载一个资源
 * @param {string} url 地址
 */
async function loadOneAsset(url) {
    const fileType = url.split('.').pop();
    switch (true) {
        case (/png|jpg|jpeg/).test(fileType):
            return await loadOneImg(url);
        case (/svga/).test(fileType):
    
        // case (/spi/).test(fileType):
        //     return await loadOneSpi(url);
        // case (/json/).test(fileType):
        //     return await loadOneJson(url);
        // case (/mp3|wav/).test(fileType):
        //     return await loadOneAudio(url);
        default:
            console.warn('非法资源', url);
            return false;
    }
}

/**
 * 加载一张图片
 * @param {string} url 地址
 */
function loadOneImg(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = err => {
            console.warn('load', url, err);
            resolve(false)
        };
        img.crossOrigin = 'Anonymous'
        img.src = url;
    })
}

/**
 * 加载一个svga
 * @param {string} url 地址
 */
function loadOneSvga(url) {
    // return new Promise(resolve => {
    //     loadSvga(url).then((data) => resolve(data[0])).catch(err => {
    //         console.warn('load', url, err);
    //         resolve(false)
    //     });
    // })
}

// /**
//  * 加载一个spine
//  * @param {string} url 地址
//  */
// function loadOneSpi(url) {
//     return new Promise(resolve => {
//         FYGE.loadSpine(url, spineData => {
//             resolve(spineData);
//         }, err => {
//             console.warn('load', url, err);
//             resolve(false);
//         })
//     })
// }

// /**
//  * 加载一个Json
//  * @param {string} url 地址
//  */
// function loadOneJson(url) {
//     return new Promise(resolve => {
//         FYGE.GlobalLoader.loadJson((result, res) => {
//             if (result) {
//                 resolve(res);
//             } else {
//                 console.warn('load fail', url);
//                 resolve(false);
//             }
//         }, url)
//     })
// }

// /**
//  * 加载一个音频
//  * @param {string} url 地址
//  */
//  function loadOneAudio(url) {
//     return new Promise(resolve => {
//         const sound = new Howl({
//             src: url,
//             onload: () => resolve(sound),
//             onloaderror: err => {
//                 console.warn('load fail', url, err);
//                 resolve(false);
//             },
//         });
//     })
// }





const fs = require('fs')
const path = require('path')
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const chalk = require('chalk');
/* 请先配置：预加载的资源文件夹名称，或者设置预加载、异步加载资源路径*/
const preloadFolder = [];
const otherFolder = [''];
const initAssetList = {
    preLoadImg: [],
    asyncLoadImg: []
}

// async function webPerformance() {
//     // 启动 Chrome 浏览器
//     const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
//     // 设置 Lighthouse 的选项
//     const options = {
//         logLevel: 'silent', // 日志级别为 info，输出详细信息
//         output: 'html', // 生成 HTML 格式的报告
//         onlyCategories: ['performance', "accessibility", "best-practices"], // 只检查性能相关的指标
//         port: chrome.port // 使用 Chrome 实例的端口
//     };
//     // 运行 Lighthouse，对指定的网址进行性能检测
//     const runnerResult = await lighthouse('', options);
//     // 将生成的报告写入文件
//     const reportHtml = runnerResult.report;
//     fs.writeFileSync('webPerformance.html', reportHtml);
//     // 打印 Lighthouse 的结果信息
//     console.log(chalk.blueBright(`检测地址：${runnerResult.lhr.finalUrl}`));
//     console.log(chalk.green(`综合性能分：${runnerResult.lhr.categories.performance.score * 100}`));
   
//     // 关闭 Chrome 浏览器实例
//     await chrome.kill();
// }



//资源少 没有必要预处理，反而会多出网络请求，除非是首屏大页面
function searchFileFromFolder(folderPath = '/src/assets', regExp = /\.(png|jpg|jpeg|svga|spi|json|mp3|wav)$/i) {
    const preLoadImg = [], asyncLoadImg = [];
    const searchOneDir = (absolutePath, relativePath) => {
        fs.readdirSync(absolutePath).forEach(v => {
            const absPath = absolutePath + '/' + v;
            const relPath = relativePath ? relativePath + '/' + v : v;
            if (fs.statSync(absPath).isFile()) {
                if (regExp.test(v)) {
                    if (preloadFolder.includes(relPath.split('/')[0])) {
                        preLoadImg.push(relPath);
                    } else if (!otherFolder.includes(relPath.split('/')[0])) {
                        asyncLoadImg.push(relPath)
                    }
                }
            } else {
                searchOneDir(absPath, relPath);
            }
        });
    }
    searchOneDir(path.resolve('.') + folderPath, '');
    console.log('资源预处理成功~')
    return {
        preLoadImg: [
            ...initAssetList.preLoadImg,
            ...preLoadImg
        ],
        asyncLoadImg: [
            ...initAssetList.asyncLoadImg,
            ...asyncLoadImg
        ]
    };
}
// 读资源目录
const assetList = searchFileFromFolder();
// 写资源列表json 开发环境预处理
fs.writeFileSync(path.resolve('.') + '/src/assetList.json', JSON.stringify(assetList))
// cross-env NODE_ENV= 修改 当前环境域名
// fs.writeFileSync(path.resolve('.') + '/config/scripts/assets/currentEnvironment.js', `exports.currentEnvironment = ${JSON.stringify(process.env.NODE_ENV)}`)
// console.log(chalk.red(`开始性能检测`));
// webPerformance()
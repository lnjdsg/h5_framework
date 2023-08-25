const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const chalk = require("chalk");
const fs = require('fs-extra');

async function webPerformance() {
    // 启动 Chrome 浏览器
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    // 设置 Lighthouse 的选项
    const options = {
        logLevel: 'silent',
        output: 'html',
        onlyCategories: ['performance', 'accessibility', "best-practices", "seo"],
        port: chrome.port,
        locale: 'zh',
        config: {
        
        },
    };
    // 运行 Lighthouse，对指定的网址进行性能检测
    const runnerResult = await lighthouse(
        'https://dynamicbus-test.ibuscloud.com/index.html?latitude=30.295672&longitude=120.047501&token=CEEECCF6DBE6D4231FC11A5F0E91A68546DC46717101D4AC3D65913419954071&mo=17671277857&uid=21802&type=zfbmini_hangzhou',
        options
    );
    // console.log('runnerResult:', runnerResult)
    // 将生成的报告写入文件
    const reportHtml = runnerResult.report;
    fs.writeFileSync('webPerformance.html', reportHtml);
    // 打印 Lighthouse 的结果信息
    console.log(chalk.blueBright(`检测地址：${runnerResult.lhr.finalUrl}`));
    console.log(chalk.green(`综合性能分：${runnerResult.lhr.categories.performance.score * 100}`));
    console.log(
        chalk.yellow(`首屏渲染时间：${(runnerResult.lhr.audits['first-contentful-paint'].numericValue / 1000).toFixed(1)}s`),
        chalk.yellow(`, 首屏可交互时间：${(runnerResult.lhr.audits['interactive'].numericValue / 1000).toFixed(1)}s`)
    );

    // 关闭 Chrome 浏览器实例
    await chrome.kill();

    console.log(`${chalk.bgBlueBright(`build 正式结束`)}\n`);
}
console.log(chalk.red(`开始性能检测`));
webPerformance()




const path = require('path');
const fs = require('fs-extra');
const chalk = require("chalk");

const { copyAssets } = require('./utils');
const { startCompress } = require('./imagecompress');
const { Crimson_CONFIG, Crimson_CDN_RES_CFG } = require('./constant');

const { uploadFiles } = require("./autoupload");
const { getCdnFolderName } = require('./utils');
const { tinypPngMin } = require('./tinyPng');


const assets = async function (args) {
    const { imgmin, imgup } = args;
    const cdnFolderName = await getCdnFolderName();
    const appPath = process.cwd();
    const cfgUrl = path.resolve(appPath, Crimson_CONFIG);
    const crimsonConfig = require(cfgUrl);
    const assetsPathTo = path.resolve(appPath, crimsonConfig.OUTPUT_DIR, './assets');

    const assetsPathFrom = path.resolve(appPath, crimsonConfig.SOURCE_DIR, './assets');
    const PATH_ROOT = 'crimson/v2';
    //拷贝下config
    let newCrismonCfg = Object.assign({}, crimsonConfig);

    if (fs.existsSync(assetsPathTo)) {
        fs.removeSync(assetsPathTo);
    }
    const npm_lifecycle_event = process.env.npm_lifecycle_event
    console.log('npm_lifecycle_event:', npm_lifecycle_event)

    console.log(`${chalk.green(`eslint 校验通过`)}\n`);

    console.log(`${chalk.yellow(`开始拷贝资源`)}\n`);
    copyAssets();

    if (imgmin) {
        console.log(`${chalk.yellow(`资源开始压缩`)}\n`);
        try {
            console.log('assetsPathTo:', assetsPathTo)
            console.log('assetsPathFrom:', assetsPathFrom)
            // if (npm_lifecycle_event == "build_prod") {
            console.log(`${chalk.bgGreen(`正式环境 压缩图片`)}\n`);
            tinypPngMin(assetsPathFrom, assetsPathTo)
            // }
            // const result = await startCompress(assetsPathTo);
            // if (result) {
            //     console.log(`${chalk.blue(`资源压缩完成，${assetsPathTo}`)}\n`);
            // }
        } catch (e) {
            console.log(`${chalk.red(`资源压缩失败`, e)}\n`);
        }
    }
    if (imgup) {
        //本地包  暂时不需要传，等待后续是否需要接入oss
        // console.log(`${chalk.yellow(`开始上传资源`)}\n`);
    }
}
function slash(path) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }

    return path.replace(/\\/g, '/');
}


exports.assets = assets;
exports.uploadFiles = uploadFiles;


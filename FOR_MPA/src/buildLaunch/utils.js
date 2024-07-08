const path = require("path");
const fs = require("fs-extra");
const { Crimson_CONFIG, Crimson_CONFIG_DIR_KEY } = require("./constant");

const chalk = require("chalk");

exports.copyAssets = function () {
    const appPath = process.cwd();
    const crimsonConfig = require(path.join(appPath, Crimson_CONFIG));
    // 处理相对路径
    Crimson_CONFIG_DIR_KEY.map((key) => {
        crimsonConfig[key] = path.resolve(appPath, crimsonConfig[key]);
    });
    const assetsPathFrom = path.resolve(__dirname, crimsonConfig.SOURCE_DIR, './assets');
    const assetsPathTo = path.resolve(__dirname, crimsonConfig.OUTPUT_DIR, './assets');

    if (fs.existsSync(assetsPathFrom)) {
        if (!fs.existsSync(assetsPathTo)) {
            fs.mkdirsSync(assetsPathTo);
        }
        fs.copySync(assetsPathFrom, assetsPathTo, { overwrite: true });
        console.log(`${chalk.blue(`资源拷贝成功,等待压缩`)}\n`);
    } else {
        console.log(`${chalk.red(`警告：${assetsPathFrom}目录不存在！`)}\n`);
    }
    return assetsPathTo;

}
// 端口是否被占用
exports.getProcessIdOnPort = function (port) {
    try {
        const execOptions = {
            encoding: 'utf8',
            stdio: [
                'pipe',
                'pipe',
                'ignore',
            ],
        };
        return execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
            .split('\n')[0]
            .trim();
    } catch (e) {
        return null;
    }
}
const childProcessSync = async function (cmd, params, cwd, printLog = true) {
    return new Promise((resolve, reject) => {
        let proc = childProcess(cmd, params, cwd, printLog);

        proc.on('close', (code) => {
            if (code === 0) {
                resolve(proc['logContent']);
            } else {
                reject(code);
            }
        });
    });
}
const getGitBranch = async function (cwd) {
    try {
        const result = await childProcessSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], cwd, false);

        if (!result.startsWith('fatal:')) {
            return result.trim();
        }
    } catch (e) {
        return undefined;
    }
}

const getProjectNameByPackage = function () {
    return require(`${process.cwd()}/package.json`).name
}
/**
 * 理论上每个项目独一无二的文件夹名字-默认取分支名
 * 如果当前未创建分支，取包名+日期
 * （实际很多情况是直接clone老项目，包名相同，以防资源被替换，所以用日期加一下）
 */
exports.getCdnFolderName = async function () {
    const branch = await getGitBranch(process.cwd());
    const date = Date.now();
    if (branch) {
        return branch + "/" + date;
    }
    let foldername = getProjectNameByPackage() + "/" + date;
    return foldername;

}
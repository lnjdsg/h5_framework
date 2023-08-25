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

//说实话 具体应该去cdn的地址配置，这里写死吧，没有oss意义不大
exports.getCdnFolderName = async function () {
    // const branch = await getGitBranch(process.cwd());
    // const date = Date.now();
    // if (branch) {
    //     return branch + "/" + date;
    // }
    // let foldername = getProjectNameByPackage() + "/" + date;
    let foldername = "./";
    return foldername;

}
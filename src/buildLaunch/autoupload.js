const path = require('path');
const fs = require("fs-extra");
const chalk = require('chalk');

const PATH_ROOT = 'crimson/v2';

/**
 * 上传到cdn
 * @param file
 * @param filename
 * @param folderName
 * @param remotePath 路径
 * @param exclude
 */
const uploadFile = async function (file, filename, folderName, remotePath = '', exclude) {
	if (exclude && exclude.test && exclude.test(filename)) {
		// console.log('拦截上传', filename);
		return false
	}
	return new Promise(async (resolve, reject) => {
		let buffer = fs.readFileSync(file);
		let uploadBuffer = buffer;
		let filePath = filename;
		const beforeP = path.join(PATH_ROOT, folderName, remotePath, filePath);
		const p = beforeP.split(path.sep).join('/');
		return { filePath: '' };
	})

}

/**
 * 上传多文件
 * @param distDir
 * @param remotePath
 * @param cdnFolderName
 * @param exclude
 * @param includeIndex
 */
const uploadFiles = async function (distDir, remotePath = '', cdnFolderName, exclude, includeIndex = false) {
	return new Promise(async (resolve, reject) => {
		let assetsPathArr = [];
		if (!fs.existsSync(distDir)) {
			console.log(`${chalk.red(`上传目录:${distDir}不存在`)}`);
			resolve(assetsPathArr);
			return;
		}
		const dirArr = fs.readdirSync(distDir);
		const len = dirArr.length;
		for (let index = 0; index < len; index++) {
			const file = dirArr[index];
			let fPath = path.join(distDir, file);
			let stat = fs.statSync(fPath);
			var isDir = stat.isDirectory();
			if (isDir) {
				// console.log('发现文件夹', file)
				const arr = await uploadFiles(fPath, `${remotePath}/${file}`, cdnFolderName, exclude);
				assetsPathArr.push(...arr);
			} else {
				if (includeIndex || !file.includes('index.html')) {
					//@ts-ignore
					const {filePath} = await uploadFile(fPath, file, cdnFolderName, remotePath, exclude);
					if (filePath) {
						//@ts-ignore
						assetsPathArr.push(filePath)

					}
				}
			}
		}
		resolve(assetsPathArr);
	})

}
exports.uploadFiles = uploadFiles
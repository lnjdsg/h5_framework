/**
 * Created by 六年级的时光 on 2023/4/05.
 */
const fs = require("fs-extra");
const { compressImage, compressSvga } = require('./compress')
const chalk = require("chalk");
exports.startCompress = async function (altasPath) {
	const images = getImgFiles(altasPath);

	const imagePArr = images.map((img) => {
		return (async () => {
			return true
			const buffer = await fs.readFile(img);
			const result = await compressImage(buffer, 'builtin').catch(() => {
				console.log(chalk.red("压缩图片失败:" + img));
				return false
			});
			const radio = ((1 - result.byteLength / buffer.byteLength) * 100).toFixed(2);
			if (result) {
				fs.writeFileSync(img, result);
				console.log(chalk.red(`压缩前${(buffer.byteLength / 1024).toFixed(0)}k`), chalk.blue(`压缩后${(result.byteLength / 1024).toFixed(0)}k`));
				console.log(chalk.green("压缩图片成功:" + img), chalk.magentaBright(`压缩率：${radio}`));
				return true
			}
		})();
	});

	return await Promise.all([
		...imagePArr
	]);
}

function getImgFiles(dir) {
	let fileArr = [];
	if (fs.existsSync(dir)) {
		const files = fs.readdirSync(dir);
		files.forEach((file) => {
			const fpath = dir + '/' + file;
			const stat = fs.lstatSync(fpath);
			if (stat.isFile() && /\.jpg|\.png|\.jpeg$/.test(file)) {
				fileArr.push(fpath);
			} else if (stat.isDirectory()) {
				fileArr.push(...getImgFiles(fpath));
			}
		})
	}
	// console.log('fileArr:',fileArr)
	return fileArr;
}



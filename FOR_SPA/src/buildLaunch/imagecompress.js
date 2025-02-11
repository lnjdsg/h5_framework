/**
 * Created by 六年级的时光 on 2025/2/8.
 */
const fs = require("fs-extra");
const { compressImage } = require('./compress');
const chalk = require("chalk");

exports.startCompress = async function (altasPath) {
	const images = getImgFiles(altasPath);

	// 使用 for...of 循环保证顺序执行
	for (const img of images) {
		let imgType = 'png'
		if (!/\.(png)$/i.test(img)) {  // 只处理 .png 格式的图片
			imgType = 'png'
		}

		if (/\.jpg$/i.test(img) || /\.jpeg$/i.test(img)) {  // 只处理 .jpg 或 .jpeg 格式的图片
			imgType = 'jpg'
			// 处理 JPEG 文件
		}

		try {
			const buffer = await fs.readFile(img);
			// 压缩图片
			const result = await compressImage(buffer, 'builtin', imgType).catch(() => {
				console.log(chalk.bgRedBright("压缩图片失败:" + img));
				return false;
			});

			if (result) {
				// 如果压缩成功，计算压缩率
				const radio = ((1 - result.byteLength / buffer.byteLength) * 100).toFixed(2);
				fs.writeFileSync(img, result); // 替换原始图片
				console.log(chalk.green("压缩图片成功:" + img));
				console.log(chalk.red(`压缩前${(buffer.byteLength / 1024).toFixed(0)}k`), chalk.blue(`压缩后${(result.byteLength / 1024).toFixed(0)}k`));
				console.log(chalk.magentaBright(`压缩率：${radio}%`))
			}
		} catch (error) {
			console.log(chalk.bgRedBright(`压缩图片失败: ${img}`));
		}
	}
};

// 获取所有图片文件
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
				fileArr.push(...getImgFiles(fpath)); // 如果是文件夹，递归获取
			}
		});
	}
	return fileArr;
}

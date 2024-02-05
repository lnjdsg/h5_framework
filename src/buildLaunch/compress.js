
const { buffer: imagemin } = require("imagemin");
// const imageminJpegtran = require("imagemin-jpegtran-cn");
// const imageminPngquant = require("imagemin-pngquant-cn");
// "imagemin-jpegtran-cn": "^7.0.2",
// "imagemin-pngquant-cn": "^9.0.1",
const COMPRESS_TYPE = {
	builtin: 'builtin',
	tinypng: 'tinypng',
}

function compressImage(buffer, type = "builtin") { 
	if (!COMPRESS_TYPE[type]) {
		type = COMPRESS_TYPE.builtin;
	}
	switch (type) {
		case COMPRESS_TYPE.builtin:
			return imagemin(buffer, {
				plugins: [
					imageminJpegtran(),
					imageminPngquant({
						quality: [0.6, 0.8]
					})
				]
			});
	}
}

exports.compressImage = compressImage;



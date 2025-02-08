/**
 * Created by 六年级的时光 on 2025/2/8.
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

let pngquantExePath;

if (os.platform() === 'win32') {
  // Windows 系统
  pngquantExePath = path.resolve(__dirname, './pngquantExe/window/pngquant.exe');
} else if (os.platform() === 'darwin') {
  // macOS 系统
  pngquantExePath = path.resolve(__dirname, './pngquantExe/macos/pngquant');
} else {
  // 其他操作系统（比如 Linux）
  console.log('不支持的操作系统');
}

console.log('压缩文件执行路径 pngquantExePath:', pngquantExePath)


const COMPRESS_TYPE = {
  builtin: 'builtin',
  tinypng: 'tinypng',
};

async function compressImage(buffer, type = "builtin") {
  if (!COMPRESS_TYPE[type]) {
    type = COMPRESS_TYPE.builtin;
  }

  switch (type) {
    case COMPRESS_TYPE.builtin:
      return await compressWithPngquant(buffer); // 使用本地pngquant压缩
  }
}

// 使用pngquant.exe进行压缩
async function compressWithPngquant(buffer) {
  // 为每个文件动态生成临时文件路径
  const tempInputPath = path.join(__dirname, `tempInput_${Date.now()}.png`); // 临时保存文件
  const tempOutputPath = path.join(__dirname, `tempOutput_${Date.now()}.png`); // 临时保存压缩后的文件

  try {
    // 将图片 buffer 保存到临时文件
    await fs.writeFile(tempInputPath, buffer);

    // 使用 child_process 调用 pngquant.exe 压缩图片
    await new Promise((resolve, reject) => {
      exec(`"${pngquantExePath}" --quality=65-80 --output "${tempOutputPath}" "${tempInputPath}"`, (err, stdout, stderr) => {
        if (err) {
          reject(`执行 pngquant 失败: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });

    // 读取压缩后的文件并返回
    const compressedBuffer = await fs.readFile(tempOutputPath);

    // 获取文件大小，判断压缩后的图片是否小于原图
    const originalSize = buffer.length;
    const compressedSize = compressedBuffer.length;

    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    console.log('压缩率:', compressionRatio, '%');
    // 如果压缩后的图片文件大小大于原图，则不进行替换
    if (compressionRatio < 0) {
      console.log('压缩后图片大小大于原图，取消替换。');
      await fs.unlink(tempInputPath);  // 删除临时输入文件
      await fs.unlink(tempOutputPath); // 删除临时输出文件
      return false;  // 返回 false 表示不进行替换
    }

    // 清理临时文件
    await fs.unlink(tempInputPath);
    await fs.unlink(tempOutputPath);

    return compressedBuffer;  // 返回压缩后的文件 buffer

  } catch (error) {
    console.error('压缩失败:', error);
    await fs.unlink(tempInputPath);  // 发生错误时，确保删除临时输入文件
    await fs.unlink(tempOutputPath); // 删除临时输出文件
    throw error;  // 抛出异常，供上层捕获
  }
}

exports.compressImage = compressImage;

/**
 * Created by 六年级的时光 on 2025/2/8.
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

let pngquantExePath;
let jpgquantExePath;

if (os.platform() === 'win32') {
  // Windows 系统
  pngquantExePath = path.resolve(__dirname, '../quantImg/pngquantExe/window/pngquant.exe');
  jpgquantExePath = path.resolve(__dirname, '../quantImg/jpgquantExe/window/jpgquant.exe');
} else if (os.platform() == 'darwin') {
  // macOS 系统
  pngquantExePath = path.resolve(__dirname, '../quantImg/pngquantExe/macos/pngquant');
  // 检查并修复文件的执行权限
  let mode = fs.stat(pngquantExePath).mode
  if (mode !== 33261) {
    fs.chmod(pngquantExePath, 33261); // 设置为可执行权限
  }

  jpgquantExePath = path.resolve(__dirname, '../quantImg/jpgquantExe/macos/jpgquant');
  // 检查并修复文件的执行权限
  let modeJpg = fs.stat(jpgquantExePath).mode
  if (modeJpg !== 33261) {
    fs.chmod(jpgquantExePath, 33261); // 设置为可执行权限
  }

} else if (os.platform() == "linux") {
  // 其他操作系统（比如 Linux）
  pngquantExePath = path.resolve(__dirname, '../quantImg/pngquantExe/linux/pngquant');
  let mode = fs.stat(pngquantExePath).mode
  if (mode !== 33261) {
    fs.chmod(pngquantExePath, 33261); // 设置为可执行权限
  }

  jpgquantExePath = path.resolve(__dirname, '../quantImg/jpgquantExe/linux/jpgquant');
  // 检查并修复文件的执行权限
  let modeJpg = fs.stat(jpgquantExePath).mode
  if (modeJpg !== 33261) {
    fs.chmod(jpgquantExePath, 33261); // 设置为可执行权限
  }

}

console.log('PNG压缩文件执行路径 pngquantExePath:', pngquantExePath)
console.log('JPG压缩文件执行路径 jpgquantExePath:', jpgquantExePath)

const COMPRESS_TYPE = {
  builtin: 'builtin',
  tinypng: 'tinypng',
};

async function compressImage(buffer, type = "builtin", imgType = 'png') {
  if (!COMPRESS_TYPE[type]) {
    type = COMPRESS_TYPE.builtin;
  }

  if (imgType == 'png') {
    return await compressWithPngquant(buffer);
  }
  else if (imgType == 'jpg') {
    return await compressWithJpgquant(buffer);
  }
  // switch (type) {
  //   case COMPRESS_TYPE.builtin:
  //     return await compressWithPngquant(buffer); // 使用本地pngquant压缩
  // }
}

// 使用jpgquant.exe进行压缩
async function compressWithJpgquant(buffer) {
  // 为每个文件动态生成临时文件路径
  const tempInputPath = path.join(__dirname, `tempInput_${Date.now()}.jpg`); // 临时保存文件

  try {
    // 将图片 buffer 保存到临时文件
    await fs.writeFile(tempInputPath, buffer);

    // 使用 child_process 调用 jpgquant.exe 压缩图片
    await new Promise((resolve, reject) => {
      exec(`"${jpgquantExePath}" --max=80 --overwrite --strip-all "${tempInputPath}"`, (err, stdout, stderr) => {
        if (err) {
          reject(`执行 jpgquant 失败: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });

    // 读取压缩后的文件并返回
    const compressedBuffer = await fs.readFile(tempInputPath);  // 使用临时输入路径直接读取压缩后的文件

    // 获取文件大小，判断压缩后的图片是否小于原图
    const originalSize = buffer.length;
    const compressedSize = compressedBuffer.length;

    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    // console.log('压缩率:', compressionRatio, '%');
    // 如果压缩后的图片文件大小大于原图，则不进行替换
    if (compressionRatio < 0) {
      console.log('压缩后图片大小大于原图，取消替换。');
      await fs.unlink(tempInputPath);  // 删除临时输入文件
      return false;  // 返回 false 表示不进行替换
    }

    // 清理临时文件
    await fs.unlink(tempInputPath);

    return compressedBuffer;  // 返回压缩后的文件 buffer

  } catch (error) {
    console.error('压缩失败:', error);
    await fs.unlink(tempInputPath);  // 发生错误时，确保删除临时输入文件
    throw error;  // 抛出异常，供上层捕获
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

    // console.log('压缩率:', compressionRatio, '%');
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

'use strict';
// 引入插件
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');

// 页面打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 自动清理插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 优化控制台输出
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 动态计算多页面打包
exports.setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    // 获取本地按规则修改好的文件
    const entryFiles = glob.sync(path.join(__dirname, './src/*/app.jsx'));
    console.log('entryFiles:',entryFiles)
    Object.keys(entryFiles).map((index) => {

        const entryFile = entryFiles[index];

        // 'my-project/src/index/index.js'

        const match = entryFile.match(/src\/(.*)\/app\.jsx/);
        // 获取页面文件名
        const pageName = match && match[1];
        console.log('pageName:',pageName)
        entry[pageName] = entryFile;
       
        // 根据本地定义的页面文件数量来定义htmlWebpackPlugin
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        );
    });

    return {
        entry,
        htmlWebpackPlugins
    }
}

// const { entry, htmlWebpackPlugins } = setMPA();
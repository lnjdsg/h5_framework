
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

const mpaConfig = () => {

    const entry = {};
    const htmlWebpackPlugins = [];
    const appPath = process.cwd();

    let lujing = path.join(appPath, './src/pages/**/app.jsx')
    lujing = lujing.replace(/\\/g, '/');
    const entryFiles = glob.sync(lujing);

    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const folderNames = entryFiles.map(p => path.basename(path.dirname(p)));
            console.log('pageName:', folderNames)
            const pageName = folderNames[index]

            entry[pageName] = entryFile;

            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(appPath, `src/pages/${pageName}/index.html`),
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
                }),
            )
        })
    return {
        entry,
        htmlWebpackPlugins
    }
}
module.exports = mpaConfig


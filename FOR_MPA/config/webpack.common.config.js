/**
 * Created by 六年级的时光 on 2023/4/13.
 */
const path = require('path');
const { Crimson_CONFIG_DIR_KEY, Crimson_CONFIG } = require('./scripts/constant');
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const fs = require('fs-extra');
const mpaConfig = require('./mpaConfig');

//暂时不引用happyPack了  没有不要， Build completed in 3.5s
module.exports = function (isProd) {

    const { entry, htmlWebpackPlugins } = mpaConfig();
    console.log('找到的打包入口:', entry)

    const appPath = process.cwd();
    const crimsonConfig = require(path.join(appPath, Crimson_CONFIG));
    const cssReg = /\.(css|less)$/;
    // 处理相对路径
    Crimson_CONFIG_DIR_KEY.map((key) => {
        crimsonConfig[key] = path.resolve(appPath, crimsonConfig[key]);
    });

    const stylePlugins = [
        //自动管理浏览器前缀
        require("autoprefixer")({
            overrideBrowserslist: ["> 1%", "last 2 versions", "not ie <= 8"],
        })
    ];
    if (crimsonConfig.PX2REM) {
        stylePlugins.push(
            require("postcss-px2rem-exclude")({
                // 注意算法，这是750设计稿，html的font-size按照750比例，ui给的设计稿为准
                remUnit: 100,
                exclude: /node_modules/i,
            })
        );
    }
    //主要就是loader的配置
    const styleLoader = (cssOptions = {}) => {
        return [
            {
                loader: "style-loader",
            },
            isProd && {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false,
                    publicPath: "../",
                },
            },
            {
                loader: "css-loader",
                options: {
                    ...cssOptions,
                    importLoaders: 2, // 如果遇到css里面的 @import 执行后面两个loader。 不然如果import了less，css-loader是解析不了
                },

            },
            {
                loader: "postcss-loader",
                options: {
                    sourceMap: isProd,
                    plugins: stylePlugins,
                },
            },
            {
                loader: require.resolve("less-loader"),
                options: {
                    sourceMap: isProd,
                    lessOptions: {
                        modifyVars: {
                            "@RES_PATH": `"${isProd ? crimsonConfig.RES_PATH_PROD + '/' : crimsonConfig.RES_PATH}"`,
                        },
                    }
                },
            },
        ].filter(Boolean);
    };
    return {
        // entry: crimsonConfig.ENTRY,
        entry: entry,
        mode: isProd ? 'production' : 'development',
        // devtool: isProd ? "source-map" : "cheap-module-source-map",
        output: {
            path: path.resolve(__dirname, crimsonConfig.OUTPUT_DIR),
            filename: "js/[name].js",
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            alias: {
                "@src": path.resolve(__dirname, crimsonConfig.SOURCE_DIR),
            },
        },
        module: {
            rules: [
                {
                    test: cssReg,
                    use: styleLoader(),
                    //antd等第三方库  node_modules 包含css等  尽量放开不然 报错loader不存在
                    //include: crimsonConfig.SOURCE_DIR,
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: require.resolve("babel-loader"),
                    //这里可以按情况注释，在不引入swiper的情况下，无影响
                    exclude: [path.resolve("node_modules")],
                    options: {
                        presets: [
                            require("@babel/preset-env").default,
                            require("@babel/preset-react").default
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": false }],
                            require("@babel/plugin-transform-runtime").default,
                        ],
                        sourceType: 'unambiguous'
                    },
                },
                {
                    test: [/\.(jpg|jpeg|png|svg|bmp)$/, /\.(eot|woff2?|ttf|svg)$/],
                    loader: require.resolve("url-loader"),
                    //这里暂时搞成base64了，因为他就是本地路径，暂时不存在cdn
                    options: {
                        name: "[name].[ext]", // name默认是加上hash值。这里做了更改，不让加
                        outputPath: 'imgs',
                        // url-loader处理图片默认是转成base64, 这里配置如果小于10kb转base64,
                        // 否则使用file-loader打包到images文件夹下
                        limit: 10240,
                        esModule: false
                        //这里其实不能这么干，会返回null 导致图片无法读取 先留着吧，暂时不删除
                        //fallback: 'null-loader' 
                    },

                },

            ].filter(Boolean),
        },
        plugins: [
            isProd &&
            //css还是抽离吧，单独导出在dist/styles文件夹
            new MiniCssExtractPlugin({
                filename: "styles/[name].[hash].css",
            }),
            // new HtmlWebpackPlugin({
            //     template: crimsonConfig.TEMPLATE,
            //     minify: isProd,
            // }),
            // 还是删一下 无关联文件，主要是还是assets里的临时性压缩文件
            //imgs会存放大=大于10kb而没有转换成base64的文件
            // new CleanWebpackPlugin(),
            new ProgressBarPlugin(),

        ].filter(Boolean).concat(htmlWebpackPlugins),

        // devServer: {
        //     contentBase: path.join(__dirname, 'dist'),
        //     port: 8088,
        //     open: true,
        // },

        optimization: {
            minimize: isProd,
            minimizer: [
                // 替换的js压缩 因为uglifyjs不支持es6语法，
                new TerserPlugin({
                    cache: true,
                    //是否需要sourceMap，理论上是要的，但是注意安全性
                    sourceMap: isProd,
                    extractComments: false, // 提取注释
                    parallel: true, // 多线程
                    terserOptions: {
                        compress: {
                            //上线之后的生产包 还是 不要consolo.log输出了，可能会暴露代码
                            // pure_funcs: ["console.log"],
                        },
                    },
                }),
                // 压缩css
                new OptimizeCSSAssetsPlugin({
                    assetNameRegExp: /\.css$/g,
                    cssProcessor: require("cssnano"),
                    cssProcessorPluginOptions: {
                        preset: ["default", { discardComments: { removeAll: true } }],
                    },
                    canPrint: true,
                }),
            ],
            // 修改文件的ids的形成方式，避免单文件修改，会导致其他文件的hash值变化，影响缓存
            moduleIds: "hashed",
            splitChunks: {
                chunks: "all",
                minSize: 30000, // 小于这个限制的会打包进Main.js
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10, // 优先级权重，层级 相当于z-index。 谁值越大权会按照谁的规则打包
                        name: "vendors",
                    },
                },
            },

            // chunks 映射关系的 list单独从 app.js里提取出来
            runtimeChunk: {
                name: (entrypoint) => `runtime-${entrypoint.name}`,
            },
        },
    };

}
/**
 * Created by 六年级的时光 on 2023/4/13.
 */
const path = require("path");
const chalk = require("chalk");
const fs = require('fs-extra');
const Webpack = require("webpack");
const WebpackMerge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.common.config");
const isProd = true;
const { getCdnFolderName } = require("./scripts/utils");
const { Crimson_CONFIG } = require("./scripts/constant");
const HtmlJsToES5Plugin = require("./scripts/plugins/HtmlJsToES5Plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");



const webpackProdConfig = function (cdnFolderName, resPathProd) {
  return {
    output: {
      //发布路径暂时没有
      publicPath: `${cdnFolderName}`,
      filename: isProd ? "js/[name].[contenthash:8].js" : "js/[name].[contenthash:4].js",
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, './scripts/loaders')]
    },
    module: {
      rules: [
        {
          test: /crimsonrc\.js$/,
          exclude: [path.resolve("node_modules")],
          use: [
            {
              loader: 'replaceLoader',
              options: {
                arr: [
                  {
                    replaceFrom: /(MOCK_STATUS: true)|(MOCK_STATUS:true)|("MOCK_STATUS": true)|("MOCK_STATUS":true)/,
                    replaceTo: '"MOCK_STATUS": false'
                  },
                  {
                    replaceFrom: /(RES_PATH:'\/src\/assets\/')|(RES_PATH: '\/src\/assets\/')|("RES_PATH":"\/src\/assets\/")|("RES_PATH": "\/src\/assets\/")/,
                    replaceTo: `"RES_PATH":"${resPathProd}/"`
                  }
                ]
              }
            }
          ]
        },
      ]
    },
    plugins: [
      new Webpack.IgnorePlugin(/[\\/]mock[\\/]/),
      new ScriptExtHtmlWebpackPlugin({
        custom: {
          test: /\.js$/,
          attribute: 'crossorigin',
          value: 'anonymous'
        }
      }),
      //git代码地址 暂时没有的，先写着  CI/CD也没有必要引入了
      //一个HTML ES6转成ES5的插件 
      new HtmlJsToES5Plugin(),
      //允许覆盖webpack打包时的查找规则
      new Webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /zh-cn/,
      ),
    ],
    node: {
      crypto: 'empty'
    }
  };
};

const buildProd = async function () {
  const cdnFolderName = await getCdnFolderName();
  const appPath = process.cwd();
  const crimsonConfig = require(path.join(appPath, Crimson_CONFIG));
  // const _webpackProdConfig = await webpackProdConfig(cdnFolderName, crimsonConfig.RES_PATH_PROD || '');
  //数知梦 CI/CD 有特殊限制，无法修改 打包后的路径 这个资源文件夹也应该不会变了 暂时写死
  const _webpackProdConfig = await webpackProdConfig(cdnFolderName, '/assets');

  return new Promise((resolve, reject) => {
    //合并公共配置和生产环境的配置
    const config = WebpackMerge(webpackBaseConfig(isProd), _webpackProdConfig);
    const compiler = Webpack(config);
    compiler.run(async (error, stats) => {
      if (error) {
        return reject(error);
      }
      // console.log(
      //   stats.toString({
      //     chunks: false, // 使构建过程更静默无输出
      //     colors: true, // 在控制台展示颜色
      //   })
      // );

      console.log(`${chalk.bgBlackBright("打包成功，开始拷贝 MINI_PROGRAM ===>>>>")}\n`);
      const assetsPathFrom = path.resolve(__dirname, crimsonConfig.SOURCE_DIR, crimsonConfig.MINI_PROGRAM);
      const assetsPathTo = path.resolve(__dirname, crimsonConfig.OUTPUT_DIR, './');
      if (fs.existsSync(assetsPathFrom)) {
        //dist文件判断是否存在，正常是肯定存在的
        if (!fs.existsSync(assetsPathTo)) {
          fs.mkdirsSync(assetsPathTo);
        }
        //拿到微信小程序文件  打包最后阶段加入dist文件夹，否则这个文件会被 混淆打包
        fs.copySync(assetsPathFrom, assetsPathTo, { overwrite: true });
        console.log(`${chalk.yellowBright(`TKlDTbmdrF.txt 拷贝成功`)}\n`);
      } else {
        console.log(`${chalk.red(`警告：${assetsPathFrom}目录不存在！`)}\n`);
      }

      resolve();
    });

  });
};

buildProd();


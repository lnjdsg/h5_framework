/**
 * Created by 六年级的时光 on 2023/4/13.
 */
const { Crimson_CONFIG } = require("./scripts/constant");
const Webpack = require("webpack");
const webpackBaseConfig = require("./webpack.common.config");
const WebpackMerge = require("webpack-merge");
const WebpackDevServer = require("webpack-dev-server");
const opn = require("opn");
const apiMocker = require('mocker-api');
const path = require('path');
const { getProcessIdOnPort } = require("./scripts/utils");
const crimsonConfig = require(path.resolve(Crimson_CONFIG));
const webpackDevConfig = function () {
  return {
    devServer: {
      useLocalIp: true,
      open: false,
      hot: true,
      host: "0.0.0.0",
      //主要还是防止ip6的跨域问题，导致[WDS] Disconnected!断开
      headers:{
        'Access-Control-Allow-Origin':'*',
      },
      before(app) {
        if (crimsonConfig.API_MOCK) {
          //返回预制的后端接口格式
          apiMocker(app, path.resolve('./mock/index.js'), {
            changeHost: true,
          })
        }
      }
    },
    plugins: [
      new Webpack.HotModuleReplacementPlugin()
    ]
  };
};

const buildDev = async function (config) {
  const { port } = config;
  return new Promise((resolve, reject) => {
    //合并公共配置和开发环境的配置
    const config = WebpackMerge(webpackBaseConfig(false), webpackDevConfig());
    // console.log('config:',config)
    const compiler = Webpack(config);
    const devServerOptions = Object.assign({}, config.devServer);
    // console.log('devServerOptions', devServerOptions);

    const server = new WebpackDevServer(compiler, devServerOptions);
    if (getProcessIdOnPort(port)) {
      reject(`端口 ${port} 已被使用`);
      
    } else {
      server.listen(
        port || 8088,
        "0.0.0.0",
        () => {
          console.log(`Starting server on http://localhost:${port}/home.html`);
          opn(`http://localhost:${port || 8088}/home.html`);
          resolve();
        },
        (err) => {
          if (err) console.error("server linsten err--", err);
          reject();
        }
      );
    }
  });
};
const args = process.argv.splice(2);
const port = args[0] || 8088
buildDev({
  port: Number(port)
})


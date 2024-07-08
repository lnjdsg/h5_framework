

const { assets } = require("../../../src/buildLaunch");

const args = process.argv.splice(2);
let argsObj = {
  imgmin: false,
  imgup: false
}
if (args.length == 1) {
  argsObj.imgmin = 'imgmin' == args[0];
  argsObj.imgup = 'imgup' == args[0];
} else if (args.length == 2) {
  argsObj.imgmin = 'imgmin' == args[0];
  argsObj.imgup = 'imgup' == args[1];
}

assets(argsObj)


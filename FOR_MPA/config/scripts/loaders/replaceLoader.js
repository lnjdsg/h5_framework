const loaderUtils = require('loader-utils');

module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  let result = source;
  if (options.arr) {
    options.arr.map(op => {
      result = result.replace(op.replaceFrom, op.replaceTo);
    })
  } else {
    result = source.replace(options.replaceFrom, options.replaceTo);
  }
  return result

};

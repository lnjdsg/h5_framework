
const getInfo = require("./common/getInfo");
const notices = require("./common/notices");

const proxy = {
    "GET /v1/order/getInfo": getInfo,
    "GET /GetInfo/Notice": notices,
    
};
module.exports = proxy;


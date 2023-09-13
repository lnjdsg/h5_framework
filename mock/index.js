
const getInfo = require("./common/getInfo");
const proxy = {
    "GET /v1/order/getInfo": getInfo,
};
module.exports = proxy;


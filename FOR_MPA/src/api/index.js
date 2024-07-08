import { generateAPI } from "./utils.js"
const API = generateAPI({
    getInfo: {
        uri: 'v1/order/getInfo',
    },
})



export default API




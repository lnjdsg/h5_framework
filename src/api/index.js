import { generateAPI } from "./utils.js"
const API = generateAPI({
    getInfo: {
        uri: 'v1/order/getInfo',
    },
    notices: {
        uri: 'GetInfo/Notice',
    },
    
})



export default API




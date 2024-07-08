import { useRef, useEffect, useCallback } from "react";
import TWEEN from '@tweenjs/tween.js'
export {
  showToast,    // 展示Toast
  _throttle,    // 节流
  useThrottle,  // 节流，函数组件
  _debounce,    // 防抖
  getCookie,    // 获取cookie的值
  getUrlParam,  // 获取url参数
  delUrlParam,  // 删除url中的参数
  subStringCE,   // 截取字符串 中2英1
  check2Object,  // 判断两个对象相等
  getThousandToK, // 转换k
  dateFormatter, // 日期格式化
  dealTime,     // 时间格式化
  dateDuration, //时间转换
  second2Date,  // 秒转时间对象
  waitTime,     // 等待一段时间再执行
  randomNum,    // 获取区间随机数 [min,max)
  shuffleArr,   // 随机打乱数组
  flatten,      // 数据扁平化
  onCtrScroll,   // 控制滚动--兼容ios
  parseHtml, //解析html文本
  deepClone,//深拷贝
  convertToChinaNum,//月份转汉字
  tween,
  initializeBuriedPoints,
  buryPointClick,//手动埋点
  buryPointExposure,//曝光买单
  sendPV,
  getTimeDifference,//约时间
  toYuan,
  handleFontSize
}

/**
 * @微信重置字体大小
 */
const handleFontSize = () => {
  if (typeof WeixinJSBridge !== "undefined" && typeof WeixinJSBridge.invoke == "function") {
    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
    WeixinJSBridge.on('menu:setfont', function () {
      WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
    });
  } else {
    document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
  }
  window.onload = function () {
    document.body.style.cssText = "-webkit-text-size-adjust: 100% !important;"
  }
}

const animate = () => {
  if (TWEEN.update()) {
    requestAnimationFrame(animate);
  }
}
/**
 * @description 价格格式化
 * @param price 价格
 * @param count 位数
 */
const toYuan = (price, count = 2) => {
  if ((price / 100 + '').indexOf('.') === -1) {
    return (price / 100)
  } else {
    return (price / 100).toFixed(count)
  }
}

/**
 * @description 获取时间差（单位分）
 * @param start 开始时间
 * @param end 结束时间
 */
const getTimeDifference = (start, end) => {
  if (!start || !end || start === ' ' || end === ' ') {
    return '';
  }
  if (start.indexOf('undefined') !== -1 || end.indexOf('undefined') !== -1) {
    return '';
  }
  let startTime = new Date(start.replace(/-/g, '/'));
  let endTime = new Date(end.replace(/-/g, '/'));
  let difference = Date.parse(endTime) - Date.parse(startTime);
  return Math.abs(parseInt(String(difference / 1000 / 60)))
}

/**
 * @param {*} context 上下文
 * @param {*} number 新数据
 * @param {*} cb state的字段名
 * @param {*} duration 动画持续时间
 */
const tween = (context, startNumer, endNumber, cb, duration = 200) => {
  new TWEEN.Tween({
    number: startNumer
  }).to({
    number: endNumber
  }, duration).onUpdate(tween => {
    context(tween.number.toFixed(0))

  }).start().onComplete(() => {
    // console.log('结束了')
    cb && cb()
  })
  animate()
}

/**
 * 解析html文本
 * @ctype PROCESS
 * @description 解析html文本
 * @param {string} htmlText html文本
 * @returns
 * el HTMLElement html节点
 */
function parseHtml(htmlText) {
  let el = document.createElement('div');
  el.innerHTML = htmlText;
  return el.children[0];
}

/**
 * @description: 展示Toast
 * @param { string } errCode  错误码
 * @param { message }  message 错误消息
 */
/**  */
function showToast(errCode, message) {

}

/**
 * @description: 函数节流，普通防连点
 * @param {(Function, number?)}
 * @return {Function}
 */
const _throttle = (fun, delay = 2000) => {
  let last, deferTimer;
  return function () {
    const now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
      }, delay);
    } else {
      last = now;
      fun.apply(this, arguments);
    }
  };
};


function useThrottle(fn, delay = 2000, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(function () {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn.call(this, ...args);
    }
  }, dep);
}

/**
 * @description: 函数防抖
 * @param {(Function, number?, boolean? )}
 * @return {Function}
 */
const _debounce = (fn, wait = 2000, immediate = false) => {
  let timer = null
  return function () {
    const later = function () {
      fn.apply(this, arguments)
    }
    if (immediate && !timer) {
      later()
    }
    if (timer) clearTimeout(timer)
    timer = setTimeout(later, wait)
  }
}
/**
 * 深拷贝
 * @param {*} obj 
 * @returns 
 */
const deepClone = (obj = {}) => {
  //2.终止条件 判断是否是值类型，值类型终止
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  //判断对象还是数组
  let result;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }

  for (let key in obj) {
    console.log("循环", key, obj[key])
    if (obj.hasOwnProperty(key)) {
      //递归入口
      //1.参数：引用类型对象  返回值：值类型
      //3.单层递归逻辑 循环当前对象value中的值，赋值给新对象的key
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}


/**
 * 获取cookie的值
 * @param {*} cookieName
 */
function getCookie(cookieName) {
  const strCookie = document.cookie;
  const arrCookie = strCookie.split('; ');
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].split('=');
    if (cookieName == arr[0]) {
      return arr[1];
    }
  }
  return '';
}
/**
 * 获取url参数
 * @param {string} name
 */
function getUrlParam(name) {
  const search = decodeURIComponent(window.location.search);
  const matched = search
    .slice(1)
    .match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'));
  return search.length ? matched && matched[2] : null;
}
/**
 * 删除url中的参数
 * @param {*} url
 * @param {*} arg
 */
function delUrlParam(url, ref) {
  // 如果不包括此参数
  if (url.indexOf(ref) == -1) return url;

  const arr_url = url.split('?');
  const base = arr_url[0];
  const arr_param = arr_url[1].split('&');
  let index = -1;

  for (let i = 0; i < arr_param.length; i++) {
    const paired = arr_param[i].split('=');
    if (paired[0] == ref) {
      index = i;
      break;
    }
  }
  if (index == -1) {
    return url;
  } else {
    arr_param.splice(index, 1);
    return base + '?' + arr_param.join('&');
  }
}
/**
 * 月份数字转汉字
 * @param {*} num 要转化的月份
 * @returns 转化后的中文
 */
const convertToChinaNum = (num) => {
  let obj = {
    '0': "零",
    '1': "一",
    '2': "二",
    '3': "三",
    '4': "四",
    '5': "五",
    '6': "六",
    '7': "七",
    '8': "八",
    '9': "九",
    '10': "十",
    '11': "十一",
    '12': "十二"
  }
  return obj[String(num)]
}
/**
 * 日期格式化
 * @param date    接收可以被new Date()方法转换的内容
 * @param format  字符串，需要的格式例如：'yyyy/MM/dd hh:mm:ss'
 * @returns {String}
 */
const dateFormatter = (date, format = "hh:mm:ss") => {
  if (!date) return "-";
  date = new Date(
    typeof date === "string" && isNaN(date)
      ? date.replace(/-/g, "/")
      : Number(date)
  );
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

/** 时间格式化 */
const dealTime = (msTime) => {
  const time = msTime / 1000;
  let hour = Math.floor(time / 60 / 60) % 24;
  let minute = Math.floor(time / 60) % 60;
  let second = Math.floor(time) % 60;
  hour = hour > 9 ? hour : "0" + hour;
  minute = minute > 9 ? minute : "0" + minute;
  second = second > 9 ? second : "0" + second;
  return `${hour}:${minute}:${second}`;
}
/**
 * 用时 xxxx秒->1天2时3分4秒
 * @param {*} msTime 
 */
const dateDuration = (second) => {
  var duration = ""
  var days = Math.floor(second / 86400);
  var hours = Math.floor((second % 86400) / 3600);
  var minutes = Math.floor(((second % 86400) % 3600) / 60);
  var seconds = Math.floor(((second % 86400) % 3600) % 60);
  if (days > 0) duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
  else if (hours > 0) duration = hours + "小时" + minutes + "分" + seconds + "秒";
  else if (minutes > 0) duration = minutes + 1 + "分"
  else if (seconds > 0) duration = 1 + "分";
  return duration;
}

/**
 * 转换k
 * @param {*} num
 */
function getThousandToK(num) {
  let s_x;
  if (num >= 1000) {
    let result = num / 1000;
    result = Math.floor(result * 10) / 10;
    s_x = result.toString();
    let pos_decimal = s_x.indexOf(".");
    if (pos_decimal < 0) {
      pos_decimal = s_x.length;
      s_x += ".";
    }
    while (s_x.length <= pos_decimal + 1) {
      s_x += "0";
    }
    s_x += "k";
  } else {
    s_x = num;
  }
  return s_x;
}

/**
 * 截取字符串 中2英1
 * @param {*} str 
 * @param {*} sub_length 
 */
function subStringCE(str, sub_length) {
  const temp1 = str.replace(/[^\x20-\xff]/g, "**");
  const temp2 = temp1.substring(0, sub_length);
  const x_length = temp2.split("*").length - 1;
  const hanzi_num = x_length / 2;
  sub_length = sub_length - hanzi_num;
  const res = str.substring(0, sub_length);
  let endStr;
  if (sub_length < str.length) {
    endStr = res + "...";
  } else {
    endStr = res;
  }
  return endStr;
}

/**
 * 随机打乱数组
 * @param {*} arr 
 * @returns 
 */
function shuffleArr(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const itemAtIndex = arr[randomIndex]
    arr[randomIndex] = arr[i]
    arr[i] = itemAtIndex
  }
  return arr
}

/**
 *  获取区间随机数 [min,max)
 * @export
 * @param {*} min
 * @param {*} max
 * @return {*} 
 */
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 *  数据扁平化
 * @export
 * @param {*} arr
 * @return {*} 
 */
function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}

/** 判断两个对象相等 */
const check2Object = (obj1, obj2) => {
  const o1 = obj1 instanceof Object
  const o2 = obj2 instanceof Object
  if (!o1 || !o2) { /*  判断不是对象  */
    return obj1 === obj2
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  for (const attr in obj1) {
    const t1 = obj1[attr] instanceof Object
    const t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return check2Object(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}

/**
 * 秒转时间对象
 * @param {Number} totalSecond 总秒数
 * @return {{
 *  day: String,
 *  hour: String,
 *  minute: String,
 *  second: String
 * }}
 */
const second2Date = (totalSecond) => {
  const millisecond = totalSecond % 1000
  totalSecond = totalSecond / 1000

  // 获得总分钟数
  const totalMinute = totalSecond / 60
  // 获得剩余秒数
  const second = totalSecond % 60
  // 获得小时数
  const totalHour = totalMinute / 60
  // 获得分钟数
  const minute = totalMinute % 60
  // 获得天数
  const day = totalHour / 24
  // 获得剩余小时数
  const hour = totalHour % 24
  // 格式化的键值
  const includesKey = ['month', 'day', 'hour', 'minute', 'second', 'totalHour', 'totalMinute']
  // 日期对象
  const dateObj = { day, hour, minute, second, millisecond, totalHour, totalMinute }

  return Object.keys(dateObj).reduce((preVal, key) => {
    // 值取整
    const value = parseInt(dateObj[key])

    if (includesKey.includes(key) && value < 10) {
      if (value < 0) {
        preVal[key] = '00'
      } else {
        preVal[key] = '0' + value
      }
    } else {
      if (value.toString() === 'NaN') {
        preVal[key] = '0'
      } else {
        preVal[key] = value.toString()
      }
    }

    return preVal
  }, {})
}

/**
 * 等待一段时间再执行
 * @param {number} time 等待的时间ms
 */
function waitTime(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

/** 控制滚动--兼容ios */
const bodyScroll = (event) => {
  event.preventDefault();
}
const onCtrScroll = (flag = true) => {
  if (flag) { // 禁止滚动
    document.body.addEventListener('touchmove', bodyScroll, { passive: false });
  } else { // 开启滚动
    document.body.removeEventListener('touchmove', bodyScroll, { passive: false });
  }
}

//初始化友盟埋点方法
const initializeBuriedPoints = () => {
  (function (w, d, s, q, i) {
    w[q] = w[q] || [];
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true;
    j.id = 'beacon-aplus';
    j.src = 'https://d.alicdn.com/alilog/mlog/aplus/' + i + '.js';
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'aplus_queue', '203467608');

  //集成应用的appKey
  aplus_queue.push({
    action: 'aplus.setMetaInfo',
    arguments: ['appKey', '6440a4d8ba6a5259c43dbb9c']
  });
  //sdk提供手动pv发送机制，启用手动pv(即关闭自动pv)，需设置aplus-waiting=MAN;
  aplus_queue.push({
    action: 'aplus.setMetaInfo',
    arguments: ['aplus-waiting', 'MAN']
  });
  //是否开启调试模式 
  aplus_queue.push({
    action: 'aplus.setMetaInfo',
    arguments: ['DEBUG', true]
  });
}

/*
友盟打埋点方法  
*eventCode：事件ID 或 事件编码，字符串类型
*eventType：'CLK'
*eventParams 为本次事件中上报的事件参数。其取值为一个JSON对象（平铺的简单对象，不能多层嵌套）
*调用 record api 上报参数时，该次赋值仅对该条事件有效
*SDK保留属性：uid, aplus, spm-url, spm-pre, spm-cnt, pvid,dev_id,anony_id,user_id,user_nick, _session_id
*/
const buryPointClick = (eventCode, eventParams) => {
  const { aplus_queue } = window
  aplus_queue.push(
    {
      action: 'aplus.record',
      arguments: [eventCode, 'CLK', { eventParams }]
    })
}

/*
  曝光埋点
*/
const buryPointExposure = (eventParams) => {
  const { aplus_queue } = window;
  //一个简单的demo
  aplus_queue.push({
    action: 'aplus.record',
    //key为字符串类型, value为字符串或Number类型，长度均限制在128位字符以内
    arguments: ['$$_exposure', 'EXP', eventParams]
  });
}
/*
  页面曝光
*/
const sendPV = () => {
  const { aplus_queue } = window;
  aplus_queue.push({
    action: 'aplus.sendPV',
    arguments: [{ is_auto: false }, {
      a: 1,
      b: 2,
      page_name: 'home_page'
    }]
  });
}









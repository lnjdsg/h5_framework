import { flatten } from "./utils"
import { RES_PATH } from "../../crimsonrc";
import React, { Fragment, useMemo, useEffect, useCallback, useState, useRef } from "react";
import store from "@src/store";
export const MAP_PROTOCOL = 'https'
export const MAP_KEY = 'dfba0f951c70f029a888263a3e931d0a' // 高德地图key
export const MAP_VERSION = '2.0' // 高德地图version
export const MAP_DEFAULT_ZOOM = 14 // 地图默认缩放

export const CITY_CODE_HZ = '330100' // 杭州城市编码

export const MARKER_ICON = {
    'START_POINT': RES_PATH + 'startPoint.png',
    'UP_STATION': RES_PATH + 'marker_up.png',
    'DOWN_STATION': RES_PATH + 'marker_down.png',
    'END_POINT': RES_PATH + 'endPoint.png'
}
export const MAP_COLORSTYLE = {
    //标准
    "NORMAL": "normal",
    //幻影黑
    "DARK": "dark",
    //月光银
    "LIGHT": "light",
    //远山黛
    "WHITESMOKE": "whitesmoke",
    //草色青
    "FRESH": "fresh",
    //雅士灰
    "GREY": "grey",
    //涂鸦
    "GRAFFITI": "graffiti",
    ///马卡龙
    "MACARON": "macaron",
    //靛青蓝
    "BLUE": "blue",
    //极夜蓝
    "DARKBLUE": "darkblue",
    //酱籽
    "WINE": "wine"
}
export const orderStaus = {
    "0": "新建",
    "1": "预约中",
    "2": "服务中",
    "10": "用户取消",
    "11": "平台取消",
    "12": "司机取消",
    "13": "系统取消",
    "20": "已完成",
    "21": "已派单",
    "22": "行程中"
}
/**
 * 线路规划
 * @param {*} AMap 地图类
 * @param {*} startPoint 起点
 * @param {*} endPoint 终点
 * @param {*} strategy 驾车|步行
 */
export const linePlanning = (AMap, startPoint, endPoint, strategy, key) => {
    return new Promise((resolve, reject) => {
        switch (strategy) {
            case "Driving":
                try {
                    AMap.plugin('AMap.Driving', function () {
                        var driving = new AMap.Driving({
                            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                            policy: AMap.DrivingPolicy.LEAST_TIME
                        })
                        driving.search(startPoint, endPoint, function (status, result) {
                            // 未出错时，result即是对应的路线规划方案
                            if (status === 'complete') {
                                let distance = 0;//距离
                                let time = 0;//用时
                                let points = [];//线路点
                                result.routes.forEach(el => {
                                    distance += el.distance;
                                    time += el.time;
                                    points = points.concat(el.steps.map(o => o.path))
                                })
                                let path = flatten(points).map(p => [p.lng, p.lat]);
                                resolve({ distance, time, path, type: "Driving", key })
                            } else {
                                reject(result)
                            }
                        })
                    })
                } catch (err) {
                    console.error(err)
                }
                return;
            case "Walking"://步行
                try {
                    AMap.plugin('AMap.Walking', function () {
                        var walking = new AMap.Walking()
                        walking.search(startPoint, endPoint, function (status, result) {
                            // 未出错时，result即是对应的路线规划方案
                            if (status === 'complete') {
                                let distance = 0;
                                let time = 0;
                                let points = [];
                                result.routes.forEach(el => {
                                    distance += el.distance;
                                    time += el.time;
                                    points = points.concat(el.steps.map(o => o.path))
                                })
                                let path = flatten(points).map(p => [p.lng, p.lat]);
                                resolve({ distance, time, path, type: "Walking", key })
                            } else {
                                reject(result)
                            }
                        })
                    })
                } catch (err) {
                    console.error(err)
                }
                return;
        }
    })
}

/**
 * 经纬度转地址
 * @param {*} AMap 地图类
 * @param {*} station 要查询地址信息的经纬度
 * @returns 查询结果
 */
export const codingConversionAddress = (AMap, station) => {
    return new Promise((resolve, reject) => {
        try {
            AMap.plugin('AMap.Geocoder', function () {
                var geocoder = new AMap.Geocoder({
                    city: '330100' // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                })
                geocoder.getAddress(station, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // result为对应的地理位置详细信息
                        resolve(result)
                    } else {
                        reject(result)
                    }
                })
            })
        } catch (err) {
            console.error(err)
        }
    })
}

/**
 * 获得与当前位置最近的点
 * @param {*} AMap 地图类
 * @param {*} position 当前点
 * @param {*} stations 要对比的点集合
 * @returns 距离最近的点信息
 */
export const getNearestSite = (AMap, position, stations) => {
    return new Promise((resolve, reject) => {
        try {
            let minDistance = 0;//最小距离
            let station = {};
            for (let i = 0; i < stations.length; i++) {
                let distance = AMap.GeometryUtil.distance(position, stations[i].position);
                if (distance === 0) {
                    station = stations[i];
                    break;
                } else if (distance <= minDistance || minDistance === 0) {
                    minDistance = distance;
                    station = stations[i];
                }
            }
            resolve(station)

        } catch (err) {
            reject(err)
            console.error(err)
        }
    })
}

/**
 * 判断点是否在区域内
 * @param {*} AMap 地图类
 * @param {*} position 当前点
 * @param {*} polygon 要验证的区域(多个经纬度点围成的区域)
 * @returns true|false  是否在区域内
 */
export const pointIsPolygonInside = (AMap, position, polygon) => {
    return new Promise((resolve, reject) => {
        try {
            let isRing = AMap.GeometryUtil.isPointInRing(position, polygon);
            resolve(isRing)
        } catch (err) {
            reject(err)
            console.err(err)
        }
    })
}
/**
 * 计算两点之间的距离
 * @param {*} AMap 地图类
 * @param {*} p1 比较点1
 * @param {*} p2 比较点2
 */
export const getPointDistance = (AMap, p1, p2) => {
    return new Promise((resolve, reject) => {
        try {
            let distance = AMap.GeometryUtil.distance(p1, p2);
            resolve(distance)
        } catch (err) {
            reject(err)
        }
    })
}
/**
 * 
 * @param {*} AMap 地图类
 * @param {*} value 地点名称
 * @returns 搜索结果
 */
export const searchLocation = (AMap, value) => {
    return new Promise((resolve, reject) => {
        try {
            AMap.plugin('AMap.AutoComplete', function () {
                var autoOptions = {
                    //city 限定城市，默认全国
                    city: '杭州'
                };
                // 实例化AutoComplete
                var autoComplete = new AMap.AutoComplete(autoOptions);
                // 根据关键字进行搜索
                autoComplete.search(value, function (status, result) {
                    // 搜索成功时，result即是对应的匹配数据
                    let array = []
                    for (let key in result.tips) {
                        if (result.tips[key]?.location) {
                            array.push(result.tips[key])
                        }
                    }
                    resolve(array)
                })
            })
        } catch (err) {
            reject(err)
            console.error(err)
        }
    })
}


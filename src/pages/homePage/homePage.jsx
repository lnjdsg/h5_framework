
'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './homePage.less';
import { useObserver } from "mobx-react-lite";

import store from "@src/store";
import { toJS } from 'mobx';

import { RES_PATH } from '../../../crimsonrc'
import modalStore from "@src/store/modal";

import * as THREE from 'three';
const HomePage = memo(() => {

  useEffect(() => {
    // 创建场景
    let scene = new THREE.Scene();


    // 创建摄像机
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    //定位相机
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position); //将相机指向场景


    //创建渲染器 (画布)
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xeeeeee); //渲染初始颜色
    renderer.setSize(window.innerWidth, window.innerHeight);  //canvas 画面大小
    //渲染设置 3d 投影
    renderer.shadowMap.enabled = true;


    //显示三维坐标
    let axes = new THREE.AxesHelper(20); //坐标系的长度
    scene.add(axes); //坐标系添加到场景中


    // 创建地面的大小
    let planeGeometry = new THREE.PlaneGeometry(60, 20); //地面的宽高
    //地面上色
    let planeMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    // 创建地面
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // 设置地面的位置
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    // //将地面添加到坐标轴中
    scene.add(plane);
    plane.receiveShadow = true;


    // //添加正方形
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = 3;
    cube.position.y = 3;
    cube.position.z = 3;
    scene.add(cube);
    cube.castShadow = true;


    //添加球
    let sphereGeometry = new THREE.SphereGeometry(2, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({ color: 'blue' });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 10;
    sphere.position.y = 9;
    sphere.position.z = 4;
    sphere.castShadow = true;
    scene.add(sphere);

    // 添加环境光
    const ambient = new THREE.AmbientLight(0xfbea94);
    // scene.add(ambient);


    // 添加聚光灯
    var point = new THREE.SpotLight(0xffffff);
    point.position.set(80, 100, 80); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    point.angle = Math.PI / 10;
    // point.angle = Math.PI/2;
    point.shadow.mapSize.set(1024, 1024)
    scene.add(point)
    point.castShadow = true;

    document.getElementById('threeBox').appendChild(renderer.domElement);
    renderer.render(scene, camera);




  }, [])


  return useObserver(() => (
    <div className="homePage" id='threeBox'>



    </div>
  ));
})

export default HomePage;

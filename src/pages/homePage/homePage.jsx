
'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './homePage.less';
import { observer, useObserver } from "mobx-react-lite";
import store from "@src/store";
import { toJS } from 'mobx';
import { RES_PATH } from '../../../crimsonrc'
import modalStore from "@src/store/modal";
import API from "@src/api";
import { useNavigate } from "react-router-dom";

const HomePage = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {
        let data = await API.notices()
        // const response = await fetch('http://220.178.249.25:5006/GetInfo/Notice?begin=1&size=5');
        // const data = await response.json();
        console.log("这里可以处理返回的数据:", data); // 这里可以处理返回的数据
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      // let info = await API.getInfo()
      // if (info.success) {
      //   modalStore.pushPop('AuthorizePop')
      // }
    }
    fetchData()
  }, [])

  useEffect(() => {
    //这里做一些类似定时器开关的逻辑
    if (!store.pagehidden) {
      console.log('HomePage')
    }
  }, [store.pagehidden])

  return useObserver(() => (
    <div className="homePage"
      onClick={() => {
        navigate("/customPage?formPage=homePage", { replace: false });
      }}
    >
    </div>
  ));
})

export default HomePage;


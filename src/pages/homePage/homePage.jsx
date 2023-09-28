
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
    //这里做一些类似定时器开关的逻辑
    if(!store.pagehidden){
      console.log('HomePage')
    }
  }, [store.pagehidden])

  return useObserver(() => (
    <div className="homePage"
      onClick={() => {
        navigate("/customPage?type=1", { replace: true });
      }}
    >
    </div>
  ));
})

export default HomePage;


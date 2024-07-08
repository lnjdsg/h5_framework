
'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './index.less';
import { observer, useObserver } from "mobx-react-lite";
import store from "@src/store";
import { toJS } from 'mobx';
import { RES_PATH } from '../../../crimsonrc'
import modalStore from "@src/store/modal";
import API from "@src/api";
const HomePage = memo(() => {

  useEffect(() => {
    const fetchData = async () => {
      // let info = await API.getInfo()
      // console.log("info:", info)
      // if (info.success) {
      //   modalStore.pushPop('AuthorizePop')
      // }
    }
    fetchData()
  }, [])

  return useObserver(() => (
    <div className="homePage" >

    </div>
  ));

})

export default HomePage;



'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './homePage.less';
import { observer, useObserver } from "mobx-react-lite";
import store from "@src/store";
import API from "@src/api";
import modalStore from "@src/store/modal";
const HomePage = memo(() => {

  useEffect(() => {
    const fetchData = async () => {
      let info = await API.getInfo()
      if (info.success) {
        modalStore.pushPop('AuthorizePop')
      }
    }
    fetchData()
  }, [])

  return useObserver(() => (
    <div className="homePage" onClick={() => {
      store.setCurPage('searchPage')
    }}>
    </div>
  ));

})

export default HomePage;



'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './homePage.less';
import { useObserver } from "mobx-react-lite";
import store from "@src/store";
import { toJS } from 'mobx';
import { RES_PATH } from '../../../crimsonrc'
import modalStore from "@src/store/modal";
import { frontendMonitoring } from "frontend-lnjdsg";

const HomePage = memo(() => {

  useEffect(() => {
    // frontendMonitoring()
  }, [])

  return useObserver(() => (
    <div className="homePage" >

    </div>
  ));

})

export default HomePage;


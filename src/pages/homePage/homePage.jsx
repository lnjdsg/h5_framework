
'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './homePage.less';
import { observer, useObserver } from "mobx-react-lite";
import store from "@src/store";
import { toJS } from 'mobx';
import { RES_PATH } from '../../../crimsonrc'
import modalStore from "@src/store/modal";
import API from "@src/api";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";

const HomePage = memo(() => {
  const navigate = useNavigate();
  useEffect(() => {
    
  }, [])

  return useObserver(() => (
    <div className="homePage"
      onClick={() => {
        navigate("/customPage?type=1");
      }}
    >
    </div>
  ));

})

export default HomePage;


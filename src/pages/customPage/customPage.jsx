
'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './customPage.less';
import { observer, useObserver } from "mobx-react-lite";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate,useLocation } from "react-router-dom";

const CustomPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  console.log('type:',type)
  useEffect(() => {
   
  }, [])

  return useObserver(() => (
    <div className="customPage" >

    </div>
  ));

}

export default CustomPage;


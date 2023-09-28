import React, { useEffect, Fragment, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { observer, useObserver } from "mobx-react";
import "./app.less";
import HomePage from "@src/pages/homePage/homePage";
import CustomPage from "@src/pages/customPage/customPage";
import { HashRouter, Routes, Route } from "react-router-dom";
import store from "./store";

/**
* 所有页面场景
*/
const pageMap = {
  homePage: <HomePage />,
  customPage: <CustomPage />,
};

const App = observer(() => {

  useEffect(() => {
    // 设置隐藏属性和改变可见属性的事件的名称
    var hidden, visibilityChange, pagehidden;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document["msHidden"] !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document["webkitHidden"] !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState == "visible") {
        console.info("网页显示");
        pagehidden = false;
        store.pagehidden = false
      } else if (document.visibilityState == "hidden") {
        console.log("网页隐藏");
        pagehidden = true;
        store.pagehidden = true
      }
    };
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }, [])
  
  return useObserver(() => (
    <HashRouter>
      <Routes>
        <Route path="/" element={pageMap.homePage} />
        <Route path="/customPage" element={pageMap.customPage} />
      </Routes>
    </HashRouter>
  ));
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
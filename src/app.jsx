import React, { useEffect, Fragment, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { observer, useObserver } from "mobx-react";
import "./app.less";
import HomePage from "@src/pages/homePage/homePage";
import CustomPage from "@src/pages/customPage/customPage";
import { HashRouter, Routes, Route } from "react-router-dom";
import store from "./store";
import monitorDisplayHide from "./utils/handleVisibilityChange";

/**
* 所有页面场景
*/
const pageMap = {
  homePage: <HomePage />,
  customPage: <CustomPage />,
};

const App = observer(() => {
  monitorDisplayHide()

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
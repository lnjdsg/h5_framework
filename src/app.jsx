import React, { useEffect, Fragment, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { observer, useObserver } from "mobx-react";
import "./app.less";
import HomePage from "@src/pages/homePage/homePage";
import CustomPage from "@src/pages/customPage/customPage";
import { HashRouter, Routes, Route } from "react-router-dom";
import store from "./store";
import monitorDisplayHide from "./utils/handleVisibilityChange";
import Modal from "./modal/modal";
import { handleFontSize } from "./utils/utils";
import ErrorBoundary from "./errorBoundary/errorBoundary";

/**
* 所有页面场景
*/
const pageMap = {
  homePage: <HomePage />,
  customPage: <CustomPage />,
};

const App = observer(() => {

  useEffect(() => {
    handleFontSize()
  }, [])

  monitorDisplayHide()

  return useObserver(() => {
    return <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={pageMap.homePage} />
          <Route path="/customPage" element={pageMap.customPage} />
        </Routes>
      </HashRouter>
      <Modal />
    </ErrorBoundary>
  });
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
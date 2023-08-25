import React, { useEffect, Fragment, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { observer } from "mobx-react";
import "./app.less";
import store from "./store/index";
import Modal from "./modal/modal";
import HomePage from "@src/pages/homePage/homePage";
import {
  getUrlParam
} from "./utils/utils";


/**
* 所有页面场景
*/
const pageMap = {
  homePage: <HomePage />,
 

};
const App = observer(() => {

  const { curPage } = store;
  return (
    <Fragment>
      {{ ...pageMap[curPage] }}
      <Modal />
    </Fragment>
  );
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
import React, { useEffect, Fragment, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { observer } from "mobx-react";
import "./app.less";

import HomePage from "../../views/homeView/homePage/homePage";
import SearchPage from "../../views/searchView/searchPage/searchPage";
import store from "@src/store";
import Modal from "@src/modal/modal";

/**
* 所有页面场景
*/
const pageMap = {
  homePage: <HomePage />,
  searchPage: <SearchPage />,
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

'use strict';
import React, { useEffect, useState, memo, useCallback } from "react";
import './searchPage.less';
import { observer, useObserver } from "mobx-react-lite";
const SearchPage = memo(() => {

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
    <div className="searchPage" >

    </div>
  ));

})

export default SearchPage;


import React, { useEffect } from "react";
import './modal.less';
import { observer } from 'mobx-react';
import modalStore from '../store/modal';
import { toJS } from 'mobx';

import AuthorizePop from "@src/popUps/authorizePop/authorizePop";


/**
* 弹窗配置
*/
export const popConfig = {
  "AuthorizePop": AuthorizePop,
 
};
const Modal = observer(() => {
  
  useEffect(() => {
    // componentDidMount
    return () => {
      // componentWillUnmount
      document.body.style.overflow = 'initial';
    }
  }, []);
  const list = toJS(modalStore.popList);
  if (!list.length) {
    return <section></section>;
  }
  let PopUpMulti, popUpMultiData;
  if (list.length > 1 && list[list.length - 1].isMulti == true) {
    const popObj2 = list[list.length - 1];
    PopUpMulti = popConfig[popObj2.key];
    popUpMultiData = popObj2.data;
  }
  const popObj = list[0];
  const PopUp = popConfig[popObj.key];
  const popData = popObj.data;
  if (PopUp || PopUpMulti) {
    document.body.style.overflow = 'hidden';
  }
  return <section className="modalPopBg" style={{
    zIndex: modalStore.popList.length ? 1000 : -1,
    display: modalStore.popList.length ? 'block' : 'none'
  }}>
    {PopUp && <PopUp popData={popData} />}
    {PopUpMulti && <section className="modalPopBg" style={{
      zIndex: modalStore.popList.length ? 1000 : -1,
      display: modalStore.popList.length ? 'block' : 'none'
    }}>
      <PopUpMulti popData={popUpMultiData} />
    </section>}
  </section>;
});
export default Modal;
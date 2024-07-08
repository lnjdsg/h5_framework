import { useEffect } from "react";
import { action } from "mobx";
import store from "@src/store";

const MonitorDisplayHide = () => {
  useEffect(() => {
    // 设置隐藏属性和改变可见属性的事件的名称
    let hidden, visibilityChange;
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

    const handleVisibilityChange = action(() => {
      if (document.visibilityState === "visible") {
        console.info("网页显示");
        store.pagehidden = false;
      } else if (document.visibilityState === "hidden") {
        console.log("网页隐藏");
        store.pagehidden = true;
      }
    });

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, []);

  return null; 
};

export default MonitorDisplayHide;
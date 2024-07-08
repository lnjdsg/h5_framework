import { makeAutoObservable } from 'mobx';
// 此处配置页面的优先级，越大优先级越高
// PopIndex:11
const modalIndex = {

}

const modalStore = makeAutoObservable({
  popList: [],
  /**
   * 
   * @param {*} key  弹窗名，一般是类名的字符串
   * @param {*} data 需要传递的数据，弹窗中使用 const {popData}  = props; 获取
   * @param {*} isMulti 是否是二级弹窗，在不关闭已有弹窗的基础上，弹出当前弹窗。注意，如果是二级弹窗，关闭时必须传key
   */
  pushPop(key, data,isMulti=false) {
    if (this.popList.length) {
      let cacheList = this.popList.slice();
      cacheList.push({ key, data,isMulti });
      cacheList = cacheList.sort((a, b) => ((modalIndex[b.key] ? modalIndex[b.key] : 10) - (modalIndex[a.key] ? modalIndex[a.key] : 10)))
      this.popList.clear();
      this.popList.push(...cacheList);
    } else {
      this.popList.push({ key, data,isMulti });
    }
    // console.log("this.popList:::",toJS(this.popList));
  },
  /**
   * 
   * @param {*} key  弹窗名，一般是类名的字符串，关闭指定弹窗，若未指定，则关闭当前弹窗
   */
  closePop(key) {
    if (key) {
      let cacheList = this.popList.slice();
      cacheList = cacheList.filter(obj => (obj.key != key));
      this.popList.clear();
      this.popList.push(...cacheList);
    } else {
      this.popList.shift();
    }
  },
   /**
   * 关闭所有弹窗
   */
  closePopAll() {
    this.popList.clear();
  }

});
export default modalStore;

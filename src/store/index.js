import { action, makeAutoObservable } from 'mobx';
import API from '../api/index';
import modalStore from './modal';
const store = makeAutoObservable({
  /** 当前页面 */
  curPage: 'customPage',
  pagehidden:false,
  
})
export default store; 
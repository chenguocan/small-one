import Vue from 'vue'
import App from './App'
import request from '@/components/request/request.js'
import uView from "uview-ui";

Vue.use(uView);
request.setConfig({
  baseUrl: 'http://www.hotelcard.cn/publish/', // 此为测试地址，需加入到域名白名单，或者更改为您自己的线上地址即可
  dataType: 'json', // 可删除，默认为json
  responseType: 'text', // 可删除，默认为text
  // 设置请求头，支持所有请求头设置，也可不设置，去掉header就行
  header: {
    // 'token': 'token from global',
    'content-type': 'application/json' 
  }
})
Vue.prototype.$request = request;
Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})
Vue.config.productionTip = false
import Json from './Json' //测试用数据
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}
Vue.prototype.$api = {json};
//发布订阅EventBus
Vue.prototype.$EventBus=new Vue()
App.mpType = 'app';

const app = new Vue({
    ...App
})
app.$mount()

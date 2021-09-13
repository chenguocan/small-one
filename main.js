import Vue from 'vue'
import App from './App'
import uView from "uview-ui";

Vue.use(uView);
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

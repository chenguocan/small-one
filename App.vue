<script>
	import amap from "./lib/amap-wx.js";
	export default {
		globalData: {
			//https://www.hotelcard.cn/  https://www.hotelcard.cn/TheHeavens/Hotel
			publicApi: 'https://www.hotelcard.cn/TheHeavens',
			api: 'https://www.hotelcard.cn', // api接口
			imgUrl: 'http://121.37.210.175:8001/image/', // 图片地址前缀
			// appid: 'wx9c6352d928983b70', // 小程序appid
			// appid: 'wxfe77e4c39c32be1c'  , // 小程序appid
			//appid:'wxa1820afbbc73fa4c',
			// openid: 'oSa6-4opao_4LwM9fIxFUQyjWj5w', // openid
			/* appid:'wxc469315ccc0dee04', */
			appid: '',
			openid: '', // openid
			userInfo: {}, // 用户信息
			register: '', // 注册情况
			sessionKey: '', // 微信的session_key
			code: '',
			provider: '',
			uid: '',
			avatar: '',
			url3: 'https://www.hotelcard.cn/TheHeavens/JunTai',
			/* https://www.hotelcard.cn/TheHeavens/jt https://www.hotelcard.cn/hotelservice/ */
			/* https://www.hotelcard.cn/TheHeavens/jt */
			location: '',
			latitude: '',
			longitude: '',
			powerList: [],
			baseuid: '',
			target: '',
			relate:false,
		},
		onLaunch: async function(res) {
			/* this.toLocation(); */
			console.log('App.vue->onLaunch', res);
			// #ifdef MP-WEIXIN
			let appid = uni.getAccountInfoSync();
			this.globalData.appid = appid.miniProgram.appId;
			this.getToLogin();
			/* if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				console.log(updateManager);
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启当前应用？',
								success(res) {
									if (res.confirm) {
										updateManager.applyUpdate()
									}
								}
							})
						})
						// 新版本下载失败时执行
						updateManager.onUpdateFailed(function() {
							wx.showModal({
								title: '发现新版本',
								content: '请删除当前小程序，重新搜索打开...',
							})
						})
					}
				})
			} */

			// #endif
			console.log(res);
			/* 			let scene='4d6375d93c9838ab,3,075,121212';
						res.query.scene=scene; */
			uni.setStorageSync('account', '');
			/* if (res.query.scene != null) {
			  let point = res.query.scene.split("*")[1];
			  let account = res.query.scene.split("*")[2];
			  if (account != null) uni.setStorageSync('account', account);
			  if (point != null) uni.setStorageSync('point', point); 
			  uni.switchTab({
			  	url:'./pages/food/food',
				fail(err) {
					console.log(err);
				}
			  })
			} */ //--------------------------------------------------------------------------
		},
		onShow: function(res) {
			console.log('onShow');
			console.log(res)
			/* uni.setStorageSync('point', '075') */
			if (res.query.scene != null) {
				let point = res.query.scene.split("*")[0];
				console.log('point');
				let account = res.query.scene.split("*")[1];
				if (point == '075') {
					if (account != null) uni.setStorageSync('account', account);
					if (point != null) uni.setStorageSync('point', point);
					uni.navigateTo({
						url: '/pages/food/food',
						fail(err) {
							console.log(err);
						}
					})
				} else if (point === '23') {
					let id = res.query.scene.split("*")[1]
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/buyTicket/buyTicket?id=' + id
						})
					}, 300)
				}
				/* else {
									console.log('跳转')
									uni.navigateTo({
										url: "/pages/shopDetail/shopDetail"
									})
								}
				 */
			}
		},
		onHide: function() {

		},
		methods: {

			/**
			 * 获取权限
			 */
			async getPower() {
				let that = this;
				let [err, res] = await uni.request({
					method: 'POST',
					url: that.globalData.publicApi + '/IDs/Power',
					data: {
						uid: that.globalData.uid,
					}
				})
				console.log('power');
				console.log(res);
				if (res.data.errCode === 0) {
					let list = res.data.data;
					that.globalData.powerList = list;
					that.$isResolve()
					let temindex = 0
					list.forEach((item, index) => {
						if (item.page === 'home') {
							temindex = index;
						}
					})
					let target;
					list[temindex].items.forEach(item => {
						if (item.name === '茶餐厅') {
							target = item.code;
						}
					})
					that.globalData.target = target

				}
				console.log(this.globalData.powerList);
				/* console.log(JSON.parse(list)); */
				/* 				let list=JSON.stringify(JSON.parse(res.data.data));		
								globalData.powerList=list; */
			},
			/* 同步获取登录认证 */
			async getToLogin() {
				/* setTimeout(async ()=>{ */
				await this.info();
				/* },60000) */
				/* this.getPower(); */
			},
			// 获取授权和登录信息
			async info() {
				let that = this;
				let [err, res] = await uni.login()
				console.log(res);
				console.log('123');
				console.log(res);
				/* that.getxxx(res.code); */
				if (res.code) {
					let code = res.code;
					that.code = res.code;
					let [err, res2] = await uni.request({
						url: 'https://www.hotelcard.cn/TheHeavens/WeChat/OpenId', // 这里可以获得openid
						method: 'POST',
						data: {
							appid: that.globalData.appid,
							type: 1,
							code: code
						},
					})

					if (res2) {
						console.log('openid');
						console.log(res2);
						if (res2.data.errCode == 0) {
							const resData = res2.data.data;
							that.globalData.openid = resData.openid;
							that.globalData.register = resData.register;
							that.globalData.sessionKey = resData.session_key;
							that.globalData.relate=resData.relate;
							that.globalData.baseuid = resData.uid;
							uni.setStorageSync('openId', that.globalData.openid);
							uni.setStorageSync('register', that.globalData.register);
							uni.setStorageSync('appId', that.globalData.appid);
							if (that.globalData.register === false) {

							} else {

							}
							that.login();


							/* else{
															uni.reLaunch({
																url:'/pages/user/login',
																success(){
																	uni.hideHomeButton()
																}
															})
														} */
							// openid: '', // openid
							// register: '', // 注册情况
							// sessionKey: '', // 微信的session_key
						}
						/* else{
													uni.reLaunch({
														url:'/pages/user/login',
														success() {
															uni.hideHomeButton();
														}
													})
												} */
					}
				}
			},
			/* 登录认证 */
			async login() {
				let that = this;
				let [err, res] = await uni.request({
					url: this.globalData.publicApi + '/IDS/Login',
					method: 'POST',
					data: {
						system: that.globalData.appid,
						type: 3,
						company: 2,
						uid: that.globalData.baseuid
					}
				})
				if (res) {
					console.log('/Base/Login');
					console.log(res);
					if (res.data.errCode === 0) {
						uni.setStorageSync('uid', res.data.uid);
						that.globalData.uid = res.data.data.uid;
						that.globalData.url3 = res.data.data.service;
						that.getPower();
					} else {}
				} else {
					uni.showToast({
						title: "请求失败",
						icon: "none"
					})
				}
			},

			getProvider() {
				let that = this;
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						that.globalData.provider = res.provider[0];
					},
				})
			}
		}

	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "./static/icon/iconfont.css";
	@import "./static/icon/iconfont2.css";
	@import "uview-ui/index.scss";

	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}

	page {
		background-color: #F1F2F2;
	}

	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-yiguoqi1:before {
		content: "\e700";
	}

	.icon-iconfontshanchu1:before {
		content: "\e619";
	}

	.icon-iconfontweixin:before {
		content: "\e611";
	}

	.icon-alipay:before {
		content: "\e636";
	}

	.icon-shang:before {
		content: "\e624";
	}

	.icon-shouye:before {
		content: "\e626";
	}

	.icon-shanchu4:before {
		content: "\e622";
	}

	.icon-xiaoxi:before {
		content: "\e618";
	}

	.icon-jiantour-copy:before {
		content: "\e600";
	}

	.icon-fenxiang2:before {
		content: "\e61e";
	}

	.icon-pingjia:before {
		content: "\e67b";
	}

	.icon-daifukuan:before {
		content: "\e68f";
	}

	.icon-pinglun-copy:before {
		content: "\e612";
	}

	.icon-dianhua-copy:before {
		content: "\e621";
	}

	.icon-shoucang:before {
		content: "\e645";
	}

	.icon-xuanzhong2:before {
		content: "\e62f";
	}

	.icon-gouwuche_:before {
		content: "\e630";
	}

	.icon-icon-test:before {
		content: "\e60c";
	}

	.icon-icon-test1:before {
		content: "\e632";
	}

	.icon-bianji:before {
		content: "\e646";
	}

	.icon-jiazailoading-A:before {
		content: "\e8fc";
	}

	.icon-zuoshang:before {
		content: "\e613";
	}

	.icon-jia2:before {
		content: "\e60a";
	}

	.icon-huifu:before {
		content: "\e68b";
	}

	.icon-sousuo:before {
		content: "\e7ce";
	}

	.icon-arrow-fine-up:before {
		content: "\e601";
	}

	.icon-hot:before {
		content: "\e60e";
	}

	.icon-lishijilu:before {
		content: "\e6b9";
	}

	.icon-zhengxinchaxun-zhifubaoceping-:before {
		content: "\e616";
	}

	.icon-naozhong:before {
		content: "\e64a";
	}

	.icon-xiatubiao--copy:before {
		content: "\e608";
	}

	.icon-shoucang_xuanzhongzhuangtai:before {
		content: "\e6a9";
	}

	.icon-jia1:before {
		content: "\e61c";
	}

	.icon-bangzhu1:before {
		content: "\e63d";
	}

	.icon-arrow-left-bottom:before {
		content: "\e602";
	}

	.icon-arrow-right-bottom:before {
		content: "\e603";
	}

	.icon-arrow-left-top:before {
		content: "\e604";
	}

	.icon-icon--:before {
		content: "\e744";
	}

	.icon-zuojiantou-up:before {
		content: "\e605";
	}

	.icon-xia:before {
		content: "\e62d";
	}

	.icon--jianhao:before {
		content: "\e60b";
	}

	.icon-weixinzhifu:before {
		content: "\e61a";
	}

	.icon-comment:before {
		content: "\e64f";
	}

	.icon-weixin:before {
		content: "\e61f";
	}

	.icon-fenlei1:before {
		content: "\e620";
	}

	.icon-erjiye-yucunkuan:before {
		content: "\e623";
	}

	.icon-Group-:before {
		content: "\e688";
	}

	.icon-you:before {
		content: "\e606";
	}

	.icon-forward:before {
		content: "\e607";
	}

	.icon-tuijian:before {
		content: "\e610";
	}

	.icon-bangzhu:before {
		content: "\e679";
	}

	.icon-share:before {
		content: "\e656";
	}

	.icon-yiguoqi:before {
		content: "\e997";
	}

	.icon-shezhi1:before {
		content: "\e61d";
	}

	.icon-fork:before {
		content: "\e61b";
	}

	.icon-kafei:before {
		content: "\e66a";
	}

	.icon-iLinkapp-:before {
		content: "\e654";
	}

	.icon-saomiao:before {
		content: "\e60d";
	}

	.icon-shezhi:before {
		content: "\e60f";
	}

	.icon-shouhoutuikuan:before {
		content: "\e631";
	}

	.icon-gouwuche:before {
		content: "\e609";
	}

	.icon-dizhi:before {
		content: "\e614";
	}

	.icon-fenlei:before {
		content: "\e706";
	}

	.icon-xingxing:before {
		content: "\e70b";
	}

	.icon-tuandui:before {
		content: "\e633";
	}

	.icon-zuanshi:before {
		content: "\e615";
	}

	.icon-zuo:before {
		content: "\e63c";
	}

	.icon-shoucang2:before {
		content: "\e62e";
	}

	.icon-shouhuodizhi:before {
		content: "\e712";
	}

	.icon-yishouhuo:before {
		content: "\e71a";
	}

	.icon-dianzan-ash:before {
		content: "\e617";
	}
</style>

<script>
	export default {
		globalData: {
			api: 'https://www.hotelcard.cn/TheHeavens/Hotel', // api接口
			imgUrl: 'http://121.37.210.175:8001/image/', // 图片地址前缀
			// appid: 'wx9c6352d928983b70', // 小程序appid
			// appid: 'wxfe77e4c39c32be1c'  , // 小程序appid
			//appid:'wxa1820afbbc73fa4c',
			// openid: 'oSa6-4opao_4LwM9fIxFUQyjWj5w', // openid
			/* appid:'wxc469315ccc0dee04', */
			appid:'wx9c6352d928983b70',
			openid: '', // openid
			userInfo: {}, // 用户信息
			register: '', // 注册情况
			sessionKey: '', // 微信的session_key
			code:'',
			provider:'',
			url3:'https://www.hotelcard.cn/TheHeavens/Hotel/'
		},
		onLaunch:function(res) {
			console.log('App.vue->onLaunch',res);
			// #ifdef MP-WEIXIN
			this.getToLogin();
			// #endif
			console.log(res);
/* 			let scene='4d6375d93c9838ab,3,075,121212';
			res.query.scene=scene; */
			uni.setStorageSync('account', '');
			if (res.query.scene != null) {
			  let point = res.query.scene.split("*")[1];
			  let account = res.query.scene.split("*")[2];
			  if (account != null) uni.setStorageSync('account', account);
			  if (point != null) uni.setStorageSync('point', point);
			  setTimeout(function(){
			  	uni.switchTab({
			  		url:`/pages/food/food`,
			  		/* url:`/pages/food/food?scene=${scene}` */
					fail: (err) => {
						console.log(err);
					}
			  	})
			  },0)
			} //--------------------------------------------------------------------------
		},
		onShow: function() {
			// console.log('App Show')
			/* if(uni.getStorageSync('hide')){
				if(uni.getStorageSync('account') && uni.getStorageSync('point'));
				setTimeout(function(){
					uni.switchTab({
						url:`/pages/food/food`,
						
									fail: (err) => {
										console.log(err);
									}
					})
				},0)
			} */
		},
		onHide: function() {
			/* console.log('123');
			uni.setStorageSync('hide',true); */
			// console.log('App Hide')
		},
		methods: {
			/* 同步获取登录认证 */
			async getToLogin(){
				await this.info();
				await this.login();
			},
			// 获取授权和登录信息
			async info() {
				let that = this;
				let [err,res]=await uni.login()
				if(res.code){
					let code=res.code;
					that.code=res.code;
					let [err,res2]=await uni.request({
						url: that.globalData.api + '/Wx/GetOpenId', // 这里可以获得openid
						method: 'POST',
						data: {
							appid: that.globalData.appid,
							type: 1,
							code: code
						},
					})
					
					if(res2){
						console.log('openid');
						console.log(res2);
						if (res2.data.errCode == 0) {
							const resData = res2.data.data;
							that.globalData.openid = resData.openid;
							that.globalData.register = resData.register;
							that.globalData.sessionKey = resData.session_key;
							that.$isResolve()
							uni.setStorageSync('openId',that.globalData.openid);
							uni.setStorageSync('register',that.globalData.register);
							uni.setStorageSync('appId',that.globalData.appid);	
							// openid: '', // openid
							// register: '', // 注册情况
							// sessionKey: '', // 微信的session_key
						}
					}
				}
			},
			/* 登录认证 */
			async login(){
				let code=this.code;
				let that=this;
				let [err,res]=await uni.request({
					url:that.globalData.api+'/Base/Login',
					method:'POST',
					data:{
						system:that.globalData.appid,
						type:3,
						company:6,
						code:that.globalData.openid
					}
				})
				if(res){
					console.log(res);
					if(res.data.errCode===0){
						
					}else{
						uni.showToast({
							title:'认证失败',
							icon:'none'
						})
					}
				}else{
					uni.showToast({
						title:"请求失败",
						icon:"none"
					})
				}
			},
			
			getProvider(){
				let that=this;
				uni.getProvider({
					service:'oauth',
					success:function(res){
						that.globalData.provider=res.provider[0];
					},
				})
			}
		}
		
	}
</script>

<style lang="scss">
    /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
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

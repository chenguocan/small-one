<template>
	<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<view class="background" style="width: 750rpx;height: 970rpx;" :style="'background-image:url('+background+')'">
			
		</view>
		<view>
			<button class="btn" :class="check?'disable':''" :disabled="check" hover-class="none" open-type="getPhoneNumber" @getphonenumber="bindgetphonenumber" >获取手机号</button>
			<button class="btn" :class="check?'':'disable'" :disabled="!check" hover-class="none"  @click="bindgetuserinfo" >微信授权登录</button>
		</view>
		<!-- <view class="step">
			<view class="step1 step-item">
				<text>第一步：需要获取到手机号信息关联</text>
				<button :class="check?'disable':''" :disabled="check" hover-class="none" open-type="getPhoneNumber" @getphonenumber="bindgetphonenumber" >获取手机号</button>
			</view> 
			<view class="step2 step-item">
				<text>第二步：需要获取微信信息完成注册</text>
				<button :class="check?'':'disable'" :disabled="!check" hover-class="none" open-type="getUserInfo" @getuserinfo="bindgetuserinfo">微信授权登录</button>
			</view>
		</view> -->
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
			请在微信小程序端进行登录注册
		<!-- #endif -->
	</view>
</template>

<script>
	const prefix = getApp().globalData.url3;
const globalData = getApp().globalData;
export default {
	data() {
		let that = this;
		return {
			openId: '', // 微信openid
			check: false, // 按钮点击状态
			phone: 0, // 手机号码
			sessionKey: '', 
			phoneScrect:{},
			background:'',
			url:false,
			ticketId:'',
		};
	},
	async onLoad(options){
		console.log(options);
		if(options.url){
			this.url=options.url;
		}
		if(options.id){
			this.ticketId=options.id;
		}
		
	},
	async onShow() {
		await this.$onLaunched;
		this.openId = globalData.openid;
		if(globalData.register){
			this.getBackground();
		}
		/* this.getBackground(); */
	},
	computed: {
		
	},
	methods: {
		
		getBackground() {
			let that = this;
			uni.request({
				method: 'POST',
				url: globalData.url3 + '/Config/GetTargetConfig',
				data: {
					target: 'register',
					uid: globalData.uid
				},
				success(res) {
					if (res.data.errCode === 0) {
						console.log(res);
						
						that.background=res.data.data.background_image;
					} else {
		
					}
				}
			})
		},
		/**
		 * 用户授权
		 */
		bindgetuserinfo() {
			console.log('dianji')
			let that=this;
			 wx.getUserProfile({
				desc:'通过用户信息进行订单的绑定',
				success(res){
					console.log(res);
					that.register(res)
				},
				fail(err){
					console.log(err);
					uni.showToast({
						title:err,
						icon:"none",
					})
				}
			}) 
		},
		/**
		* 手机号授权
		*/
		bindgetphonenumber(res) {
			/* console.log(globalData); */
			let that = this;
			let encryptedData = res.detail.encryptedData;
			let iv = res.detail.iv;
			let sessionKey = globalData.sessionKey;
			console.log(res);
			/* console.log(sessionKey); */
			if (encryptedData && iv) { // 确认授权
					this.phoneScrect=res.detail
					that.check = !that.check;
					/* uni.showLoading({ 
						title: '加载中...',
					})
					uni.request({ //提交用户信息获取用户id
						url: globalData.publicApi + '/WeChat/GetPhone',
						method: 'post',
						data: {
							sessionKey: sessionKey,
							encryptedData: encryptedData,
							iv: iv,
							clienttype:1,
							openid:globalData.openid,
							appid:globalData.appid
						},
						success(result2) {
							console.log(result2)
							if (result2.data.errCode === 0) {
								that.check = !that.check; // 切换按钮禁用状态
							} else {
								uni.showModal({
									title: '提示',
									content: result2.data.errMsg,
									confirmText: '确定',
									showCancel: false
								})
							}
						},
						fail(err) {
							console.log(err);
						},
						complete () {
							uni.hideLoading();
						}
					}) */

			}
		},
		
		/**
		 * 用户注册
		 */
		register(info) {
			console.log(info);
		    let that = this;
		    let phone = that.phone;
		    let openId = globalData.openid;
			let userInfo = info.userInfo;
		    let nickName = userInfo.nickName;
		    let avatarUrl = userInfo.avatarUrl;
		    let gender = userInfo.gender;
		    let province = userInfo.province;
		    let country = userInfo.country;
		    let city = userInfo.city;
		    uni.request({
				url: globalData.publicApi+'/WeChat/Register',
				method: 'post',
				data: {
					appid: globalData.appid,
					openid: openId,
					nickName: nickName,
					avatarUrl: avatarUrl,
					gender: gender,
					province: province,
					country: country,
					city: city,
					language:"CHN",
					iv:info.iv,
					encryptedData:info.encryptedData,
					phone_iv:that.phoneScrect.iv,
					phone_encryptedData:that.phoneScrect.encryptedData,
				},
				success(res) {
					console.log('register', res);
					if (res.data.errCode == 0) {
						globalData.userInfo = userInfo;
						globalData.register = true;
						uni.setStorageSync('register',globalData.register);
						if(globalData.register===true){
							that.loginBase();
						}
						/* uni.switchTab({
							url:'/pages/tabBar/user',
						}) */
						/* that.loginBase(); */
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.errMsg,
							confirmText: '确定',
							showCancel: false
						})
					}
				},
				fail(err) {
					console.log(err)
				}
		    })
		},
		async loginBase() {
			let that = this;
			let [err, res] = await uni.request({
				url: globalData.publicApi + '/IDS/Login',
				method: 'POST',
				data: {
					system: globalData.appid,
					type: 3,
					company: 2,
					uid: globalData.baseuid
				}
			})
			if (res) {
				console.log('/Base/Login');
				console.log(res);
				if (res.data.errCode === 0) {
					uni.setStorageSync('uid', res.data.uid);
					globalData.uid = res.data.data.uid;
					/* uni.switchTab({
						url:'/pages/tabBar/user',
					}) */
					if(that.url){
						uni.redirectTo({
							url:'../food/food'
						})
					}else if(that.ticketId!==''){
						uni.reLaunch({
							url:'../buyTicket/buyTicket?id='+that.ticketId
						})
					}else{
						uni.navigateBack();
					}
				} else {
					uni.showToast({
						title: '认证失败',
						icon: 'none'
					})
				}
			} else {
				uni.showToast({
					title: "请求失败",
					icon: "none"
				})
			}
		},
	}
};
</script>

<style scoped lang="less">
	.background{
		background-size: 100%;
		background-repeat: no-repeat;
		/* background-image: url('http://121.4.13.106:8078/images/background.png'); */
	}
	.container {
	  width: 100%;
	  height: 100vh;
	  background-color: white;
	  overflow: hidden;
	
	}
	.step {
	  color: #fff;
	}
	.step .step-item {
	  width: 656rpx;
	  margin: 200rpx auto;
	}
	.step .step-item > button {
	  margin-top: 30rpx;
	  width: 656rpx; 
	  height: 100rpx;
	  line-height: 100rpx;
	  background-color: #be5c53;
	  font-size: 34rpx;
	  color: #fff;
	}
	.step .step-item > button.disable {
	  color: #be2d29;
	  background-color: #EEE;
	}
	.btn{
		border: none;
		border: 1px solid #f7f7f7;
		color: white;
		width: 300rpx;
		height: 90rpx;
		border-radius: 40rpx;
		background-color: #be2d29;
		margin-top: 20rpx;
	}
	button:after {  
	    border: none;  
	}
</style>

<template>
	<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<view class="step">
			<view class="step1 step-item">
				<text>第一步：需要获取到手机号信息关联</text>
				<button :class="check?'disable':''" :disabled="check" hover-class="none" open-type="getPhoneNumber" @getphonenumber="bindgetphonenumber" >获取手机号</button>
			</view> 
			<view class="step2 step-item">
				<text>第二步：需要获取微信信息完成注册</text>
				<button :class="check?'':'disable'" :disabled="!check" hover-class="none" open-type="getUserInfo" @getuserinfo="bindgetuserinfo">微信授权登录</button>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
			请在微信小程序端进行登录注册
		<!-- #endif -->
	</view>
</template>

<script>
const globalData = getApp().globalData;
export default {
	data() {
		let that = this;
		return {
			openId: '', // 微信openid
			check: false, // 按钮点击状态
			phone: 0, // 手机号码
			sessionKey: '', 
			nav:'',
		};
	},
	onLoad(options){
		if(options.nav){
			console.log(options);
			this.nav=options
		}
	},
	async onShow() {
		await this.$onLaunched;
		this.openId = globalData.openid;
	},
	computed: {
		
	},
	methods: {
		/**
		 * 用户授权
		 */
		bindgetuserinfo(res) {
			const that = this;
			const userInfo = res.detail.userInfo;
			if (userInfo) { 
			  // console.log(userInfo);
			  // wx.setStorageSync('userInfo', res.detail.userInfo);
			  that.register(userInfo); // 用户注册
			  uni.switchTab({
			  	url:'/pages/tabBar/index',
			  })
			}
		},
		/**
		* 手机号授权
		*/
		bindgetphonenumber(res) {
			console.log(globalData);
			let that = this;
			let encryptedData = res.detail.encryptedData;
			let iv = res.detail.iv;
			let sessionKey = globalData.sessionKey;
			console.log(res);
			console.log(sessionKey);
			if (encryptedData && iv) { // 确认授权
				if (sessionKey){
					uni.showLoading({ 
						title: '加载中...',
					})
					uni.request({ //提交用户信息获取用户id
						url: globalData.api + '/Wx/GetPhone',
						method: 'post',
						data: {
							sessionKey: sessionKey,
							encryptedData: encryptedData,
							iv: iv,
							clienttype:1,
							openid:globalData.openid
						},
						success(result2) {
							console.log(result2)
							if (result2.data.errCode == 0) {
								console.log(result2);
								let phone = result2.data.data.purePhoneNumber;
								that.phone = phone; // 设置手机号
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
					})
				}
			}
		},
		
		/**
		 * 用户注册
		 */
		register(info) {
		    let that = this;
		    let phone = that.phone;
		    let openId = that.openId;
			let userInfo = info;
		    let nickName = userInfo.nickName;
		    let avatarUrl = userInfo.avatarUrl;
		    let gender = userInfo.gender;
		    let province = userInfo.province;
		    let country = userInfo.country;
		    let city = userInfo.city;
/* 		    console.log({
				openid: openId,
				phone: phone,
				nickName: nickName,
				avatarUrl: avatarUrl,
				gender: gender,
				province: province,
				country: country,
				city: city
		    }); */
			// return;
		    uni.request({
				url: globalData.api + '/Wx/Register',
				method: 'post',
				data: {
					appid: globalData.appid,
					type: 1,
					openid: openId,
					phone: phone,
					nickName: nickName,
					avatarUrl: avatarUrl,
					gender: gender,
					province: province,
					country: country,
					city: city,
					clienttype:1,
					language:"CHN"
				},
				success(res) {
					console.log('register', res);
					if (res.data.errCode == 0) {
						globalData.userInfo = userInfo;
						globalData.register = true;
/* 						if(that.nav){
							if(that.nav==='food'){
								uni.switchTab({
									url:'../food/food'
								})
							}
						} */
						uni.navigateBack({});
						uni.showToast({
						    title: '登录成功'
						});
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
	}
};
</script>

<style scoped lang="less">
	.container {
	  width: 100%;
	  height: 100vh;
	  background-color: #3e74a3;
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
	  background-color: #5da1c8;
	  font-size: 34rpx;
	  color: #fff;
	}
	.step .step-item > button.disable {
	  color: #346495;
	  background-color: #EEE;
	}
</style>

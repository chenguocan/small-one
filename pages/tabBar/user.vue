<template>
	<view>
		<view class="top">
			<!-- <view class="pencil" @click="toSetting"></view> -->
			<view class="email" @click="toEmail" v-if="msgNum>0">  <!-- @click="toEmail" -->
				<text  class="num">{{msgNum}}</text>
			</view>
			<view class="header" @click="toLogin"><!-- @click="toLogin" -->
				<view class="headimg">
					<u-avatar :src="userInfo.avatarUrl" ></u-avatar>
					<!-- <img :src="userInfo.avatarUrl" alt="" class='img'> -->
				</view>
				<view class="user_name">
					<!-- <view class='vipCard'>
						{{userInfo.avatarUrl ? '会员卡' : '点击登录'}}
						<u-icon size="25"  color="#e5e6e6" name="arrow-right"></u-icon></view> -->
					<view>
						<text class='phone'>{{userInfo.avatarUrl ? userInfo.nickName : '立即登录'}}</text>
					</view>
					<text class="phone">{{userInfo.avatarUrl ? userInfo.phone : ''}}</text>
					<view class='phone vip' v-if="is===true" @click='vipNav'>  <!-- @click='vipNav' -->
					 我的会员卡
					<u-icon size="25" class='rightIcon'  color="#f3f4f4" name="arrow-right"></u-icon>
					</view>
				</view>
				<view class="car-desc">{{membershipDescription}}</view>
			</view>
		</view>
		<view class="navbar">
			<!-- <view class='vipCard'>
				<view class='level'>
					<u-icon name='level' color="black"></u-icon>
					<text >会员卡</text>
				</view>
				<view class='level'>
					<text @click="getVip">查看领取</text>
				</view>
			</view> -->
			<view class='navContent'>
				<view class='xxx'>
					<view class="bar" v-for="(item,index) in barList" :key="item.id" @click="toOrderList(index+1)">  <!-- @click="toOrderList(index+1)" -->
						<view class='bar_view' :style="{background:item.image,'background-size':size}"></view>
						<view class="bar_name">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="floored">
			<view class="floored_item" v-for="(item,index) in list" :key="index"  @click="toFloored(item.index)"> <!-- @click="toFloored(item.index)" -->
				<view class="floored_view">
					<view class="floored_img" :style="{background:item.image,'background-size':size}">
					</view>
				</view>
				<view class="floored_name">
					{{item.name}}
					<u-icon size="30"  color="black" name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
		<u-popup v-model="showPopup" mode="center" >
			<image :src="lockImage" class="lock-image"></image>
		</u-popup>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				openId: '', // 微信openid
				register: '', // 是否注册
				userInfo: {}, // 用户信息
				size: "cover",
				is:false,
				usableRoomList:[],
				barList: [{
						name: "待付款",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/pay1.png') no-repeat",
						index: 1
					},
					{
						name: "已付款",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/pay2.png') no-repeat",
						index: 2
					},
					{
						name: "执行中",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/incomplete.png') no-repeat",
						index: 3
					},
					{
						name: "已完成",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/complete.png') no-repeat",
						index: 4
					}
				],
				list: [{
						name: "我的订单",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/lease.png') no-repeat",
						index: 0
					},
					{
						name: "门禁管理",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/door.png') no-repeat",
						index: 1
					},
					/* {
						name: "会员卡",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/Notice.png') no-repeat",
						index: 2
					}, */
					{
						name: "我的房卡",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/Notice.png') no-repeat",
						index: 4
					},
					{
						name: "优惠券",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/coupon.png') no-repeat",
						index: 3
					}
				],
				msgNum: 0, // 消息数量
				showPopup: false, // 显示模态框图
				lockImage: '', // 开锁的二维码
				membershipDescription: '', // 会员卡描述
			}
		},
		async onShow(){
			await this.$onLaunched;
			// this.loadUser();
			let openId = this.openId = globalData.openid;
			// #ifdef MP-WEIXIN
			this.getAccount();
			// #endif
			
			/////////////////////////////////
			/* this.getNewInfoCount(); */
			this.register = globalData.register;
			/* this.getLockAuthorizeRoom(); */
			//////////////////////////////////
			// this.getOpenLock();
			// console.log('userInfo', this.userInfo);
			// if (openId) this.getAccount();
		},
		methods: {
			xxx(){
				return uni.showToast({
					title:'未授权用户',
					icon:'none'
				})
			},
			/**
			 * 跳转会员卡界面
			 */
			vipNav(){
				uni.navigateTo({
					url:"../user/card"
				})
			},
			/**
			 * 获取会员卡描述
			 */
			getMembershipDescription () {
				const that = this;
				const openId = this.openId;
				const appId = globalData.appid;
				uni.request({ //提交用户信息获取用户id
					url: globalData.api + '/MCM/GetMembershipDescription',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
						clienttype:1,
					},
					success(res) {
						console.log('GetMembershipDescription ', res);
						if (res.data.errCode == 0) {
							that.membershipDescription = res.data.data;
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			
			/**
			 * 获取开锁二维码
			 */
			getOpenLock() {
				const that = this;
				const openId = this.openId;
				const appId = globalData.appid;
				if(that.usableRoomList.length===0){
					return uni.showModal({
						title:'温馨提示',
						content:'没有授权',
						showCancel:false,
					})
				}
 				uni.request({ //提交用户信息获取用户id
					url: globalData.api + '/MCM/OpenLock',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
						clienttype:1,
					},
					success(res) {
						console.log('OpenLock', res);
						
						if (res.data.errCode == 0) {
							that.lockImage = res.data.data;
							that.showPopup = true;
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				}) 
			},
			
			
			/**
			 * 获取可授权开锁的房间列表
			 */
			getLockAuthorizeRoom () {
				let that = this;
				const name = that.nameVal;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetLockAuthorizeRoom',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype:1,
					},
					success: function (res) {
						console.log('GetLockAuthorizeRoom', res);
						if (res.data.errCode == 0) {
							const data = res.data.data;
							let usableRoomList = [];
							for (let index in data) {
								let listItem = usableRoomList[index] = {};
								listItem.value = data[index];
								listItem.label = data[index];
							}
							that.usableRoomList = usableRoomList;
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			/**
			 * 获取用户信息
			 */
			getAccount() {
				const that = this;
				const openId = this.openId;
				const appId = globalData.appid;

				uni.request({ //提交用户信息获取用户id
					url: globalData.api + '/Wx/GetAccount',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
						clienttype:1,
						
					},
					success(res) {
						console.log('getAccount', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.userInfo = resData;
							globalData.userInfo = resData;
							that.is=true;
							/////////////////////////
							/* that.getMembershipDescription(); */
						} else {
							that.userInfo = {};
							globalData.userInfo = {};
						}
					}
				})
			},
			
			getNewInfoCount() {
				const that = this;
				const openId = this.openId;
				const appId = globalData.appid;
				uni.request({ //提交用户信息获取用户id
					url: globalData.api + '/MCM/GetNewInfoCount',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
						clienttype:1,
					},
					success(res) {
						console.log('GetNewInfoCount', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.msgNum = resData > 99 ? 99 : resData;
						}
					}
				})
			},
			
			/**
			 * 去登录
			 */
			toLogin() {
				if (!this.register) {
					uni.navigateTo({
						url: '../user/login'
					})
				}
			},
			
			/**
			 * 去邮箱
			 */
			toEmail() {
				if (this.register) {
					uni.navigateTo({
						url: '../user/message'
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录后操作',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/login'
								})
							}
						}
					})
				}
			},
			
			/**
			 * 去设置
			 */
			toSetting() {
				uni.showToast({
					title: '该功能开发中',
					icon: 'none'
				})
				return;
				if (this.register) {
					uni.navigateTo({
						url: '../user/setting'
					})
				}
			},
			
			toFloored(index) {
				console.log(index);
				if (this.register) {
					if (index == 3) {
						uni.navigateTo({
							url: "../coupon/coupon"
						})
					} else if (index == 2) {
						uni.navigateTo({
							url: "../user/card"
						})
					} else if (index == 1) {
						uni.navigateTo({
							url: "../user/guard"
						})
					} else if (index == 0) {
						uni.navigateTo({
							url: "../user/lease"
						})
					} else if (index == 4) {
						/* this.getOpenLock(); */
						uni.navigateToMiniProgram({
							appId:'wxf7dd6d6f511d53dc',
							success(res){
								console.log("打开成功")
							},
							fail(err){
								uni.showToast({
									title:err,
								})
							}
						})
					}
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录后操作',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/login'
								})
							}
						}
					})
				}
				
			},
			toOrderList(index) {
				if (this.register) {
					uni.navigateTo({
						url: "../order/orderList?state=" + index
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录后操作',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/login'
								})
							}
						}
					})
				}
				
			},
			loadUser(){
				this.$request
					.post("/MCM/GetMembershipCard", {
						header: {
							'content-type': 'application/json'
						},
						data: {
							appid: "wx9c6352d928983b70",
							clienttype:1,
						},
						dataType: 'json',
						responseType: 'text'
					})
					.then(res => {
						this.user = res.data.data;
					})
			},
			getVip(){
				console.log("123123")
				uni.showModal({
					title:'提示',
					content:'功能尚未开放',
					showCancel:false,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.top {
		width: 100%;
		height: 300rpx;
		display: flex;
		align-items: center;
		background: url(http://121.37.210.175:8001/image/wxc469315ccc0dee04/1a823f9e68f00002.jpg);
		background-size: 100%;
	}

	.header {
		display: flex;
		height: 200rpx;
		justify-content: center;
		align-items: center;
		margin-left: 30rpx;
	}

	.headimg {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.img {
		display: block;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.user_name {
		display: flex;
		flex-direction: column;
		font-size: 16px;
		margin-left: 20rpx;
		color: gray;
		line-height: 38rpx;
	}
	/* .vipCard{
		display: flex;
		align-items: center;
		color:black;
		font-size: 20px;
		margin-bottom: 40rpx;
	} */
	.vipCard{
		display: flex;
		justify-content: space-between;
		color:white;
		height: 120rpx;
		width: 500rpx;
		background: url(https://img-u-4.51miz.com/preview/element/00/01/05/87/E-1058743-9EBF2547.jpg!/quality/90/unsharp/true/compress/true/format/jpg/fh/320) no-repeat;
		line-height: 60rpx;
		border-radius: 10rpx;
		margin: 0 auto;
		transform: translateY(50%);
	}
	.level{
		margin: 0 20rpx;
	}
	.phone{
		margin-left: 20rpx;
		margin-bottom: 15rpx;
		font-size: 12px;
		color: rgba(242, 242, 242, 1.0);
	}
	.vip{
		display: flex;
		align-items: center;
		color: white;
	}
	.rightIcon{
		margin-left: 80rpx;
	}
	.car-desc {
		margin-top: 10rpx;
		font-size: 23rpx;
		color: rgba(241, 242, 242, 1);
	}

	.email {
		position: absolute;
		right:  30rpx;
		top: 56rpx;
		z-index: 11;
		width: 52rpx;
		height: 42rpx;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/email.png") no-repeat;
		background-size: cover;
	}
	.email > .num {
		position: absolute;
		top: -20rpx;
		right: -20rpx;
		display: block;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: #fff;
		text-align: center;
		font-size: 24rpx;
		border-radius: 50%;
		background-color: #f00;
	}
	
	.pencil {
		position: absolute;
		right: 120rpx;
		top: 56rpx;
		z-index: 11;
		width: 45rpx;
		height: 45rpx;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/pencil.png") no-repeat;
		background-size: cover;
	}

	///////////////////////////////
	.navContent{
		display: flex;
		justify-content: center;
		width: 100%;
		
	}
	.xxx{
		position: absolute;
		align-items: center;
		display: flex;
		justify-content: center;
		height: 200rpx;
		width: 90%;
		background: white;
		box-shadow: 2rpx 3rpx 10rpx #8f8f8f;
		border-radius: 15rpx;
		transform: translateY(-40rpx);
		opacity: 0.9;
		z-index: 1;
	}
	.navbar {
		width: 100%;
		height: 365rpx;
	}

	.bar {
		display: flex;
		width: 25%;
		height: 165rpx;
		justify-content: center;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
	}

	.bar_view {
		display: block;
		width: 80rpx;
		height: 82rpx;
	}

	.bar_name {
		padding-top: 4rpx;
		display: block;
		font-size: 21rpx;
	}

	////////////////////////////////////
	.floored {
		display: flex;
		background: white;
		flex-wrap: wrap;
		transform: translateY(-100rpx);
	}

	.floored_item {
		display: flex;
		
		padding:0 30rpx;
		align-items: center;
		width: 100%;
		
	}

	.floored_img {
		height: 45rpx;
		width: 45rpx;
	}

/* 	.floored_item:nth-of-type(2n-1) .floored_img {
		margin-left: 129rpx;
	} */

	.floored_name {
		display: flex;
		justify-content: space-between;
		margin:0 20rpx;
		padding:30rpx;
		width: 100%;
		width: 100%;
		font-size: 16px;
		border-bottom: 1rpx solid #f5f5f5;
	}

/* 	.floored_item:nth-of-type(2n-1) .floored_name {
		margin-left: 129rpx;
	} */
	
	.lock-image {
		width: 500rpx;
		height: 500rpx;
	}
</style>

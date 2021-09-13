<template>
	<view style="height: 500rpx;">
		<view class="top" :style="'background-image:url('+background+')'">
			<view class="email" @click="toEmail" v-if="register">
				<text class="num" v-if="msgNum!=0">{{msgNum}}</text>
			</view>
			<view class="header" @click="toLogin">
				<view class="headimg">
					<u-avatar :src="userInfo.avatarUrl"></u-avatar>
				</view>
				<view class="user_name">
					<view>
						<text class='phone'>{{register ? userInfo.nickName : '立即登录'}}</text>
					</view>
					<view class="phone">{{register ? userPhone : ''}}</view>
				</view>
				<view class="car-desc">{{membershipDescription}}</view>
			</view>
		</view>
		<view class="navbar">
			<view class='navContent'>
				<view class='xxx'>
					<view style="position: absolute; top: 10rpx;left: 20rpx;" @click="toAll()">
						<text style="font-size: 28rpx;margin-right: 5rpx;font-weight: 700;">我的订单</text>
					</view>
					<view style="position: absolute; top: 10rpx;right: 20rpx;" @click="toAll()">
						<text style="font-size: 24rpx;margin-right: 5rpx;color: #adadad;">查看全部</text>
						<u-icon size="20" color="#adadad" name="arrow-right"></u-icon>
					</view>
					<view class="bar" style="width: 33.3%;" v-for="(item,index) in barList" :key="item.id"
						@click="toOrderList(index+1)">
						<view class='bar_view'> <i class="iconfont" :class="item.icon"></i></view>
						<view class="bar_name">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="navbar">
			<view class='navContent'>
				<view class='yyy'>
					<view style="position: absolute; top: 10rpx;left: 20rpx;" @click="toAll()">
						<text style="font-size: 28rpx;margin-right: 5rpx;font-weight: 700;">我的计划</text>
					</view>
					<view style="position: absolute; top: 10rpx;right: 20rpx;" @click="toAll()">
						<text style="font-size: 24rpx;margin-right: 5rpx;color: #adadad;">查看全部</text>
						<u-icon size="20" color="#adadad" name="arrow-right"></u-icon>
					</view>
					<view class="bar" :style="{width:100%planList+'%'}" v-for="(item,index) in planList" :key="item.id"
						@click="toOrderList(index+1)">
						<view class='bar_view'> <i class="iconfont" :class="item.icon"></i></view>
						<view class="bar_name">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="floored">
			<view class="floored_item" v-for="(item,index) in cardList" :key="index" @click="toCard(item,index)">
				<view class="floored_img">
					<i class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
				</view>
				<view class="floored_name">
					<text class="name" :style="{color:item.color}">{{item.name}}</text>
					<i class="iconfont iconarrowRight-copy-copy-copy" style="font-size: 30rpx;"></i>
					<!-- <u-icon size="30" color="black" name="arrow-right"></u-icon> -->
				</view>
			</view>
		</view>
		<view class="floored" style="margin-top: 20rpx;">
			<view class="floored_item" v-for="(item,index) in list" :key="index" @click="toFloored(item,item.index)">
				<view class="floored_view">
					<view class="floored_img">
						<i class="iconfont" :class="item.icon"></i>
					</view>
				</view>
				<view class="floored_name">
					{{item.name}}
					<i class="iconfont iconarrowRight-copy-copy-copy" style="font-size: 30rpx;"></i>
				</view>
			</view>
		</view>
		<u-popup v-model="showPopup" mode="center">
			<image :src="lockImage" class="lock-image"></image>
		</u-popup>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	const prefix = globalData.api;
	export default {
		data() {
			return {
				openId: '', // 微信openid
				register: '', // 是否注册
				userInfo: {}, // 用户信息
				size: "cover",
				is: false,
				usableRoomList: [],
				barList: [{
						name: "未支付",
						icon: 'iconweizhifu',
						index: 1
					},
					{
						name: "已支付",
						icon: 'iconyizhifu',
						index: 2
					},

					{
						name: "已取消",
						icon: "iconyiquxiao",
						index: 4
					}
				],
				planList: [{
						name: "待执行",
						icon: 'icondaizhihangde',
						index: 1
					},
					{
						name: "执行中",
						icon: 'iconziliao',
						index: 2
					},
					{
						name: "已执行",
						icon: "iconyizhihangde",
						index: 3
					},
					{
						name: "已取消",
						icon: "icontubiao-quxiao",
						index: 4
					}
				],
				cardList: [{
					name: '会员卡',
					icon: 'iconhuiyuankax',
					color: '#41cdff',
					num: '0',
				}, {
					name: '积分',
					icon: 'iconziyuan',
					color: '',
					num: '0',
				}, {
					name: '优惠券',
					icon: 'iconquan',
					color: '#ff6f6f',
					num: '0',
				}],
				list: [{
					name:'我的地址',
					icon:'',
					index:0
				},
					/* {
											name: "我的订单",
											icon: "icon-dingdan",
											index: 0
										}, */
					{
						name: "门禁管理",
						icon: "iconmenjin",
						index: 1
					},
					/* {
						name: "会员卡",
						image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/Notice.png') no-repeat",
						index: 2
					}, */
					{
						name: "我的房卡",
						icon: "iconcard-pluck",
						index: 4
					}
					/* ,
										{
											name: "优惠券",
											icon: "icon-youhuiquan",
											index: 3
										} */
				],
				msgNum: 0, // 消息数量
				showPopup: false, // 显示模态框图
				lockImage: '', // 开锁的二维码
				membershipDescription: '', // 会员卡描述
				userPhone: '',
				background: '',
			}
		},
		/* async onLoad() {
			await this.$onLaunched;
			this.register = globalData.register;
			if (!this.register) {
				uni.navigateTo({
					url: '/pages/user/login',
				})
			}
		}, */
		onLoad() {
			if (globalData.register === false) {
				uni.showModal({
					title: '提示',
					content: '用户未注册，请先注册',
					confirmText: '确定',
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '../user/login'
							})
						}
					}
				})
			}
		},
		async onShow() {
			await this.$onLaunched;
			// this.loadUser();
			let openId = this.openId = globalData.openid;
			this.register = globalData.register;
			console.log(globalData);
			// #ifdef MP-WEIXIN
			this.getBackground();
			if (globalData.register) {
				this.getAccount();
				this.getPhone();
				this.getNewInfoCount();
			}
			// #endif

			/////////////////////////////////

			/* this.getLockAuthorizeRoom(); */
			//////////////////////////////////
			// this.getOpenLock();
			// console.log('userInfo', this.userInfo);
			// if (openId) this.getAccount();
		},
		methods: {
			getBackground() {
				let that = this;
				uni.request({
					method: 'POST',
					url: globalData.url3 + '/Config/GetTargetConfig',
					data: {
						target: 'my',
						uid: globalData.uid
					},
					success(res) {
						if (res.data.errCode === 0) {
							that.background = res.data.data.head;
						} else {

						}
					}
				})
			},

			toCard(item, index) {
				if(index===3){
					uni.navigateTo({
						url:'../breakFast/breakFast'
					})
				}
				if (this.register) {
					globalData.powerList.forEach(item2 => {
						if (item2.page === 'my') {
							item2.items.forEach(item3 => {
								if (item3.name === item.name) {
									if (!item3.enable) {
										return uni.showToast({
											title: item3.tip,
											icon: 'none'
										})
									} else if (index === 2) {
										uni.navigateTo({
											url: '../coupon/coupon?phone=' + this.userInfo.phone
										})
									} else if (index === 0) {
										uni.navigateTo({
											url: "../user/vipCard/vipCard"
										})
									}
								}
							})

						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录后操作',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/login'
								})
							}
						}
					})
				}

			},
			xxx() {
				return uni.showToast({
					title: '功能暂未开放',
					icon: 'none'
				})
			},
			/**
			 * 跳转会员卡界面
			 */
			vipNav() {
				uni.navigateTo({
					url: "../user/card"
				})
			},
			toAll() {
				uni.navigateTo({
					url: '../new/new'
				})
				/* uni.navigateTo({
					url: "../user/lease"
				}) */
			},
			/**
			 * 获取会员卡描述
			 */
			getMembershipDescription() {
				const that = this;
				const openId = this.openId;
				const appId = globalData.appid;
				uni.request({ //提交用户信息获取用户id
					url: globalData.api + '/MCM/GetMembershipDescription',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
						clienttype: 1,
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
				if (that.usableRoomList.length === 0) {
					return uni.showModal({
						title: '温馨提示',
						content: '没有授权',
						showCancel: false,
					})
				}
				uni.request({ //提交用户信息获取用户id
					url: globalData.api + '/MCM/OpenLock',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
						clienttype: 1,
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
			getLockAuthorizeRoom() {
				let that = this;
				const name = that.nameVal;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetLockAuthorizeRoom',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype: 1,
					},
					success: function(res) {
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
					url: globalData.publicApi + '/WeChat/GetAccount',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
					},
					success(res) {
						console.log('getAccount', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.userInfo = resData;
							globalData.avatar = resData.avatarUrl;
							globalData.userInfo = resData;
							that.is = true;
						} else {
							that.userInfo = {};
							globalData.userInfo = {};
						}
					}
				})
			},
			getPhone() {
				const that = this;
				const openId = this.openId;
				const appId = globalData.appid;

				uni.request({ //提交用户信息获取用户id
					url: globalData.publicApi + '/WeChat/GetPhone',
					method: 'POST',
					data: {
						appid: appId,
						openid: openId,
					},
					success(res) {
						console.log('getPhone', res);
						if (res.data.errCode == 0) {
							console.log(res.data.data);
							that.userPhone = res.data.data;
							console.log(that.userInfo);
						} else {

						}
					}
				})
			},
			getNewInfoCount() {
				const that = this;
				const openId = this.openId;
				const appId = globalData.appid;
				uni.request({ //提交用户信息获取用户id
					url: globalData.url3 + '/Message/GetMessageCount',
					method: 'POST',
					data: {
						uid: globalData.uid
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
				console.log('点击');
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
						success: function(res) {
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

			toFloored(item, index) {
				console.log(index);
				if (this.register) {
					globalData.powerList.forEach(item2 => {
						console.log(item.name);
						if (item2.page === 'my') {
							item2.items.forEach(item3 => {
								if (item3.name === item.name) {
									if (!item3.enable) {
										return uni.showToast({
											title: item3.tip,
											icon: 'none'
										})
									} else if (index == 3) {
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
									}else if (index == 4) {
										/* this.getOpenLock(); */
										uni.navigateToMiniProgram({
											appId: 'wxf7dd6d6f511d53dc',
											success(res) {
												console.log("打开成功")
											},
											fail(err) {
												uni.showToast({
													title: err,
												})
											}
										})
									}
								}
							})

						}else if(index===0){
							uni.navigateTo({
								url:'../myAddress/myAddress'
							})
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请先登录后操作',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/login'
								})
							}
						}
					})
				}


				/* let temindex = globalData.powerList[0];
				if (temindex === true) {
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
							uni.navigateToMiniProgram({
								appId: 'wxf7dd6d6f511d53dc',
								success(res) {
									console.log("打开成功")
								},
								fail(err) {
									uni.showToast({
										title: err,
									})
								}
							})
						}
					} else {
						uni.showModal({
							title: '提示',
							content: '请先登录后操作',
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '../user/login'
									})
								}
							}
						})
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '功能暂未开放',
					})
				}
 */
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
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/login'
								})
							}
						}
					})
				}



			},
			getVip() {
				console.log("123123")
				uni.showModal({
					title: '提示',
					content: '功能尚未开放',
					showCancel: false,
				})
			},

		}
	}
</script>

<style lang="less" scoped>
	page {
		display: inline-block;
	}

	.top {
		width: 100%;
		height: 250rpx;
		display: flex;
		align-items: center;
		background-repeat: no-repeat;
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
	.vipCard {
		display: flex;
		justify-content: space-between;
		color: white;
		height: 120rpx;
		width: 500rpx;
		background: url(https://img-u-4.51miz.com/preview/element/00/01/05/87/E-1058743-9EBF2547.jpg!/quality/90/unsharp/true/compress/true/format/jpg/fh/320) no-repeat;
		line-height: 60rpx;
		border-radius: 10rpx;
		margin: 0 auto;
		transform: translateY(50%);
	}

	.level {
		margin: 0 20rpx;
	}

	.phone {
		margin-left: 20rpx;
		margin-bottom: 15rpx;
		font-size: 12px;
		color: rgba(242, 242, 242, 1.0);
	}

	.vip {
		display: flex;
		align-items: center;
		color: white;
	}

	.rightIcon {
		margin-left: 80rpx;
	}

	.car-desc {
		margin-top: 10rpx;
		font-size: 23rpx;
		color: rgba(241, 242, 242, 1);
	}

	.xxxxx {
		color: #adadad;
	}

	.email {
		position: absolute;
		right: 30rpx;
		top: 56rpx;
		z-index: 11;
		width: 52rpx;
		height: 42rpx;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/email.png") no-repeat;
		background-size: cover;
	}

	.email>.num {
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
	.navContent {
		display: flex;
		justify-content: center;
		width: 100%;

		.card {
			position: absolute;
			display: flex;
			height: 150rpx;
			width: 90%;
			background: white;
			box-shadow: 2rpx 3rpx 10rpx #8f8f8f;
			border-radius: 15rpx;
			transform: translateY(-120%);
			opacity: 0.9;
			z-index: 1;

			.card-item {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				width: 33.3%;

			}

			.card-detail {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 21rpx;

				.name {
					font-weight: 700;
				}
			}
		}

	}

	.xxx {
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

	.yyy {
		position: absolute;
		align-items: center;
		display: flex;
		justify-content: center;
		height: 200rpx;
		width: 90%;
		background: white;
		box-shadow: 2rpx 3rpx 10rpx #8f8f8f;
		border-radius: 15rpx;
		transform: translateY(-160rpx);
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
		display: flex;
		align-items: center;
		justify-content: center;
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
		transform: translateY(-300rpx);
	}

	.floored_item {
		display: flex;
		padding: 0 30rpx;
		align-items: center;
		width: 100%;

	}

	.floored_img {}

	/* 	.floored_item:nth-of-type(2n-1) .floored_img {
		margin-left: 129rpx;
	} */

	.floored_name {
		display: flex;
		justify-content: space-between;
		margin: 0 20rpx;
		padding: 30rpx;
		width: 100%;
		width: 100%;
		font-size: 16px;
		border-bottom: 1rpx solid #f5f5f5;
	}
	.lock-image {
		width: 500rpx;
		height: 500rpx;
	}
</style>

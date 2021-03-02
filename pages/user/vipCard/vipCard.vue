<template>
	<view class="container">
		<!-- 卡详情 -->
		<view class="card">
			<!-- 卡上内容 -->
			<view class="card-info">
				<!-- 用户卡类型板块 -->
				<view class="user">
					<image class="logo" :src="avatar"></image>
					<view class="brand">
						<view class="user-name" :style="{color:currentColor}">{{cardInfo.name}}</view>
						<view class="card-type" :style="{color:currentColor}">{{cardInfo.card_name}}</view>
					</view>
				</view>
				<!-- 卡号 -->
				<!-- <view class="card-no">
					No.{{cardInfo.id}}
				</view> -->
			</view>
			<!-- 卡操作：余额和积分 -->
			<view class="card-oper">
				<!-- 卡余额 -->
				<view class="card-oper-item" @click="toSurplus">
					<view class="title">余额</view>
					<view class="number">{{cardInfo.money}}</view>
				</view>
				<!-- 卡积分 -->
				<view class="card-oper-item" @click="toRecord(2,0,'积分明细')">
					<view class="title">积分</view>
					<view class="number">{{cardInfo.score}}</view>
				</view>
			</view>
		</view>
		<!-- 功能列表 -->
		<scroll-view flex scroll-y class="card-box"  @scrolltolower="refresh">
			<view class="vipCard" v-for="(item,index) in payList" :key="index" @click="toDetail(item.id)">
				<view class="vip-type" :style="{color:currentColor}">
					{{item.type_name}}
				</view>
				<view class="vip-no" :style="{color:currentColor}">
					NO.{{item.id}}
				</view>
			</view>
			
		</scroll-view>
	</view>

</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	const globalData = getApp().globalData;
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				cardInfo: [], // 会员卡信息
				avatar: '',
				show: false,
				action: 'http://121.4.13.106/images',
				payShow: false,
				amount: 0,
				id: '',
				name: '',
				list: [],
				val: {},
				payvalue: '白金卡',
				payList: [],
				index: 0,
				cardList:[],
				currentColor:'',
			}
		},

		onLoad(options) {
			this.avatar = globalData.avatar;
			this.getMembershipCard();
			/* this.getPayMsg(); */
			/* this.getCards(); */
		},

		methods: {
			openPay() {

			},
			closePay() {
				this.payShow = false;
				this.index = 0;
				this.$refs.qrcode._clearCode();
			},
			payChange(index) {
				/* this.$refs.qrcode._clearCode(); */
				this.val = this.payList[index].id;
				this.index = index;
				/* 				console.log(this.val);
								this.$refs.qrcode._makeCode(); */
			},
			confirmPay() {
				this.payShow = false;
				/* this.val={}; */
				this.$refs.qrcode._clearCode();
			},
			async pay() {
				await this.getPayMsg();
				this.payShow = true;
				this.$refs.qrcode._makeCode()
			},
			refresh(){
				console.log('刷新')
			},
			qrR() {
				console.log('123');
			},
			getQrCode() {

			},
			async getPayMsg() {
				let [err, res] = await uni.request({
					url: globalData.api + '/MCM/GetMembershipPay',
					method: 'post',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype: 1,
						uid: globalData.uid
					}
				})
				console.log('/MCM/GetMembershipPay');
				console.log(res);
				if (res.data.errCode === 0) {
					let resData = res.data.data;
					this.payList = resData;
					this.payList.forEach(item => {
						item.amount = parseInt(item.amount).toFixed(2);
					})
					this.payvalue = this.payList[0].name;
					this.val = this.payList[0].id;
				} else {
					uni.showToast({
						title: res.data.errMsg,
						icon: 'none'
					})
				}
			},
			/*充值*/
			recharge() {
				uni.navigateTo({
					url: '../recharge/recharge'
				})
			},
			toDetail(id){
				uni.navigateTo({
					url: `./cardDetail/cardDetail?id=${id}`
				})
			},
			/*人脸识别健身通道*/
			authenticate() {
				this.show = true;
			},
			modelConfirm() {
				console.log('123');
			},
			onFrontChange() {
				console.log('修改图片')
			},
			onFrontRemove() {
				console.log("删除图片")
			},
			
			toRecord(source, direction, title) {
				if (source === 2 && direction === 3) {
					if (this.cardInfo.score === 0) {
						return uni.showToast({
							title: '无可兑换积分',
							icon: "none"
						})
					}
					return;
				}
				uni.navigateTo({
					url: `./cardDetail?source=${source}&direction=${direction}&title=${title}`
				})
			},
			toSurplus() {
				uni.navigateTo({
					url: `./cardDetail?source=1&direction=0&money=${this.cardInfo.money}&title=会员卡金额明细`
				})
			},
			/**
			 * 获取会员卡信息
			 */
			getMembershipCard() {
				let that = this;
				uni.request({ //提交用户信息获取用户id
					url: globalData.api + '/MCM/GetMembershipCard',
					method: 'post',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype: 1,
						uid: globalData.uid
					},
					success(res) {
						console.log('getMembershipCard', res);
						if (res.data.errCode == 0) {
							let resData = res.data.data;
							that.cardInfo = resData;
							that.cardInfo.money = resData.money.toFixed(2);
							that.payList=resData.data;
							console.log(that.cardInfo.money);
						} else {
							uni.showLoading({
								title: res.data.errMsg,
								icon: 'none',
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	
	::v-deep .u-radio-group {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.qrcode {
		margin: 30rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.detail-list {
		margin-top: 40rpx;

		.record {
			display: flex;
			/* 			border:1px solid red; */
			flex-direction: column;
			margin-bottom: 40rpx;

			.header {
				.title {
					width: 150rpx;
				}

				display: flex;
				align-items: center;

				.line {
					height: 1px;
					width: 600rpx;
					background: #CCC;
				}
			}

			.record-list {
				display: flex;
				flex-wrap: wrap;

				.record-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					height: 150rpx;
					justify-content: center;
					width: 33%;

				}
			}
		}
	}

	.container {
		padding: 20rpx;
	}

	.card {
		margin: 0 auto;
		width: 680rpx;
	}

	.card-detail {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.card-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 39rpx;
		width: inherit;
		height: 160rpx;
		margin-top: 20rpx;
		/* background-color: #121212; */
		background: url('https://s3.ax1x.com/2021/03/02/6FwGfx.jpg');
		/* background-image:linear-gradient(to right, #ceb074, #d0a167); */
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 20rpx;
		color: #fff;
		>.user {
			display: flex;
			align-items: center;

			>.logo {
				display: block;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #fff;
			}

			>.brand {
				margin-left: 20rpx;

				>.user-name {
					font-size: 34rpx;
					font-weight: 700;
				}

				>.card-type {
					margin-top: 10rpx;
				}
			}
		}
	}

	.card-oper {
		display: flex;
		justify-content: space-around;
		margin-top: 20rpx;

		>.card-oper-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 350rpx;

			&:first-child {
				border-right: 1px solid #ccc;
			}

			>.title {
				font-size: 26rpx;
			}

			>.number {
				margin-top: 10rpx;
				font-size: 36rpx;
				color: #6B7DAD;
			}
		}
	}

	.fun {
		margin-top: 20rpx;
		border-top: 4px solid #ddd;

		>.fun-item {
			display: flex;
			align-items: center;
			height: 120rpx;
			line-height: 100rpx;
			border-bottom: 1px solid #ddd;

			.iconfont {
				margin-right: 20rpx;
			}
		}
	}

	.id-item {
		margin-top: 10px;

		&:last-child {}

		>.id-item-title {
			display: block;
			margin: 20rpx auto 0;
			font-size: 26rpx;
			text-align: center;
		}
	}
	.card-box{
		border-radius: 15rpx;
		margin-top: 50rpx;
		background-color: white;
		height: 900rpx;
		padding-top: 20rpx;
		.vipCard{
			border-radius: 15rpx;
			height: 288rpx;
			margin: 19.5rpx;
			color: white;
			padding: 19.5rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			background:url('https://s3.ax1x.com/2021/03/02/6F0C36.jpg');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			/* background-image: linear-gradient(to right, #ceb074, #d0a167); */
			.vip-type{
				font-size: 32rpx;
				font-weight: 700;
			}
		}
		.vipCard:first-child{
			margin-top: 0;
		}
	}
</style>

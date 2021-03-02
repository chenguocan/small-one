<template>
	<view class="container">
		<!-- 卡详情 -->
		<view class="card">
			<!-- 卡上内容 -->
			<view class="card-info">
				<!-- 用户卡类型板块 -->
				<view class="user">
					<view class="detail">
						<image class="logo" :src="avatar"></image>
						<view class="brand">
							<view class="user-name">{{cardInfo.name}}</view>
							<!-- <view class="card-type">{{cardInfo.card_name}}</view> -->
						</view>
					</view>
					<view class="more">
						<u-icon name="info-circle"  size="36"></u-icon>
					</view>
				</view>
				<!-- 卡号 -->
				<view class="card-no">
					No.{{cardInfo.id}}
				</view>
			</view>
			<!-- 卡操作：余额和积分 -->
			<view class="card-oper">
				<!-- 卡余额 -->
				<view class="card-oper-item" @click="toSurplus">
					<view class="title">余额</view>
					<view class="number">{{cardInfo.amount}}</view>
				</view>
				<!-- 卡积分 -->
				<view class="card-oper-item" @click="toRecord(2,0,'积分明细')">
					<view class="title">积分</view>
					<view class="number">{{cardInfo.score || 0}}</view>
				</view>
			</view>
		</view>
		<!-- 功能列表 -->
		<view class="detail-list">
			<view class="record">
				<view class="header">
					<text class="title">费用管理</text>
					<view class="line"></view>
				</view>
				<view class="record-list">
					<view class="record-item" @click="pay()">
						<i class="iconfont icon-icon_erweima"></i>
						支付
					</view>
					<view class="record-item" @click="recharge()">
						<i class="iconfont icon-huiyuankachongzhi"></i>
						充值
					</view>
					<view class="record-item" @click="toRecord(1,-1,'充值记录')">
						<i class="iconfont icon-chongzhijiluicon"></i>
						充值记录
					</view>
					<view class="record-item" @click="toRecord(1,1,'消费记录')">
						<i class="iconfont icon-diban-"></i>
						消费记录
					</view>
					<view class="record-item" @click="toRecord(3,0,'次卡明细')">
						<i class="iconfont icon-wodecishuqia"></i>
						次卡明细
					</view>
					<view class="record-item" @click="toRecord(4,0,'无限卡明细')">
						<i class="iconfont icon-nianqia"></i>
						无限卡明细
					</view>
				</view>
			</view>


			<view class="record">
				<view class="header">
					<text class="title">积分管理</text>
					<view class="line">

					</view>
				</view>
				<view class="record-list">
					<view class="record-item" @click="toRecord(2,3,'积分商城')">
						<i class="iconfont icon-jifenduihuan"></i>
						积分商城
					</view>
					<view class="record-item" @click="toRecord(2,-1,'变动明细')">
						<i class="iconfont icon-jifenbiandong"></i>
						变动明细
					</view>

					<view class="record-item" @click="toRecord(2,1,'兑换明细')">
						<i class="iconfont icon-jifen_jifenmingxi"></i>
						兑换明细
					</view>
				</view>
			</view>
			<view class="fun">
				<!-- <view class="fun-item">
					<i class="iconfont icon-icon_erweima"></i>
					支付二维码
				</view> -->
				<view class="fun-item" @click="authenticate">
					<i class="iconfont icon-renlianshibie"></i>
					人脸识别健身通道
				</view>
			</view>

			<u-modal v-model="show" title="人脸识别健身通道" :show-cancel-button="true" @confirm="modelConfirm">
				<view class="slot-content">
					<view class="id-item">
						<u-upload ref="front" :action="action" :multiple="false" :show-progress="false" :show-tips="false" :auto-upload="true"
						 @on-remove="onFrontRemove" @on-change="onFrontChange" max-count="1"></u-upload>
						<text class="id-item-title">1. 上传照片</text>
					</view>
					<!-- <view class="id-item">
						<u-upload ref="reverse" :action="action" :multiple="false" :show-progress="false" :show-tips="false" :auto-upload="true" @on-remove="onReverseRemove" @on-change="onReverseChange" max-count="1"></u-upload>
						<text class="id-item-title">2. 上传身份证反面</text>
					</view> -->
				</view>
			</u-modal>
			<u-popup mode="center" v-if="isdestory===true" border-radius="10" :closeable="true" width="80%" height="50%" v-model="payShow" @close="closePay">
				<!-- <view style="width: 400rpx;">
					<u-tabs :list="tablist" :is-scroll="false" :current="current" @change="tabchange"></u-tabs>
				</view> -->
				<view class="card-detail">
	
					<!-- <u-radio-group class="pay-radio" v-model="payvalue">
						<u-radio @change="payChange(index)" v-for="(item, index) in payList" :key="index" :name="item.name">
							{{item.name}}
						</u-radio>
					</u-radio-group> -->
					<tki-qrcode ref="qrcode" :val="val" size="300" :onval="true" @result="qrR" class="qrcode">
					</tki-qrcode>
					<view class="card-msg">
						<view>
							卡号:{{payList.id || ''}}
						</view>
						<view>
							余额:{{payList.amount || '0'}}
						</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import vtabs from "@/components/v-tabs/v-tabs.vue"
	const globalData = getApp().globalData;
	export default {
		components: {
			tkiQrcode,
			vtabs
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
				payList: {},
				index: 0,
				tablist: [],
				current: 0,
				isdestory:false,
				currentId:'',
			}
		},

		onLoad(options) {
			this.currentId=options.id;
			this.avatar = globalData.avatar;
			/* this.getMembershipCard(); */
			this.getPayMsg()
		},

		methods: {
			tabchange(index) {
				this.val = this.payList[index].id;
				this.index = index;
			},
			openPay() {

			},
			closePay() {
				this.isdestory=false;
				this.payShow = false;
				this.index = 0;
				this.current=0;
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
				this.isdestory=true;
				this.payShow = true;
				await this.getPayMsg();
				this.$refs.qrcode._makeCode()
			},
			qrR() {
				console.log('123');
			},
			getQrCode() {

			},
			async getPayMsg() {
				let that=this;
				let [err, res] = await uni.request({
					url: globalData.api + '/MCM/GetMembershipPay',
					method: 'post',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype: 1,
						uid: globalData.uid,
						id:this.currentId
					}
				})
				console.log('/MCM/GetMembershipPay');
				console.log(res);
				if (res.data.errCode === 0) {
					let resData = res.data.data[0];
					that.cardInfo = resData;
					that.cardInfo.amount = resData.amount.toFixed(2);
					that.payList=that.cardInfo
					console.log(that.cardInfo);
					/* let resData = res.data.data;
					let list=[];
					this.payList = resData;
					this.payList.forEach(item => {
						list.push(item.name);
						item.amount = parseInt(item.amount).toFixed(2);
					})
					this.tablist=list;
					console.log(list);
					this.payvalue = this.payList[0].name;
					this.val = this.payList[0].id; */
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
					url: '../../../recharge/recharge'
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
					url: `../../cardDetail?id=${this.currentId}&source=${source}&direction=${direction}&title=${title}`
				})
			},
			toSurplus() {
				uni.navigateTo({
					url: `../../cardDetail?source=1&direction=0&money=${this.cardInfo.money}&title=会员卡金额明细`
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
						uid: globalData.uid,
					},
					success(res) {
						console.log('getMembershipCard', res);
						if (res.data.errCode == 0) {
							let resData = res.data.data;
							that.cardInfo = resData;
							that.cardInfo.money = resData.money.toFixed(2);
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
		margin-top: 13rpx;
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
		justify-content: space-between;
		padding: 33rpx;
		width: inherit;
		height: 432rpx;
		/* background-color: #121212; */
		background: url("https://s3.ax1x.com/2021/03/02/6FwfBQ.jpg");
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 20rpx;
		color: #fff;

		>.user {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.detail {
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

			.more {
				margin-right: -30rpx;
				padding: 5rpx 10rpx 5rpx 30rpx;
				font-size: 24rpx;
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
</style>

<template>
	<view class="container">
		<!-- 卡详情 -->
		<view class="card">
			<!-- 卡上内容 -->
			<view class="card-info">
				<!-- 用户卡类型板块 -->
				<view class="user">
					<image class="logo" ></image>
					<view class="brand">
						<view class="user-name">{{cardInfo.name}}</view>
						<view class="card-type">{{cardInfo.card_name}}</view>
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
				<view class="card-oper-item">
					<view class="title">余额</view>
					<view class="number">{{cardInfo.money}}</view>
				</view>
				<!-- 卡积分 -->
				<view class="card-oper-item">
					<view class="title">积分</view>
					<view class="number">{{cardInfo.point}}</view>
				</view>
			</view>
		</view>
		<!-- 功能列表 -->
		<view class="fun">
			<navigator url="./cardDetail?source=1" hover-class="none" class="fun-item">查看余额消费情况</navigator>
			<navigator url="./cardDetail?source=2" hover-class="none" class="fun-item">查看积分情况</navigator>
		</view>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				cardInfo: [], // 会员卡信息
			}
		},
		
		onLoad() {
			this.getMembershipCard();
		},
		
		methods: {
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
						clienttype:1
					},
					success(res) {
						console.log('getMembershipCard', res);
						if (res.data.errCode == 0) {
							let resData = res.data.data;
							that.cardInfo = resData;
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
	.container {
		padding: 20rpx;
	}
	.card {
		margin: 0 auto;
		width: 680rpx;
	}
	.card-info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 30rpx;
		width: inherit;
		height: 400rpx;
		background-color: #121212;
		border-radius: 20rpx;
		color: #fff;
		> .user {
			display: flex;
			align-items: center;
			> .logo {
				display: block;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #fff;
			}
			> .brand {
				margin-left: 20rpx;
				> .user-name {
					font-size: 34rpx;
					font-weight: 700;
				}
				> .card-type {
					margin-top: 10rpx;
				}
			}
		}
	}
	.card-oper {
		display: flex;
		justify-content: space-around;
		margin-top: 20rpx;
		> .card-oper-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 350rpx;
			&:first-child {
				border-right: 1px solid #ccc;
			}
			> .title {
				font-size: 26rpx;
			}
			> .number {
				margin-top: 10rpx;
				font-size: 36rpx;
				color: #6B7DAD;
			}
		}
	}
	.fun {
		margin-top: 20rpx;
		border-top: 1px solid #ddd;
		> .fun-item {
			height: 100rpx;
			line-height: 100rpx;
			border-bottom: 1px solid #ddd;
		}
	}
</style>

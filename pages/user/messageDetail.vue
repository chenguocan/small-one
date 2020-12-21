<template>
	<view class="container">
		<!-- 标题部分 -->
		<view class="title">
			<view class="title-body">
				{{info.title}}
			</view>
			<view class="time">
				<view class="time-body">
					{{info.datetime}}
				</view>
				<view v-if="info.type == 1" class="pay" @click="intoPay(info.parameter)">去支付</view>
			</view>
		</view>
		<!-- 内容部分 -->
		<view class="content">
			<rich-text class="rich-text" :nodes="nodes" space="nbsp"></rich-text>
		</view>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				id: '', // 消息id
				info: [], // 信息详情
				nodes: '', // 富文本框内容
			}
		},
		
		onLoad(options) {
			this.id = options.id;
			this.getInfo();
		},
		
		methods: {
			/**
			 * 去支付
			 */
			intoPay(orderId) {
				if (!orderId) {
					uni.showToast({
						title: '订单id不能为空',
						icon: 'none'
					})
					return false;
				}
				uni.request({
				  	method: 'POST',
				  	url: globalData.api + '/wx/pay',
				  	data: {
				  		appid: globalData.appid,
				  		openid: globalData.openid,
				  		out_trade_no: orderId,
						clienttype:1
				  	},
				  	success: function (res) {
				  		if (res.data.errCode == 0) {
				  			const resData = res.data.data;
							wx.requestPayment({
							   timeStamp: resData.timeStamp,
							   nonceStr: resData.nonceStr,
							   package: resData.package,
							   signType: resData.signType,
							   paySign: resData.paySign,
							   success (res) {
								   uni.showToast({
								   	title: '缴费成功',
								   	icon: 'none'
								   })
							   }
							})
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
			 * 获取消息详情
			 */
			getInfo() {
				let that = this;
				let id = this.id;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetInfo',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						id: id
					},
					success: function (res) {
						console.log('getInfo', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.info = resData;
							that.nodes = resData.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
							that.setInfoState();
						}
					}
				})
			},
			
			/**
			 * 设置信息状态
			 */
			setInfoState() {
				const that = this;
				const id = this.id;
				const state = 1;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/SetInfoState',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						id: id,
						state: state
					},
					success: function (res) {
						console.log('SetInfoState', res);
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		padding: 30rpx;
		background-color: #fff;
		min-height: 100vh;
	}
	.title {
		padding-bottom: 30rpx;
		border-bottom: 1px solid #ccc;
		> .title-body {
			font-size: 36rpx;
			font-weight: 700;
		}
		> .time {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10rpx;
			> .time-body {
				font-size: 26rpx;
				color: #808080;
			}
			> .pay {
				width: 120rpx;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 24rpx;
				color: #fff;
				text-align: center;
				background-color: #007AFF;
				border-radius: 40rpx;
			}
		}
	}
	.content {
		padding-top: 20rpx;
	}
</style>

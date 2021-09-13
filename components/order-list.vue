<template>
	<view class="order-list">
		<view class="order-item" v-for="(item,index) in 6" :key="index">
			<view class="header">
				<view class="left">
					<text class="order-hotel">厦门君泰酒店</text>
					<text class="order-num">订单编号:ABCDEFGHIJKLMN</text>
				</view>
				<view class="right">
					<text class="state">已完成</text>
				</view>
			</view>

			<view class="order-detail">
				<view class="foods">
					188套餐*1，288套餐*2
				</view>
				<view class="info">
					<view class="order-time">{{time}}</view>
					<view class="order-num">共2件商品,实付￥50.00</view>
				</view>
				<view class="order-btn">
					<view class="detail-btn" @click="toDetail">查看</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from "dayjs"
	export default {
		name: "order-list",
		data() {
			return {
				time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			};
		},
		created() {
			console.log(dayjs().format('YYYY-MM-DD hh:ss:mm'))
		},
		methods:{
			toDetail(){
				uni.navigateTo({
					url:'/pages/orders/detail'
				})
			}
		}
	}
</script>

<style lang="scss">
	.order-list {
		padding: 15rpx;

		.order-item {
			margin-bottom: 30rpx;
			.header {
				display: flex;
				background: white;
				height: 125rpx;
				padding: 20rpx;
				overflow: hidden;

				.left {
					width: 490rpx;
					display: flex;
					flex-direction: column;

					.order-num {
						color: #91a0c0;
						font-size: 24rpx;
					}

					.order-hotel,
					.order-num {
						height: 47rpx;
						line-height: 47rpx;
					}
				}

				.right {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					width: 190rpx;

					.state {
						color: #a68a41;
					}
				}
			}

			.order-detail {
				margin-top: 1px;
				height: 200rpx;
				background: white;
				display: flex;
				flex-direction: column;
				padding: 20rpx;

				.foods {}

				.info {
					display: flex;
					color: #91a0c0;
					font-size: 24rpx;
					margin: 10rpx 0;

					.order-time {
						width: 400rpx;
					}

					.order-num {
						color: black;
					}
				}
			}

			.order-btn {
				display: flex;
				justify-content: flex-end;

				.detail-btn {
					width: 150rpx;
					height: 50rpx;
					border: 1px solid #a68a41;
					border-radius: 5rpx;
					color: #a68a41;
					text-align: center;
					line-height: 50rpx;
				}
			}
		}
	}
</style>

<template>
	<view class="detail-item">
		<view class="header">
			<view class="shop">厦门君泰酒店</view>
		</view>
		<view class="food-list">
			<detail-radius top="false"></detail-radius>
			<view class="food-item">
				<view class="name">188套餐</view>
				<view class="num">×1</view>
				<view class="pay">￥28.00</view>
			</view>
		</view>
		<view class="list">
			<detail-radius></detail-radius>
			<view class="item">
				<view class="name">支付方式</view>
				<view class="content">微信支付</view>
			</view>
			<view class="item">
				<view class="name">金额总计</view>
				<view class="content">￥28.00</view>
			</view>
		</view>
		
		<view class="list">
			<detail-radius :bottom="false"></detail-radius>
			<view class="item">
				<view class="name">取单号</view>
				<view class="content">A8080</view>
			</view>
			<view class="item">
				<view class="name">享用方式</view>
				<view class="content">自取</view>
			</view>
			<view class="item">
				<view class="name">取餐时间</view>
				<view class="content">{{time}}</view>
			</view>
			<view class="item">
				<view class="name">备注</view>
				<view class="content">加辣</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from "dayjs"
	import detailRadius from "@/components/detail-radius.vue"
	export default {
		components:{
			detailRadius
		},
		data() {
			return {
				time:dayjs().format('YYYY-MM-DD HH:mm:ss')
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.detail-item{
	padding: 15rpx;
	color: #5a5b5c;
	.header{
		display: flex;
		align-items: center;
		overflow: hidden;
		padding: 20rpx;
		height: 80rpx;
		background-color: white;
	}
	.food-list{
		margin-top: 1px;
		background-color: white;
		padding: 20rpx;
		position: relative;
		.food-item{
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			justify-content: space-between;
			.name{
				flex-grow: 2;
			}
			.num{
				flex-grow: 1;
			}
			.pay{
				color: #5a5b5c;
				font-weight: 700;
			}
		}
	}
	.list{
		margin-top: 1px;
		position: relative;
		padding: 20rpx;
		background-color: white;
		.item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80rpx;
			.content{
				font-weight: 700;
			}
		}
	}
}
</style>

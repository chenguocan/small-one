<template>
	<view>
		<view>
			<swiper class="swiper-banner" indicator-dots>
				<swiper-item  v-for="(item,index) in bannerList" :key="index">
					<image class="banner" :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="shop">
			<view class="shop-list" v-for="item in 1" :key="item" @click="xxx">
				<view class="medicine-bg">
					<image class="medicine-img" src="../../static/images/food.jpg"></image>
				</view>
				<view class="detail">
					<view class="characteristic">
						<view class="char-list">
							美味
						</view>
						<view class="char-list">
							特价
						</view>
					</view>
					<view class="medicine-name">
						新派素食自助餐券*10张
					</view>
					<view class="medicine-price">
						￥688
					</view>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	const globalData=getApp().globalData;
	export default {
		data() {
			return {
				value: '',
				type: 'text',
				bannerList:['../../static/images/banner1.jpg','../../static/images/banner2.jpg','../../static/images/banner3.jpg'],
			}
		},
		onLoad(){
			let temindex=globalData.powerList[0];
			if(temindex===true){
				
			}else{
				uni.showToast({
					icon:'none',
					title:'功能暂未开放',
				})
			}
		},
		methods: {
			xxx(){
				return uni.showToast({
					icon:'none',
					title:'功能暂未开放',
				})
			}
		}
	}
</script>

<style lang="scss">
.header{
	height: 170rpx;
	background-color: white;
	display: flex;
	justify-content: center;
	position: relative;
	.search{
		padding: 0 70rpx;
		background: white;
		display: flex;
		align-items: center;
		align-self: flex-end;
		margin-bottom: 35rpx;
		border-radius: 8rpx;
		width: 520rpx;
		height: 60rpx;
	}
	.scan{
		position: absolute;
		bottom:35rpx;
		right: 30rpx;
	}
}
.banner{
	width: 100%;
	height: 300rpx;
}
.swiper-banner{
	width: 100%;
	height: 300rpx;
}
.shop{
	margin: 20rpx;
	display: flex;
	flex-wrap: wrap;
	.shop-list{
		width: 340rpx;
		height: 500rpx;
		margin-bottom: 20rpx;
		background-color: white;
		border-radius: 10rpx;
		.medicine-bg{
			height: 340rpx;
			background: #eeeeee;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.medicine-img{
				height: 350rpx;
				width: 340rpx;
			}
		}
		.detail{
			display: flex;
			flex-direction: column;
			.medicine-name{
				
			}
			.medicine-price{
				color:#8a2929;
				font-weight: 700;
			}
			.characteristic{
				display: flex;
				margin-top: 10rpx;
				margin-bottom: 15rpx;
				.char-list{
					text-align: center;
					width: 80rpx;
					height: 40rpx;
					border-radius: 5rpx;
					background: #e5e813;
					color:white;
					margin-right: 10rpx;
				}
			}
		}
		
	}
}
.shop-list:nth-child(odd){
	margin-right: 28rpx;
}
</style>

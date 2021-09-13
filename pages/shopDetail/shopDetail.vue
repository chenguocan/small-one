<template>
	<view :style="{height:pageHeight+'px'}" style="position: relative;">
		<view class="swiper-box">
			<view style="height: 400rpx;width: 100%;" >
				<image style="height: 400rpx;width: 100%;"  :src="shopInfo.sub_image" ></image>
			</view>
			<!-- <swiper style="height: 400rpx;width: 100%;" circular="true" autoplay="true">	
				<swiper-item v-for="(item,index) in imageList" :key="index">
					<image style="height: 400rpx;width: 100%;"  :src="item.img" ></image>
				</swiper-item>
			</swiper> -->
		</view>
		<view class="shop-detail">
			<view><text class="title">{{shopInfo.title}}</text><text class="sub-title">{{shopInfo.sub_title}}</text></view>
			<view class="cost">￥{{(shopInfo.discount_price/100).toFixed(2)}}</view>
			<view class="introduce">
				简介:
			</view>
		</view>
		<view class="num">
			<view style="font-weight: 700;margin-right: 20rpx;">数量:</view>
			<u-number-box v-model="number" ></u-number-box>
		</view>
		<view class="add">
			<view class="btn">
				<!-- <u-button shape="circle" size="medium"  class="addGoods" type="warning" style="margin-right:10rpx;">加入购物车</u-button> -->
				<u-button shape="circle" size="medium" class="buy" type="success" style="margin-right:30rpx;" v-if="shopInfo.type===4">{{shopInfo.type_name}}</u-button>
				<u-button shape="circle" size="medium" class="buy" type="success" style="margin-right:30rpx;" v-else>{{shopInfo.type_name}}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	const globalData=getApp().globalData;
	const prefix=getApp().globalData.url3;
	export default {
		data() {
			return {
				imageList:[{
					img:"http://121.37.210.175:8001/image/wxc469315ccc0dee04/1a823f9e68facf05.jpg"
				},{
					img:"http://121.37.210.175:8001/image/wxc469315ccc0dee04/821e9259dd7f1039.jpg"
				},{
					img:"http://121.37.210.175:8001/image/wxc469315ccc0dee04/821e9259dd7f1039.jpg"
				}],
				pageHeight:1000,
				shopInfo:{},
				number:1,
			}
		},
		async onLoad(options) {
			
			let that=this;
			console.log(options);
			uni.getSystemInfo({
				success:function(res){
					that.pageHeight=res.windowHeight;
				}
			})
			this.getShopDetail(options.id);
		},
		methods: {
			getShopDetail(id){
				let that=this;
				console.log('goodsid');
				console.log(id);
				uni.request({
					method:'POST',
					url:prefix+'/EShop/GetGoods',
					data:{
						uid:globalData.uid,
						id,
					},
					success(res) {
						console.log(res);
						if(res.data.errCode===0){
							that.shopInfo=res.data.data;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.shop-detail{
	background-color: white;
	padding: 20rpx;
	.title{
		font-size: 32rpx;
		font-weight: 700;
		margin-right: 15rpx;
	}
	.sub-title{
		font-size: 24rpx;
		color: #c6c6c6;
	}
	.cost{
		font-size: 40rpx;
		font-weight: 700;
		color: #F49C2E;
	
	}
	.introduce{
		font-weight: 700;
	}
}
.swiper-box{
	width: 100%;
	height: 400rpx;
}
.add{
	background-color: white;
	position: absolute;
	bottom:0;
	height: 130rpx;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	.btn{
		
	}
}
.num{
		bottom:135rpx;
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: white;
		padding: 20rpx 0;
	}
</style>

<template>
	<view>
		<view>
			<uni-search-bar :radius="100" placeholder="请输入商品名称"  ></uni-search-bar>
			<!-- <u-search bg-color="#ffffff" placeholder="搜索" v-model="searchShop"></u-search> -->
			<!-- <swiper class="swiper-banner" indicator-dots>
				<swiper-item  v-for="(item,index) in bannerList" :key="index">
					<image class="banner" :src="item"></image>
				</swiper-item>
			</swiper> -->
		</view>
		<view class="shop">
			<view class="shop-list" v-for="item in shopList" :key="item.id" @click="getDetail(item.id)" >
				<view class="medicine-bg">
					<image class="medicine-img" :src="item.sub_image"></image>
				</view>
				<view class="detail">
					<view class="characteristic">
						<view class="char-list">
							{{item.type_name}}
						</view>
					</view>
					<view class="medicine-name">
						{{item.title}}
					</view>
					<view class="medicine-price">
						￥{{(item.discount_price/100).toFixed(2)}}
					</view>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	import uniSearchBar from "../../components/uni-search-bar/uni-search-bar";
	const globalData=getApp().globalData;
	const prefix=getApp().globalData.url3;
	export default {
		components:{
			uniSearchBar
		},
		data() {
			return {
				searchShop:'',
				value: '',
				type: 'text',
				bannerList:['../../static/images/banner1.jpg','../../static/images/banner2.jpg','../../static/images/banner3.jpg'],
				shopList:[],
			}
		},
		onLoad(){
			globalData.powerList.forEach(item=>{
				
				if(item.page==='shop' && !item.enable){
					uni.showToast({
						title:item.tip,
						icon:'none'
					})
				}
			})
			this.goodsList();
		},
		methods: {
			getDetail(id){
				uni.navigateTo({
					url:'../shopDetail/shopDetail?id='+id
				})
			},
			goodsList(){
				let that=this;
				uni.request({
					method:'POST',
					url:prefix+'/EShop/GetGoodsList',
					data:{
						uid:globalData.uid
					},
					success(res) {
						if(res.data.errCode===0){
							that.shopList=res.data.data;
						}
					}
				})
			},
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

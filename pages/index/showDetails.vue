<template>
	<view class="container">
		<!-- 轮播图 -->
		<swiper class="banner" indicator-dots="true" autoplay circular interval="3000" current="0">
			<swiper-item v-for="(item, index) in bannerList" :key="index" >
					<image :src="item" ></image>
			</swiper-item>
		</swiper>
		<!-- 标题 -->
		<view class="title">
			<view class="showData">
				<view class="father-title">{{showData.title}}</view>
				<view class="sub-title">
					<p>{{showData.subtitle}}</p> 
				</view>
			</view>
			<view class='handle'>
				<button class="advance" size="mini"	@click="advance"><span class='btn'>预定</span></button>
				<view class='price-box'>
					<p class='price' v-if="showData.si<=6">￥{{showData ? showData.price:'' }}元/{{showData ? circle[showData.si] :'' }}</p>
					<p class='price' v-else>￥{{showData.price}}元/{{showData.si}}天</p>
				</view>
			</view>

		</view>
		<!-- 富文本内容 -->
		<view class="content">
			<view class="content-title">客房信息</view>
			<scroll-view class='scroll' scroll-y="true">
				<rich-text class="content-body" :nodes="nodes" space="nbsp">
				</rich-text>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				id: 0,
				bannerList: [], // 轮播图列表
				showData: [], // 数据
				nodes: '', // 富文本框的内容
				circle:['','时','天','周','月','季','年']
			}
		},
		
		onLoad(options) {
			console.log('options', options)
			this.id = options.id;
			this.getShow();
		},
		
		methods: {
			/**
			 * 根据id获取工位展示详情
			 */
			getShow() {
				let that = this;
				let id = this.id;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCH/GetShow',
					data: {
						appid: globalData.appid,
						id: id,
						openid:globalData.openid,
						clienttype:1
					},
					success: function (res) {
						console.log('getShow', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							const banner= resData.banner;
							console.log(banner);
							let bannerList = [];
							for (let index in banner) {
								bannerList[index] = banner[index];
							}
							that.showData = resData;
							that.showData.price=(resData.price/100).toFixed(2);
							that.nodes = resData.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
							that.bannerList = banner;
						}
					}
				})
			},
			advance(){
				uni.setStorageSync("currentIndex",this.showData.count);
				uni.switchTab({
					url:'/pages/tabBar/search',
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	button::after{
		border: none;
	}
	.banner {
		width: 100%;
		height: 373rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.handle{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		position: relative;
		.price-box{
			.price{
				color:red;

			}
		}
		.advance{
			display: flex;
			height: 70rpx;
			font-size: 10px;
			border-radius: 50%;
			align-items: center;
			margin-right: 10rpx;
			outline: none;
			border: none;
			justify-content: center;
			opacity: 0.8;
			background-color: #f1f1f1;
			outline: none;
			.btn{
				text-align: center;
			}
		}
	}
	.title {
		display: flex;
		align-items:center;
		justify-content: space-between;
		background-color: #fff;
		padding: 25rpx;
		.showData{
			width: 400rpx;
			> .father-title {
				font-size: 36rpx;
				font-weight: 700;
			}
			> .sub-title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				margin-top: 10rpx;
			}
			
		}
	}
	.content {
		margin-top: 20rpx;
		padding: 30rpx;
		background-color: #fff;
		> .content-title {
			font-weight: 700;
		}
		> .content-body {
			margin-top: 10rpx;
			width: 100%;
			height: 100%;
		}

	}
	.scroll{
		max-height: 45vh;
	}
</style>

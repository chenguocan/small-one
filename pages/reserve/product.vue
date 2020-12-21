<template>
	<view class="map">
		<view class="banner">
			<swiper class="swiper" indicator-dots="true" autoplay="true" interval="2000" duration="500">
				<swiper-item v-for="(item,index) in images" :key="index">
					<image class="image-item" :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="title-info">
			<view class="title">
				<view class="big-title">
					{{roomInfo.title}}
				</view>
				<view class="sub-title">
					{{roomInfo.subtitle}}
				</view>
			</view>
			<view class="price">
				<view class="new-price">￥{{roomInfo.price_now}}</view>
				<view v-if="roomInfo.price_now != roomInfo.price_old" class="old-price">￥{{roomInfo.price_old}}</view>
			</view>
		</view>
		
		<view class="content">
			 <rich-text class="content-body" :nodes="nodes" space="nbsp"></rich-text> 
			<!-- <view class="item">
				办公位置：XX楼
			</view>
			<view class="item">
				面积：12平方米
			</view>
			<view class="item">
				工位数量：12
			</view>
			<view class="item">
				设施配套：XXXXXXXXXXXXX
			</view> -->
		</view>
		<view class='btn'>
			<view class="button" @click="create_order()">
				预定
			</view>
		</view>
	</view>
</template>
<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				images: [], // 轮播图列表
				roomId: 0,
				start: '',
				stop: '',
				group: '',
				type: '',
				roomInfo: {},
				nodes: '暂无详情', 
				openid:'',
				getRoomId:0,
				length:0,
			}
		},
		onLoad(option) {
			console.log('pro op', option);
			if(option.stop){
				this.stop=option.stop;
			}else{
				this.length=option.length;
			}
			this.roomId = option.id;
			this.start = option.start;
			this.group = option.group;
			this.type = option.type;
			// this.roomId = 1002;
			// this.start = '2020-10-01';
			// this.stop = '2020-10-31';
			// this.group = '001';
			// this.type = 'ST';
			this.getRoom();
		},
		onShow(){
			console.log(globalData);
		},
		onUnload() {
		},
		methods: {
			/**
			 * 预定
			 */
			create_order() {
				let currentId=this.openid;
				if(globalData.openid===currentId || currentId===''){
					let data =  JSON.stringify(this.roomInfo);
					let id = this.getRoomId;
					let start = this.start;
					let group = this.group;
					let type = this.type;
					let arg='';
					let value='';
					if(this.stop){
						arg='stop';
						value=this.stop;
					}else{
						arg='length';
						value=this.length;
					}
					return uni.navigateTo({
						url: '/pages/order/createOrder?id=' + id + '&start=' + start + '&group=' + group + '&type=' + type+ '&' +arg+ '=' +value
					}) 	
				}else{
					uni.showModal({
						title: '温馨提示',
						content: '您好，由于该房间的现有租客拥有优先预约权，您无法直接在网上预定该房，请拨打客服电话0592-5150130或13959291925线下预定该房，谢谢合作',
						showCancel:false,
					})
				}
			},
			
			/**
			 * 获取房间信息
			 */
			getRoom() {
				let that = this;
				let roomId = this.roomId;
				let start = this.start;
				let group = this.group;
				let type = this.type;
				let length='';
				let stop='';
				let data={};
				let arg='';
				let value='';
				if(this.stop){
					let arg='stop';
					value=stop=this.stop;
					data={
						appid: globalData.appid,
						start: start,
						stop: stop,
						group: group,
						type: type,
						room: roomId,
						clienttype:1,
						openid:globalData.openid
					}
				}else{
					let arg='length';
					value=length=this.length;
					data={
						appid: globalData.appid,
						start: start,
						length: length,
						group: group,
						type: type,
						room: roomId,
						clienttype:1,
						openid:globalData.openid
					}
				}
				console.log(data);
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCR/GetRoom',
					data,
					success: function (res) {
						console.log('GetRoom', res);
						if(res.data.errCode===0){
							const resData = res.data.data;
							that.roomInfo = resData;
							that.images = resData.banner;
							that.getRoomId=resData.id;
							console.log(that.getRoomId);
							that.nodes =resData.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
							that.openid=resData.openid;
						}else{
							uni.showModal({
								title:'错误提示',
								content:res.data.errMsg,
								showCancel:false,
							})
						}
					}
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #F1F2F2;
	}

	.swiper {
		height: 406rpx;

	}
	
	.image-item {
		width: 100%;
		height: 100%;
	}
	.title-info {
		width: 674rpx;
		height: 215rpx;
		background-color: white;
		margin: 0 auto;
		margin-top: 10px;
		border-radius: 10rpx;
		padding: 40rpx 52rpx 60rpx 32rpx;
	}

	.title {
		/* width: 100%;
		height: 115rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		font-size: 29rpx;
		font-weight: bold;
		color: #333333; */
	}
	
	.title > .big-title {
		font-size: 29rpx;
		font-weight: bold;
		color: #333333;
	}
	
	.title > .sub-title {
		color: #333333;
	}

	.title-info > .price {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 28rpx;
	}
	
	.title-info > .price > .new-price {
		margin-right: 10rpx;
		color: #EA541E;
	}
	
	.title-info > .price > .old-price {
		font-size: 20rpx;
		color: #C0C4CC;
		text-decoration: line-through;
	}

	.content {
		/* border: 1rpx solid black; */
		display: flex;
		padding: 40rpx 52rpx 60rpx 32rpx;
		background: white;
		width: 674rpx;
		transform: translateY(10rpx);
		border-radius: 10rpx;
		margin: 0 auto;
	}
	.content-body {
		margin-top: 10rpx;
		width: 100%;
		height: 100%;
		padding-bottom: 110rpx;
	}

	/* .item:nth-child(0){
		margin-top: 13rpx;
	} */
	.item {
		margin-top: 93rpx;
	}

	.item:nth-child(1) {
		margin-top: 10rpx;
	}
	.btn{
		position: fixed;
		display: flex;
		width: 100%;
		height: 110rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #f1f2f2;
		bottom: 0rpx;
	}
	.button {
		width: 674rpx;
		margin: 0 auto;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2rpx solid #1250A2;
		border-radius: 36rpx;
	}
</style>

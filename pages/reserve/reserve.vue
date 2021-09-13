<template>
	<view class="map">
		<view class="navbar">
			<view class="navbar_item" v-for="(item,index) in nv_list" :key="item.id" @click="query(index)">
				{{item.name}}

				<view class="sc" v-if="index < 2">
					<view class="triangle-up">

					</view>
					<view class="triangle-down">

					</view>
				</view>
				<view class="srceen" v-if="index ==  2">

				</view>
			</view>

		</view>
		<view class="good_list">
			<view class="goods_item" v-for="(item, index) in roomList" :key="index" @click="goto(item)">
				<view class="good_img">
					<image :src="item.image"></image>
				</view>
				<view style="display: flex;">
					<view style="display: flex;height: 120rpx;padding-top: 18rpx;">
						<view class="good_content">
							<view class="m2_view">
								<view class="m2">
								</view>
								<text class="good_number">
									{{item.title}}
								</text>
							</view>
							<view class="good_title">
								{{item.subTitle}}
							</view>
						</view>
					</view>
					<view class="right">
						<view class='preferential' v-if="item.activity">

						</view>
						<view class='appointment'>

						</view>
					</view>
				</view>
				<view class="good_price">
					<text class="now-price">￥{{item.priceNow}}</text>
					<text v-if="item.priceNow != item.priceOld" class="old-price">￥{{item.priceOld}}</text>
				</view>
			</view>
		</view>
		<view>

		</view>
		<!-- <u-loadmore :status="status" :bg-color="bgColor" @loadmore="load" /> -->
	</view>

</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				fontSize: 22,
				bgColor: '#F1F2F2',
				status: 'loading',
				roomOrder: 0,
				list: 15,
				page: 0,
				nv_list: [
					/* {
						name: '房号',
						index: 0
					},
					{
						name: '价格',
						index: 1
					}, */
					{
						name: '筛选',
						index: 2
					}
				],
				good_list: [],
				size: "cover",
				pages: 5,
				pagination: 1,
				group: "",
				type: "",
				offset: 0, // 从第几页开始
				length: 10, // 每页长度
				isLoadMore: true, // 是否加载更多
				roomList: [], // 房间列表
				start: '',
				stop: '',
				group: '',
				type: '',
				currentLength:0,
			}
		},
		onLoad(options) {
			console.log('options', options);
			if(options.stop){
				this.stop=options.stop;
			}else{
				this.currentLength=options.length;
			}
			this.start = options.start;
			this.group = options.group;
			this.type = options.type;
			// this.load();
			this.getRoomList();
		},
		methods: {
			goto(item) {
				let openid=item.openid;
				let id = item.id;
				let start = this.start;
				let group = this.group;
				let type = this.type;
				let stop = '';
				let length='';
				let arg='';
				let value='';
				console.log(arg);
				if(this.stop){
					arg='stop';
					value=this.stop;
				}else{
					arg='length';
					value=this.currentLength;
				}
				console.log(arg);
				uni.navigateTo({
					url: '/pages/reserve/product?id=' + id + '&start=' + start + '&group=' + group + '&type=' + type+'&openid='+openid+ '&'+arg+'='+value
				}) 
	
			},
			query(index) {
				uni.switchTab({
					url: '../tabBar/search'
				})
				return false;
				if (index == 0) {
					this.roomOrder = this.roomOrder === 1 ? 2 : 1;
				}
				if (index == 1) {

				}
				if (index == 2) {
					uni.switchTab({
						url: '../tabBar/search'
					})
				}
			},
			
			getRoomList: function () {
				const that = this;
				let start = this.start;
				let group = this.group;
				let type = this.type;
				let offset = this.offset;
				let length=this.length;
				let currentLength=this.currentLength;
				let isLoadMore = this.isLoadMore;
				let roomList = this.roomList;
				let stop='';
				let datelength='';
				let data={};
				if(this.stop){
					stop=this.stop;
					data={
						appid: globalData.appid,
						start: start,
						group: group,
						type:  type,
						pageSize: length,
						pageIndex: offset,
						stop:stop,
						clienttype:1,
						openid:globalData.openid
					}
				}else{
					datelength=this.currentLength;
					data= {
						appid: globalData.appid,
						start: start,
						group: group,
						type:  type,
						pageSize: length,
						pageIndex: offset,
						length:datelength,
						clienttype:1,
						openid:globalData.openid
					}
				}
				console.log(data);
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCR/GetRoomList',
						data,
						success: function (res) {
							console.log('GetRoomList', res);
							if (res.data.errCode == 0 && res.data.data.length > 0) {
								const resData = res.data.data;
								const room = [];
								for (let index in resData) {
									room[index] = {};
									room[index].id = resData[index].id;
									room[index].image = resData[index].image;
									room[index].activity = resData[index].activity;
									room[index].priceNow = resData[index].price_now;
									room[index].priceOld = resData[index].price_old;
									room[index].rownumber = resData[index].rownumber;
									room[index].subTitle = resData[index].sub_title;
									room[index].title = resData[index].title;
									room[index].openid=resData[index].openid;
								}
								
								that.roomList = that.roomList.concat(room);
								if (resData.length < length) {
								  that.isLoadMore = false;
								} else {
								  that.isLoadMore = true;
								  that.offset = that.offset + that.length;
								}
							} else {
								that.isLoadMore = false;
								uni.showToast({
									title: '暂无数据',
									icon: 'none'
								})
							}
						}
					})
				}  else {
				  uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				  })
				}
			},
			
		},
		onReachBottom() {
			// this.load();
			this.getRoomList();
		}
	}
</script>

<style>
	.srceen {
		width: 25rpx;
		height: 28rpx;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/screen.png") no-repeat;
		background-size: cover;
	}

	.sc {
		/* display: flex; */
		/* border: 1px solid black; */
		width: 18rpx;
		position: relative;
		top: -5rpx;
		left: 10rpx;
	}

	.triangle-up {
		/* 	width: 0;
		height: 0; */
		display: flex;
		/* justify-content: center; */
		align-items: center;
		width: 11rpx;
		height: 18rpx;
		border-left: 9rpx solid transparent;
		border-right: 9rpx solid transparent;
		border-bottom: 11rpx solid gray;
	}

	.triangle-down {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		width: 0;
		height: 0;
		border-left: 9rpx solid transparent;
		border-right: 9rpx solid transparent;
		border-top: 11rpx solid gray;
	}

	page {
		background-color: #F1F2F2;
		padding-top: 8rpx;
		/* padding: 83rpx 0 0 20rpx; */

	}

	.map {
		width: 710rpx;
		margin: 0 auto;
		background: white;
		border-radius: 8rpx;
		/* padding-left: 40rpx; */
	}

	.navbar {
		display: flex;
		width: 100%;
		justify-content: flex-end;
	}

	.navbar_item {
		font-size: 27rpx;
		width: 33.3%;
		display: flex;
		height: 82rpx;
		justify-content: center;
		align-items: center;

	}

	.good_list {
		/* display: flex; */
		/* display: flex; */
		/* border: 1px solid black; */
		/* padding-bottom: 15rpx; */
		/* padding-left: 40rpx; */
	}

	.goods_item {
		/* margin-top: 15rpx; */
		border-top: 1rpx solid #636F9C;
		height: 218rpx;
		width: 628rpx;
		padding-top: 15rpx;
		margin-left: 40rpx;
		padding-bottom: 15rpx;
		/* margin-bottom: 18px; */
		/* border: 1px solid black; */
		display: flex;
		position: relative;
		justify-content: flex-start;
	}

	.goods_item::first-line {
		border-top: 0rpx solid #636F9C;
	}

	.good_img {
		/* margin-top: 18rpx; */
		width: 278rpx;
		height: 185rpx;
	}
	
	.good_img > image {
		width: 100%;
		height: 100%;
	}

	.good_content {
		/* margin-top: 18rpx; */
		width: 232rpx;
		height: 120rpx;
		padding: 0 0rpx 0rpx 18rpx;
		justify-content: center;
		align-items: center;
	}

	.good_title {
		width: 266rpx;
		height: 68rpx;
		display: block;
		/* line-height: 23px; */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
		margin-top: 30rpx;
		
	}

	.m2_view {
		width: 250rpx;
		display: flex;
		align-items: center;
	}

	.good_number {
		width: 220rpx;
		font-size: 16px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		/* margin-top: 18rpx; */

	}

	.m2 {
		/* margin-top: 13rpx; */
		width: 29rpx;
		height: 29rpx;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/m2.png") no-repeat;
		background-size: cover;
	}

	.good_price {
		position: absolute;
		right: 0;
		bottom: 25rpx;
		color: #F49C2E;
		/* width: 250rpx;
		text-align: right;
		margin-top: 136rpx;
		color: #F49C2E;
		white-space: normal; */
		/* display: flex; */
		/* margin: 32rpx 0 0 247rpx; */
	}
	
	.good_price > .now-price {
		margin-right: 20rpx;
	}
	
	.good_price > .old-price {
		font-size: 24rpx;
		color: #ccc;
		text-decoration: line-through;
	}

	.preferential {
		width: 29rpx;
		height: 30rpx;
		position: absolute;
		right: 15rpx;
		top: 60rpx;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/preferential.png") no-repeat;
		background-size: cover;
	}

	.right {
		display: flex;
		height: 138rpx;
	}

	.appointment {
		width: 42rpx;
		height: 44rpx;
		position: absolute;
		right: 0;
		top: 0;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/appointment.png") no-repeat;
		background-size: 100%;
	}
</style>

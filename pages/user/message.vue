<template>
	<view>
		<view>	
			<u-tabs-swiper ref="uTabs" font-size="34" active-color="#46b8ff" :list="list" :current="current" @change="tabsChange"
			 :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" class="swiper" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(item2,index2) in list" :key="index2">
				<scroll-view scroll-y enable-flex style="height: 1150rpx;width: 100%;" @scrolltolower="onreachBottom">
					<view class="msg">
						<view class="msg-item" v-for="(item, index) in msgList" :key="item.id" @click="intoMessageDetail(item.id, index)">
							<view class="left">
								<image :src="item.url_image"></image>
							</view>
							<view class="right">
								<view class="info">
									<view >{{item.type}}</view>
									<view class="title">{{item.title}}</view>
									<view class="time">{{item.create_datetime}}
										<u-button type="error" size="mini" shape="circle" @click="deleteMessage(item.id)" v-if="current===1">删除</u-button>
									</view>
								</view>
								<view class="red-dot" v-if="item.state==0 && masterList[index]"></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				offset: 0, // 从第几页开始
				length: 10, // 每页长度
				isLoadMore: true, // 是否加载更多
				msgList: [], // 消息列表
				masterList: [], // 主列表
				msgreadList:[],
				list: [{
					name: '未读'
				}, {
					name: '已读'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				tabs: ['1', '2', '3', '4'],
			}
		},
		
		onShow() {
			
			this.getInfoList(parseInt(this.current+1));
		},
				
		methods: {
			deleteMessage(id){
				let that=this;
				
				uni.showModal({
					title:'提示',
					content:'是否删除该消息?',
					success(res) {
						console.log(res);
						if(res.confirm){
							uni.request({
								method:'POST',
								url:globalData.url3+'/Message/SetMessageState',
								data:{
									id,
									state:3,
									uid:globalData.uid,
								},
								success(res) {
									uni.showToast({
										title:res.data.errMsg,
										icon:'none'
									})
									if(res.data.errCode===0){
										that.msgList= [] // 消息列表
										that.masterList= []
										that.getInfoList(parseInt(that.current+1));
									}
								}
							})
						}
					}
				})
			},
			/**
			 * 获取消息列表
			 */
			getInfoList(state) {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let msgList = this.msgList;
				let masterList = this.masterList;
				
				uni.request({
					method: 'POST',
					url: globalData.url3 + '/Message/GetMessages',
					data: {
						uid:globalData.uid,
						state:state,
						rowIndex:offset,
						rowCount:length
					},
					success: function (res) {
						console.log('Message/GetMessages', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							const msgList = resData;
							
							for (let index in msgList) {
								if (msgList[index].state == 0) {
									masterList.push(true)
								} else {
									masterList.push(false)
								}
							}
							that.msgList = that.msgList.concat(msgList);
							that.masterList = masterList;
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
				/* if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.url3 + '/Message/GetMessages',
						data: {
							uid:globalData.uid,
							state:state
						},
						success: function (res) {
							console.log('Message/GetMessages', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const msgList = resData;
								
								for (let index in msgList) {
									if (msgList[index].state == 0) {
										masterList.push(true)
									} else {
										masterList.push(false)
									}
								}
								that.msgList = that.msgList.concat(msgList);
								that.masterList = masterList;
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
				} */
			},
			
			/**
			 * 进去消息详情页
			 */
			intoMessageDetail(id, index) {
				console.log('id: ' + id + ' index: ' + index);
				this.$set(this.masterList, index, false);
				uni.navigateTo({
					url: './messageDetail?id=' + id
				})
			},
			
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;

			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.msgList= [] // 消息列表
				this.masterList= []
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				this.getInfoList(parseInt(current+1));
				// 主列表

			},
			// scroll-view到底部加载更多
			onreachBottom() {
			
			},
		},
		

	}
</script>

<style lang="less" scoped>
	.swiper {
		background-color: white;
		height: 1150rpx;
		border-radius: 10rpx;
		margin: 20rpx;
	}
	.msg {
		background-color: #fff;
		height: 1150rpx;
	}
	.msg-item {
		display: flex;
		align-items: center;
		> .left {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			> image {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		> .right {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			margin-left: 20rpx;
			width: 650rpx;
			border-bottom: 1px solid #ccc;
			> .info {
				width: 100%;
				> .title {
					font-weight: 700;
				}
				> .time {
					width: 100%;
					display: flex;
					justify-content: space-between;
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #808080;
					align-items: center;
				}
			}
			> .red-dot {
				margin-right: 30rpx;
				width: 14rpx;
				height: 15rpx;
				border-radius: 50%;
				background-color: #f00;
			}
		}
	}
</style>


<!-- <template>
	<view class="container">
		
		<view class="msg">
			<view class="msg-item" v-for="(item, index) in msgList" :key="item.id" @click="intoMessageDetail(item.id, index)">
				<view class="left">
					<image :src="item.url_image"></image>
				</view>
				<view class="right">
					<view class="info">
						<view >{{item.type}}</view>
						<view class="title">{{item.title}}</view>
						<view class="time">{{item.create_datetime}}</view>
					</view>
					<view class="red-dot" v-if="item.state==0 && masterList[index]"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				offset: 0, // 从第几页开始
				length: 10, // 每页长度
				isLoadMore: true, // 是否加载更多
				msgList: [], // 消息列表
				masterList: [], // 主列表
				
				list: [{
					name: '已读'
				}, {
					name: '未读'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				tabs: ['1', '2', '3', '4'],
			}
		},
		
		onLoad() {
			this.getInfoList();
		},
				
		methods: {
			/**
			 * 获取消息列表
			 */
			getInfoList() {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let msgList = this.msgList;
				let masterList = this.masterList;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.url3 + '/Message/GetMessages',
						data: {
							uid:globalData.uid,
							state:1
						},
						success: function (res) {
							console.log('Message/GetMessages', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const msgList = resData;
								
								for (let index in msgList) {
									if (msgList[index].state == 0) {
										masterList.push(true)
									} else {
										masterList.push(false)
									}
								}
								that.msgList = that.msgList.concat(msgList);
								that.masterList = masterList;
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
			
			/**
			 * 进去消息详情页
			 */
			intoMessageDetail(id, index) {
				console.log('id: ' + id + ' index: ' + index);
				this.$set(this.masterList, index, false);
				uni.navigateTo({
					url: './messageDetail?id=' + id
				})
			},
			
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;

			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;

			},
			// scroll-view到底部加载更多
			onreachBottom() {
			
			},
		},
		

	}
</script>

<style lang="less" scoped>
	.msg {
		background-color: #fff;
		min-height: 100vh;
	}
	.msg-item {
		display: flex;
		align-items: center;
		> .left {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			> image {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		> .right {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			margin-left: 20rpx;
			width: 650rpx;
			border-bottom: 1px solid #ccc;
			> .info {
				> .title {
					font-weight: 700;
				}
				> .time {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #808080;
				}
			}
			> .red-dot {
				margin-right: 30rpx;
				width: 14rpx;
				height: 15rpx;
				border-radius: 50%;
				background-color: #f00;
			}
		}
	}
</style>
 -->
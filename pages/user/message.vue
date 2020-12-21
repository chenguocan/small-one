<template>
	<view class="container">
		<view class="msg">
			<view class="msg-item" v-for="(item, index) in msgList" :key="item.id" @click="intoMessageDetail(item.id, index)">
				<view class="left">
					<image :src="item.image"></image>
				</view>
				<view class="right">
					<view class="info">
						<view class="title">{{item.title}}</view>
						<view class="time">{{item.datetime}}</view>
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
						url: globalData.api + '/MCM/GetInfoList',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							pageIndex: offset,
							pageSize: length,
							clienttype:1
						},
						success: function (res) {
							console.log('GetInfoList', res);
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
			}
		},
		
		onReachBottom: function () {
			this.getInfoList();
		}
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

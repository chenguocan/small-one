<template>
	<view class="container">
		<view class="lease-info">
			<view class="lease-info-item" v-for="(item, index) in leaseInfo" :key="index">
				<view class="title-time">
					<view class="title">{{item.title}}</view>
					<view class="time">{{item.sub_title}}</view>
				</view>
				<view class="amount">{{item.amount}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				id: 0,
				leaseInfo: [], // 详情列表
			};
		},
		
		onLoad(options) {
			this.id = options.id;
			this.getRoomHistory();
		},
		
		methods: {
			/**
			 * 获取工位账单明细
			 */
			getRoomHistory() {
				const that = this;
				const id = this.id;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetRoomHistory',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						id: id,
						clienttype:1
					},
					success: function (res) {
						console.log('GetRoomHistory', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.leaseInfo = resData;
						} else {
							that.isLoadMore = false;
							uni.showToast({
								title: '暂无详情',
								icon: 'none'
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		min-height: 100%;
		background-color: #fff;
	}
	.lease-info {
		
	}
	.lease-info-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 40rpx;
		border-bottom: 1px solid #ddd;
		> .title-time {
			> .title {
				font-weight: 700;
				font-size: 34rpx;
			}
			> .time {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #808080;
			}
		}
	}
</style>

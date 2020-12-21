<template>
	<view class="container">
		<!-- 明细内容 -->
		<view class="detail">
			<view class="detail-item" v-for="(item, index) in detailList" :key="index">
				<view class="left">
					<view class="left-type">{{item.title}}</view>
					<view class="left-time">{{item.datetime}}</view>
				</view>
				<view class="right">
					{{item.amount}}
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
				source: 0, // 来源，1：余额消费，2：积分情况
				offset: 0, // 从第几页开始
				length: 10, // 每页长度
				isLoadMore: true, // 是否加载更多
				detailList: [], // 详情信息
			}
		},
		
		onLoad(options) {
			console.log('options', options);
			const source = this.source = options.source;
			if (source == 1) {
				this.getMembershipTransactList();
			} else if (source == 2) {
				this.getMembershipPointList()
			}
		},
		
		onReachBottom: function () {
			if (source == 1) {
				this.getMembershipTransactList();
			} else if (source == 2) {
				this.getMembershipPointList()
			}
		},
		
		methods: {
			/**
			 * 获取会员卡交易明细列表
			 */
			getMembershipTransactList() {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let detailList = this.detailList;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCM/GetMembershipTransactList',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							clienttype:1
						},
						success: function (res) {
							console.log('getMembershipTransactList', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const detailList = resData;
								that.detailList = that.detailList.concat(detailList);
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
			 * 
			 */
			getMembershipPointList() {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let detailList = this.detailList;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCM/GetMembershipPointList',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							clienttype:1
						},
						success: function (res) {
							console.log('getMembershipTransactList', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const detailList = resData;
								that.detailList = that.detailList.concat(detailList);
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
			}
		}
	}
</script>

<style lang="less" scoped>
	.detail {
		background-color: #FFFFFF;
	}
	.detail-item {
		padding: 20rpx 40rpx;
		display: flex;
		justify-content: space-between;
		height: 120rpx;
		border-bottom: 1px solid #ccc;
		> .left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			> .left-time {
				font-size: 26rpx;
				color: #888;
			}
		}
		> .right {
			display: flex;
			align-items: center;
		}
	}
</style>

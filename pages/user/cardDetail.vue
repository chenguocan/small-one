<template>
	<view class="container">
		<!-- 明细内容 -->
		<view class="detail-item">
			<view class="count">总笔数：{{count}}</view>
			<view class="right-amount">
				{{parseInt(source)!==2?'总金额':'总积分'}}：{{amount}}
			</view>
		</view>
		<!-- <view class="detail">
			<view class="detail-item"  >
				<view class="left">
					<view class="left-type">1</view>
					<view class="left-time">2</view>
				</view>
				<view class="right">
					<view class="left-count">金额:3</view>
					<view class="left-integral" v-if="source===2">积分:4</view>
				</view>
			</view>
		</view> -->
		<view v-if="detailList.length===0" class="none">
			无
		</view>
		<view class="detail">
			<view class="detail-item" v-for="(item, index) in detailList" :key="index">
				<view class="left">
					<view class="left-type">{{item.title}}</view>
					<view class="left-time">{{item.datetime}}</view>
				</view>
				<view class="right">
					<view class="left-count">{{source===2?'金额：':''}}{{item.amount}}</view>
					<view class="left-integral" v-if="source===2">{{source===2?'积分：':''}}{{item.score}}</view>
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
				money: 0,
				type: '',
				direction: '',
				count: 0,
				amount: 0,
				currentId:'',
			}
		},

		onLoad(options) {
			console.log('options', options);
			console.log(globalData.uid);
			this.currentId=options.id;
			const source = this.source = options.source;
			if (options.title) {
				uni.setNavigationBarTitle({
					title: options.title
				})
			}
			this.direction = options.direction;
			/* if(parseInt(source)===0){
				this.money=options.money;
				console.log(this.money)
			} */
			if (source == 1) {
				this.getMembershipTransactList();
			} else if (source == 2) {
				this.getMembershipScoreList()
			} else if (source == 3) {
				this.getMembershipMeasuredList();
			} else if (source == 4) {
				this.getMembershipTimesList();
			}
		},

		onReachBottom: function() {

			/* if (this.source == 1) {
				this.getMembershipTransactList();
			} else if (this.source == 2) {
				this.getMembershipScoreList()
			} */
		},

		methods: {
			getMembershipMeasuredList() {
				let that = this;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetMembershipMeasuredList',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype: 1,
						uid: globalData.uid,
						id:this.currentId
					},
					success(res) {
						console.log('getMembershipMeasuredList', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							const detailList = [];
							console.log(resData.count);
							that.count = resData.count;
							that.amount = resData.amount.toFixed(2);
							const list = resData.list;
							list.forEach(item => {
								item.amount = item.amount.toFixed(2);
								detailList.push(item);
							})
							that.detailList=detailList;
							/* that.detailList = that.detailList.concat(detailList);
							if (resData.length < length) {
								that.isLoadMore = false;
							} else {
								that.isLoadMore = true;
								that.offset = that.offset + that.length;
							} */
						} else {
							that.isLoadMore = false;
							uni.showToast({
								title: '暂无数据',
								icon: 'none'
							})
						}
					}
				})
			},
			getMembershipTimesList() {
				let that = this;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetMembershipTimesList',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype: 1,
						uid: globalData.uid,
						id:this.currentId
					},
					success(res) {
						console.log('getMembershipTimesList', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							const detailList = [];
							console.log(resData.count);
							that.count = resData.count;
							that.amount = resData.amount.toFixed(2);
							const list = resData.list;
							list.forEach(item => {
								item.amount = item.amount.toFixed(2);
								detailList.push(item);
							})
							that.detailList=detailList;
							/* that.detailList = that.detailList.concat(detailList);
							if (resData.length < length) {
								that.isLoadMore = false;
							} else {
								that.isLoadMore = true;
								that.offset = that.offset + that.length;
							} */
						} else {
							that.isLoadMore = false;
							uni.showToast({
								title: '暂无数据',
								icon: 'none'
							})
						} 
					}
				})
			},
			/**
			 * 获取会员卡交易明细列表
			 */
			getMembershipTransactList() {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let detailList = this.detailList;
				let direction = this.direction;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCM/GetMembershipTransactList',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							clienttype: 1,
							direction: direction,
							uid: globalData.uid,
							id:this.currentId
						},
						success: function(res) {
							console.log('getMembershipTransactList', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const detailList = [];
								console.log(resData.count);
								that.count = resData.count;
								that.amount = resData.amount.toFixed(2);
								const list = resData.list;
								list.forEach(item => {
									item.amount = item.amount.toFixed(2);
									detailList.push(item);
								})
								that.detailList=detailList;
								/* that.detailList = that.detailList.concat(detailList);
								if (resData.length < length) {
									that.isLoadMore = false;
								} else {
									that.isLoadMore = true;
									that.offset = that.offset + that.length;
								} */
							} else {
								that.isLoadMore = false;
								uni.showToast({
									title: '暂无数据',
									icon: 'none'
								})
							}
						}
					})
				} else {
					uni.showToast({
						title: '没有更多数据了',
						icon: 'none'
					})
				}
			},

			/**
			 * 
			 */
			getMembershipScoreList() {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let detailList = this.detailList;
				let direction = this.direction;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCM/GetMembershipScoreList',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							clienttype: 1,
							direction: direction,
							uid: globalData.uid,
							id:this.currentId
						},
						success: function(res) {
							console.log('getMembershipScoreList', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const detailList = [];
								that.count = resData.count;
								that.score = resData.score;
								const list = resData.list;
								list.forEach(item => {
									item.amount = item.amount.toFixed(2);
									detailList.push(item);
								})
								that.detailList=detailList;
								/* that.detailList = that.detailList.concat(detailList);
								if (resData.length < length) {
									that.isLoadMore = false;
								} else {
									that.isLoadMore = true;
									that.offset = that.offset + that.length;
								} */
							} else {
								that.isLoadMore = false;
								uni.showToast({
									title: '暂无数据',
									icon: 'none'
								})
							}
						}
					})
				} else {
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
	.none {
		position: absolute;
		color: #cdcece;
		top: 50%;
		left: 50%;
		font-size: 48rpx;
	}

	.detail {
		background-color: #FFFFFF;
	}

	.detail-item {
		padding: 20rpx 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 120rpx;
		border-bottom: 1px solid #ccc;

		>.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			>.left-time {
				font-size: 26rpx;
				color: #888;
			}
		}

		>.right {
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>

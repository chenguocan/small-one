<template>
	<view class="map">

		<!-- <view class="date">
			<view class="start">
				开始
			</view>
			<view>
				-
			</view>
			<view class="end">
				结束
			</view>
		</view> -->
		<view class="icon_list">
			<!-- 1 -->
			<view class="icon_item" v-for="(item,index) in icon_list" :key="index" @click="changeState(item.state)">
				<view :style="{background:item.icon,'background-size':size}" class="icon">
				</view>
				<view :class="state==index+1?'color-red':''">
					{{item.name}}
				</view>
			</view>
		</view>

		<view class="item" v-for="(item,index) in orderList" :key="index" v-if="masterList[index]">
			<view style="display: flex;"  :data-order="item.order" :data-reserve="item.reserve">
				<view class="img">
					<image :src="item.image"></image>
				</view>
				<view class="center">
					<view style="height:162rpx">
						<view class="center_top">
							{{item.title}}
						</view>
						<!-- <view class="center_bottom">
							{{item.number}}
						</view> -->
					</view>
				</view>
				<view class="price">
					￥{{item.amount}}
				</view>
			</view>

			<view class="bottom">

				<view class="bottom_left">
					订单号：{{item.order}}
				</view>
				<view class="bottom_right" v-if="state==1">
					<view class="btn cancel" @click="cancelOrder(item.order, index)">
						取消
					</view>
					<view class="btn pay" @click="pay(item.order, index)">
						支付
					</view>
				</view>
			</view>
		</view>
		<!-- <u-loadmore :status="status" :bg-color="bgColor" @loadmore="load" /> -->
	</view>
</template>
<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				status: 'loading',
				bgColor: '#F1F2F2',
				size: 'cover',
				icon_list: [
					{
						state: 1,
						name: '待付款',
						icon: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/pay1.png') no-repeat",
					},
					{
						state: 2,
						name: '已付款',
						icon: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/pay2.png') no-repeat",
					},
					{
						state: 3,
						name: '执行中',
						icon: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/incomplete.png') no-repeat",
					},
					{
						state: 4,
						name: '已完成',
						icon: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/complete.png') no-repeat",
					},
				],
				offset: 0, // 从第几页开始
				length: 10, // 每页长度
				isLoadMore: true, // 是否加载更多
				state: 0,
				orderList: [],
				masterList: [], // 控制显示隐藏
			}
		},
		onLoad(options) {
			this.state = options.state;
			console.log('state', this.state)
			this.getOrderList();
			// this.load();
		},
		onReachBottom() {
			// this.load();
			this.getOrderList();
		},
		methods: {
			load(type = 'add', status) {
				if (this.pagination < this.pages) {
					this.status = 'loadmore';
					this.pagination = ++this.pagination;
				}

				console.log(this.status);

				if (type == 'add') {
					if (this.status == 'nomore') {
						return;
					}
					this.status = 'loading'
				} else {
					this.status = 'more';
				}
				this.status = 'loading'
				// console.log(this.status);
				// return;
				// console.log(this.status);
				let orderList = [{
					title: '2020工位2020工位2020 工位2020工位2020工位',
					number: '12平方米',
					content: '',
					price: '￥2000',
					image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/rent.png') no-repeat"

				}, {
					title: '2020工位2020工位2020 工位2020工位',
					content: '',
					price: '￥2000',
					image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/rent.png') no-repeat",
					number: '12平方米',
				}, {
					title: '2020工位2020工位2020 工位2020工位',
					content: '',
					price: '￥2000',
					image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/rent.png') no-repeat",
					number: '12平方米',
				}, {
					title: '2020工位2020工位2020 工位2020工位',
					content: '',
					price: '￥2000',
					image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/rent.png') no-repeat",
					number: '12平方米',
				}, {
					title: '2020工位2020工位2020 工位2020工位',
					content: '',
					price: '￥2000',
					image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/rent.png') no-repeat",
					number: '12平方米',
				}, {
					title: '2020工位2020工位2020 工位2020工位',
					content: '',
					price: '￥2000',
					image: "url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/rent.png') no-repeat",
					number: '12平方米',
				}];
				let that = this;
				setTimeout(() => {
					// that.orderList = that.orderList.concat(orderList);
					that.orderList = that.orderList.concat(orderList);
					this.status = this.orderList.length > 40 ? 'nomore' : 'loadmore';
				}, 1000)

				console.log(this.orderList.length)

			},
			
			/**
			 * 去支付
			 */
			pay(orderId, index) {
				const that = this;
				if (!orderId) {
					uni.showToast({
						title: '订单id不能为空',
						icon: 'none'
					})
					return false;
				}
				uni.request({
				  	method: 'POST',
				  	url: globalData.api + '/wx/pay',
				  	data: {
				  		appid: globalData.appid,
				  		openid: globalData.openid,
				  		out_trade_no: orderId,
				  	},
				  	success: function (res) {
				  		if (res.data.errCode == 0) {
				  			const resData = res.data.data;
							wx.requestPayment({
							   timeStamp: resData.timeStamp,
							   nonceStr: resData.nonceStr,
							   package: resData.package,
							   signType: resData.signType,
							   paySign: resData.paySign,
							   success (res) {
								   uni.showToast({
								   	title: '支付成功',
								   	icon: 'none'
								   })
								   that.$set(that.masterList, index, false);
							   }
							})
				  		} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
				  	}
				})
			},
			
			/**
			 * 取消订单
			 */
			cancelOrder(id, index) {
				const that = this;
				uni.showModal({
				  title: '提示',
				  content: '确定取消订单吗',
				  success (res) {
				    if (res.confirm) {
						uni.request({
							method: 'POST',
							url: globalData.api + '/MCO/CancelOrder',
							data: {
								appid: globalData.appid,
								openid: globalData.openid,
								order: id,
								clienttype:1
							},
							success: function (res) {
								console.log('CancelOrder', res);
								if (res.data.errCode == 0) {
									that.$set(that.masterList, index, false);
									uni.showToast({
										title: '订单取消成功',
										icon: 'none'
									})
								} else {
									uni.showToast({
										title: '取消订单失败：' + res.data.errMsg,
										icon: 'none'
									})
								}
							}
						})
				    }
				  }
				})
				return;
				
			},
			
			/**
			 * 获取订单列表
			 */
			getOrderList() {
				const that = this;
				const openId = globalData.openid;
				const state = this.state;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let orderList = this.orderList;
				let masterList = this.masterList;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCO/GetOrderList',
						data: {
							appid: globalData.appid,
							openid: openId,
							state: state,
							pageSize: length,
							pageIndex: offset,
							clienttype:1
						},
						success: function (res) {
							console.log('getOrderList', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								
								for (let index in resData) {
									masterList.push(true)
								}
								
								that.masterList = masterList;
								that.orderList = that.orderList.concat(resData);
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
							console.log('orderList', orderList);
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
			 * 切换状态
			 */
			changeState(state) {
				this.state = state;
				this.offset = 0;
				this.length = 10;
				this.isLoadMore = true;
				this.orderList = [];
				this.masterList = [];
				this.getOrderList();
			}
		}
	}
</script>

<style>
	page {
		background-color: #F1F2F2;
	}

	.date {
		height: 86rpx;
		display: flex;
		padding: 14rpx 39rpx 25rpx 39rpx;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2px solid #DDDDDD;
	}

	.start {
		width: 253rpx;
		height: 50rpx;
		/* display: flex; */
		text-align: center;
		border: 2px solid #1876FE;
		border-radius: 24rpx;
	}

	.end {
		width: 253rpx;
		height: 50rpx;
		text-align: center;
		/* display: flex; */
		border: 2px solid #1876FE;
		border-radius: 24rpx;
	}

	.icon_list {
		display: flex;

		/* justify-content: space-between; */
	}

	.icon_item {
		width: 25%;
		border-bottom: 1px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 38rpx 0 31rpx 0;
	}
	
	.icon_item .color-red {
		color: #f00;
	}

	.icon {
		width: 79rpx;
		height: 79rpx;
	}

	.item {
		width: 705rpx;
		height: 320rpx;
		background-color: white;
		margin: 0 auto;
		margin-top: 23rpx;
		padding: 21rpx;
	}

	.img {
		width: 190rpx;
		height: 190rpx;
	}
	
	.img image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.center {
		padding: 24rpx 0 0 20rpx;
		width: 290rpx;
		height: 190rpx;
	}

	.center_top {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
	}

	.price {
		height: 190rpx;
		display: flex;
		align-items: center;
		color: #EA541E;
		position: absolute;
		right: 63rpx;

	}

	.bottom {
		display: flex;
		height: 100rpx;
		font-size: 20rpx;

	}

	.bottom_left {
		display: flex;
		align-items: center;
		width: 50%;
	}

	.bottom_right {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50%;
	}

	.btn {
		border: 1rpx solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		color: gray;
		width: 120rpx;
		height: 47rpx;
		border-radius: 16px;
		margin-left: 15rpx;
	}

	.cancel {
		color: gray;

	}

	.pay {
		color: white;
		background: blue;
	}
</style>

<template>
	<view class="map">
		<view class="item" v-for="(item,index) in ticketList" :key="index">
			<view class="price">
				<text class="price_title">
					 {{item.title}}
				</text>
			</view>
			<view class="content">
				<p class="coupon">
					 {{item.control}}
				</p>
				<p class="date">
					 {{item.sbu_title}}
				</p>
				<!-- <view class="apply">
					去使用
				</view> -->
			</view>
		</view>
	<!-- 	<view class="item">
			<view class="price">
				<text class="price_title">
					200
				</text>
			</view>
			<view class="content">
				<p class="coupon">
					满200可用
				</p>
				<p class="date">
					有效期至2020-12-12
				</p>
				<view class="apply_out">
					已过期
				</view>
			</view>
		</view> -->
	</view>

	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
                  ticketList:[], // 优惠券列表
			}
		},
		onLoad() {
			// this.loadData();
			this.getTicketList();
		},
		methods: {
			/**
			 * 获取优惠券列表
			 */
			getTicketList() {
				let that = this;
				let roomId = '707';
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetTicketList',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype:1,
					},
					success: function (res) {
						console.log('res', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.ticketList = resData;
						}
					}
				})
			},

            loadData(){
				this.$request
					.post("/MCM/GetTicketList", {
						header: {
							'content-type': 'application/json'
						},
						data: {
							appid: "wx9c6352d928983b70"
						},
						dataType: 'json',
						responseType: 'text'
					})
					.then(res => {
						this.list = res.data.data;
					})
			}
		}
	}
</script>

<style>
	page {
		background-color:#F1F2F2;
		/* 	height: 100px; */
		/* padding-top: 30rpx */
	}

	body {
		/* padding-top: 15rpx; */
	}

	.item {
		display: flex;
		margin-top: 25rpx;
		/* align-items: center; */
		justify-content: center;
		/* margin:auto auto; */
		/* margin: 15rpx 35rpx; */
		height: 150rpx;
		/* width: 100%; */
		/* border: 1rpx solid black; */
		border-radius: 25rpx 0px 0px 25rpx;
	}

	/* .item:first-child {
		margin-top: 0;
	} */
    .item:last-child {
		margin-bottom: 30rpx;
	}
	.price_title {
		font-size: 20rpx;
	}

	.price {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 150rpx;
		width: 207rpx;
		border-radius: 25rpx 0px 0px 25rpx;
		background-color: #EA541E;
	}

	.content {

		height: 150rpx;

		width: 494rpx;

		float: left;

		border-radius: 0rpx 25rpx 25rpx 0rpx;

		background-color: white;

	}

	.coupon {
		line-height: 100rpx;
		margin-left: 30rpx;
		font-size: 10px;
	}

	.date {
		line-height: 10rpx;
		margin-left: 30rpx;
		font-size: 10px;
	}

	.apply {
		text-align: center;
		/* background-color: #18B566; */
		border: 1px solid #EC571B;
		width: 30%;
		color: #EC571B;
		/* height: 50rpx; */
		margin-left: 300rpx;
		margin-top: -70rpx;
		height: 70rpx;
		line-height: 65rpx;
		border-radius: 25px;
	}
	.apply_out {
		text-align: center;
		/* background-color: #18B566; */
		border: 1px solid #7A7A7A;
		width: 30%;
		color: #7A7A7A;
		/* height: 50rpx; */
		margin-left: 300rpx;
		margin-top: -70rpx;
		height: 70rpx;
		line-height: 65rpx;
		border-radius: 25px;
	}
</style>

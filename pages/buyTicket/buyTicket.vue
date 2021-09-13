<template>
	<view :style="{height:pageHeight+'px'}" style="position: relative;">
		<view class="swiper-box">
			<view style="height: 400rpx;width: 100%;">
				<image style="height: 400rpx;width: 100%;" :src="shopInfo.sub_image"></image>
			</view>
			<!-- <swiper style="height: 400rpx;width: 100%;" circular="true" autoplay="true">	
				<swiper-item v-for="(item,index) in imageList" :key="index">
					<image style="height: 400rpx;width: 100%;"  :src="item.img" ></image>
				</swiper-item>
			</swiper> -->
		</view>
		<view class="shop-detail">
			<view><text class="title">{{shopInfo.title}}</text>
				<!-- <text class="sub-title">{{shopInfo.sign_image}}</text> -->
			</view>
			<view>
				<text class="sub-title">{{shopInfo.sub_title}}</text>
			</view>
			<view class="cost">￥{{shopInfo.discount_price>=0?(shopInfo.discount_price/100).toFixed(2):0}}</view>
			<!-- <view class="introduce">
				简介:
			</view> -->
			<view style="color: #ec1e0f;font-weight: 700;">
				{{shopInfo.sign_image?shopInfo.sign_image:''}}
			</view>
		</view>
		<view class="num">
			<view style="font-weight: 700;margin-right: 20rpx;">数量:</view>
			<u-number-box v-model="shopInfo.number"></u-number-box>
		</view>
		<view class="add">
			<view class="btn">
				<!-- <u-button shape="circle" size="medium"  class="addGoods" type="warning" style="margin-right:10rpx;" @click="joinCart">加入购物车</u-button> -->
				<u-button shape="circle" size="medium" class="buy" type="success" style="margin-right:30rpx;"
					v-if="shopInfo.type===4" @click="buy">{{shopInfo.type_name}}</u-button>
				<u-button shape="circle" size="medium" class="buy" type="success" style="margin-right:30rpx;" v-else>
					{{shopInfo.type_name}}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	const prefix = getApp().globalData.url3;
	export default {
		data() {
			return {
				imageList: [{
					img: "http://121.37.210.175:8001/image/wxc469315ccc0dee04/1a823f9e68facf05.jpg"
				}, {
					img: "http://121.37.210.175:8001/image/wxc469315ccc0dee04/821e9259dd7f1039.jpg"
				}, {
					img: "http://121.37.210.175:8001/image/wxc469315ccc0dee04/821e9259dd7f1039.jpg"
				}],
				pageHeight: 1000,
				shopInfo: {},
				number: 1,
				currentId: '',
			}
		},
		async onLoad(options) {
			await this.$onLaunched;
			let that = this;
			this.currentId = options.id;
			console.log(globalData);
			console.log(options);
			this.getRegister();
			uni.getSystemInfo({
				success: function(res) {
					that.pageHeight = res.windowHeight;
				}
			})
			this.getShopDetail(options.id);
		},
		methods: {
			getRegister() {
				let that = this;
				if (!globalData.register) {
					uni.showModal({
						title: '尚未注册，请注册后领券！',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../user/login?id=' + that.currentId
								})
							}
						}
					})
				}
			},
			buy() {
				if (globalData.register) {
					let obj = {
						id: this.shopInfo.id,
						count: this.shopInfo.number,
					}
					let list = [];
					list.push(obj);
					uni.request({
						method: 'POST',
						url: prefix + '/EShop/BuyGoodsList',
						data: {
							uid: globalData.uid,
							data: list,
						},
						success(res) {
							console.log(res)
							if (res.data.errCode === 0) {
									uni.showModal({
										title: '领券成功',
										showCancel:false,
										success(res) {
											if (res.confirm) {
												uni.reLaunch({
													url:'../coupon/coupon'
												})
											}
										}
									})
								/* uni.showToast({
									title: res.data.errMsg,
									icon: 'none'
								})
								setTimeout(() => {
									uni.reLaunch({
										url:'../tabBar/user'
									})
								}, 1000) */
							} else {
								uni.showToast({
									title: res.data.errMsg,
									icon: 'none'
								})
							}
						}
					})
				} else {
					this.getRegister();
				}

			},
			joinCart() {
				console.log('123');
				if (this.shopInfo.number === 0) {
					uni.showToast({
						title: '请选择商品数量',
						icon: 'none'
					})
				} else {
					let that = this;
					uni.getStorage({
						key: "goodsList",
						success: (res => {
							let goodsList = res.data;
							let isExist = false;
							goodsList.forEach(goods => {
								if (goods.id == that.shopInfo.id && goods.sub_title == that
									.shopInfo.sub_title) {
									goods.number += Number(that.shopInfo.number)
									isExist = true
								}
							})
							if (!isExist) {
								goodsList.push(that.shopInfo)
							}
							that.setGoodsList(goodsList)
						}),
						fail: (err => {
							let goodsList = [];
							goodsList.push(that.shopInfo);
							that.setGoodsList(goodsList);
						})
					})
					uni.navigateTo({
						url: '../card/card',
						fail(err) {
							console.log(err);
						}
					})
				}
			},

			setGoodsList(goodsList) {
				// console.log("存储到本地存储中")
				// 存储到本地存储中
				uni.setStorage({
					key: "goodsList",
					data: goodsList,
					success: function() {
						uni.showToast({
							icon: "success",
							title: "添加购物车成功"
						})
					}
				})
			},
			getShopDetail(id) {
				let that = this;
				uni.request({
					method: 'POST',
					url: prefix + '/EShop/GetGoods',
					data: {
						uid: globalData.uid,
						id,
					},
					success(res) {
						console.log(res);
						if (res.data.errCode === 0) {
							that.shopInfo = res.data.data;
							that.shopInfo.number = 1;
							/* that.joinCart() */
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.shop-detail {
		background-color: white;
		padding: 20rpx;

		.title {
			font-size: 32rpx;
			font-weight: 700;
			margin-right: 15rpx;
		}

		.sub-title {
			font-size: 24rpx;
			color: #c6c6c6;
			/* color: #ec1e0f; */
			/* font-weight: 700; */
		}

		.cost {
			font-size: 40rpx;
			font-weight: 700;
			color: #F49C2E;
			display: flex;
			justify-content: flex-end;
		}

		.introduce {
			font-weight: 700;
		}
	}

	.swiper-box {
		width: 100%;
		height: 400rpx;
	}

	.add {
		background-color: white;
		position: absolute;
		bottom: 0;
		height: 130rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.btn {}
	}

	.num {
		bottom: 135rpx;
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: white;
		padding: 20rpx 0;
	}
</style>

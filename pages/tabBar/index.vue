<template>
	<view class="map">
		<view class="search_view">
			<input type="text" value="" placeholder="搜索从这里开始" class="search" v-model="search_value" />
			<view class="search_icon">
			</view>
		</view>
		<view class="swiper_view">
			<swiper class="swiper" :circular="true" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			 :duration="duration">
				<swiper-item v-for="(item,index) in bannerList" :key="index" @click='bannerDetail(item)'>
					<image class="image-item" :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 公司简介 -->
		<view class="nav-list">
			<view class="nav-item" @click="toNav(index)" v-for="(item,index) in navList" :key="index">
				<i class="iconfont" :class="item.icon"></i>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="list_view">
			<view class="phone-img">
				<u-icon name="phone" size="65"></u-icon>
				<text style="margin-left: 10rpx;">0592-50895999</text>
			</view>
		</view>
		<!-- 工位展示 -->
		<view class="list_view">
			<view class="big-title">
				<text class="title">{{showList.title}}</text>
				<text class="sub-title">{{showList.sub_title}}</text>
			</view>
			<view class="list_item" @click="toDetail(item.id)" v-for="(item,index) in list" :key="index">
				<image class="img_item" :src="item.url"></image>
				<view class="title_item">
					<view class="title">
						{{item.title}}
					</view>
					<view class="content">
						{{item.subTitle}}
					</view>
				</view>
			</view>
		</view>
		<view class="about-us">
			<view class="big-title">
				<text class="title">{{aboutList.title}}</text>
				<text class='sub-title'>{{aboutList.sub_title}}</text>
				<view class="nav-img">
					<view class='nav-img' @click="goAbout">
						<image :src="aboutList.image" class='about-us-img'></image>
					</view>
				</view>
			</view>
		</view>
		<u-popup mode="center"   border-radius="10" :closeable="true" width="80%" height="50%" v-model="payShow" @close="closePay">
			<view class="card-detail">
				<u-radio-group class="pay-radio" v-model="payvalue">
					<u-radio @change="payChange(index)" v-for="(item, index) in payList" :key="index" :name="item.name">
						{{item.name}}
					</u-radio>
				</u-radio-group>
				<tki-qrcode ref="qrcode" :val="val" size="300" :onval="true"  class="qrcode">
				</tki-qrcode>
				<view class="card-msg">
					<view>
						卡号:{{payList[index].id}}
					</view>
					<view>
						余额:{{payList[index].amount}}
					</view>
				</view>
			</view>
		</u-popup>
		<!-- <u-popup mode="center"   border-radius="10" :closeable="true" width="80%" height="50%" v-model="locationShow" @close="closeLocation">
			<view>
				<view>{{location}}</view>
				<view>经度{{longitude}}</view>
				<view>纬度{{latitude}}</view>
			</view>
		</u-popup> -->
	</view>
</template>

<script>
	import amap from "../../lib/amap-wx.js"
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	const globalData = getApp().globalData;
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				latitude:'',
				longitude:'',
				locationShow:false,
				location:'北京市',
				powerList:[],
				////////--search--//////////
				search_value: '',
				size: 'cover',
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				////////--banner--//////////
				list: [
					// {
					// 	image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
					// 	title: '昨夜星辰昨夜风，画楼西畔桂堂东',
					// 	search_icon: "url('https://cdn.uviewui.com/uview/swiper/1.jpg') no-repeat"
					// },
					// {
					// 	image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
					// 	title: '身无彩凤双飞翼，心有灵犀一点通',
					// 	search_icon: "url('https://cdn.uviewui.com/uview/swiper/2.jpg') no-repeat"
					// },
					// {
					// 	image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
					// 	title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
					// 	search_icon: "url('https://cdn.uviewui.com/uview/swiper/3.jpg') no-repeat"
					// },{
					// 	image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
					// 	title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
					// 	search_icon: "url('https://cdn.uviewui.com/uview/swiper/3.jpg') no-repeat"
					// },{
					// 	image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
					// 	title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
					// 	search_icon: "url('https://cdn.uviewui.com/uview/swiper/3.jpg') no-repeat"
					// }
				],
				mode: 'round',
				effect3d: false,
				indicatorPos: 'bottomCenter',
				showList: [], // 页面内容
				bannerList: [], // 轮播图列表
				aboutList: [],
				navList: [{
					index: 0,
					icon: 'icon-kefang',
					name: "客房"
				}, {
					index: 1,
					icon: 'icon-zhongcanting',
					name: '中餐厅',
				}, {
					index: 2,
					icon: 'icon-xicanting',
					name: '西餐厅'
				}, {
					index: 3,
					icon: 'icon-spa',
					name: "SPA"
				}, {
					index: 4,
					icon: 'icon-jianshen',
					name: "康体"
				}, {
					index: 5,
					icon: 'icon-icon-test16',
					name: "棋牌室"
				}],
				payShow: false,
				payvalue: '白金卡',
				payList: [],
				val: {},
				index:0,
			}
		},
		onShow() {
			this.getAbout();
			this.getShowList();
		},

		methods: {
			/**
			 * 跳转公司简介
			 */
			goAbout(){
				let temindex = globalData.powerList[0];
				if (temindex === true) {
					uni.navigateTo({
						url:"../index/richText"
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '功能暂未开放',
					})
				}
			},
			/**
			 * 跳转房型
			 */
			toDetail(id){
				let temindex=globalData.powerList[0];
				if(temindex===true){
					uni.navigateTo({
						url:`../index/showDetails?id=${id}`
					})
				}else{
					this.xxx();
				}
			},
			closeLocation(){
				this.locationShow=false;
			},
			closePay(){
				this.payShow = false;
				this.index=0;
				this.$refs.qrcode._clearCode();
			},
			payChange(index) {
				this.val = this.payList[index].id;
				this.index = index;
			},
			xxx() {
				return uni.showToast({
					icon: 'none',
					title: '功能暂未开放',
				})
			},
			async pay() {
				await this.getPayMsg();
				this.payShow = true;
				this.$refs.qrcode._makeCode()
			},
			toNav(index) {
				let temindex=globalData.powerList[index];
				if (temindex===true) {
					this.pay();
				} else {
					return uni.showToast({
						title: '功能暂未开放',
						icon:'none'
					})
				}
			},
			gofood() {
				uni.navigateTo({
					url: `../food/food`
				})
			},
			/**
			 * 跳转Banner
			 */
			bannerDetail(item) {
				let temindex=globalData.powerList[0];
				if(temindex===true){
					uni.navigateTo({
						url: '../index/bannerImage',
						success: () => {
					
						},
						fail: (err) => {
							console.log(err);
						}
					})
				}else{
					uni.showToast({
						title: '功能暂未开放',
					})
				}
			},
			/**
			 * 获取公司简介
			 */
			getAbout() {
				let that = this;
				let openId = globalData.openid;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCH/GetAbout',
					data: {
						appid: globalData.appid,
						language: 'CHN',
						clienttype: 1,
						openid: openId
					},
					success: (res) => {
						console.log(res);
						if (res.data.errCode === 0) {
							that.aboutList = res.data.data;
						}

						console.log(that.aboutList);
					}
				})
			},
			/**
			 * 获取会员卡
			 */
			async getPayMsg() {
				let [err, res] = await uni.request({
					url: globalData.api + '/MCM/GetMembershipPay',
					method: 'post',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype: 1,
						uid: globalData.uid
					}
				})
				console.log('/MCM/GetMembershipPay');
				console.log(res);
				if (res.data.errCode === 0) {
					let resData = res.data.data;
					this.payList = resData;
					this.payList.forEach(item => {
						item.amount = parseInt(item.amount).toFixed(2);
					})
					this.payvalue = this.payList[0].name;
					this.val = this.payList[0].id;
				} else {
					uni.showToast({
						title: res.data.errMsg,
						icon: 'none'
					})
				}
			},
			/**
			 * 获取房间分组
			 */
			getShowList() {
				let that = this;
				let openId = globalData.openid;
				console.log(globalData.api + '/MCH/GetShowList');
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCH/GetShowList',
					data: {
						appid: globalData.appid,
						clienttype: 1,
						openid: openId
					},
					success: function(res) {
						console.log('getShowList', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.showList = resData;
							const banner = resData.banner;
							const list = resData.list;
							let images = [];
							let imageUrl = '';
							let lists = [];

							for (let item of banner) {
								imageUrl = item
								images.push(imageUrl);
							}

							for (let index in list) {
								lists[index] = {};
								lists[index].id = list[index].id;
								lists[index].url = list[index].image;
								lists[index].title = list[index].title;
								lists[index].subTitle = list[index].sub_title;
							}
							that.bannerList = images;
							that.list = lists;
							console.log(that.bannerList);
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F2F2;
		/* padding: 20rpx; */

	}

	/* .map {
		width: 710rpx;
		margin: 0 auto;
	} */
	.phone-img {
		font-size: 60rpx;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 150rpx;
		background-color: #595959;
		border-radius: 15rpx;
	}

	.image-item {
		width: 100%;
		height: 100%;
	}

	.search_view {
		display: flex;
		background: white;
		text-align: center;
	}

	.search {
		width: 100%;
		background: white;
		height: 66rpx;
		font-size: 17rpx;
	}

	.search_icon {
		position: absolute;
		width: 35rpx;
		height: 35rpx;
		left: 662rpx;
		top: 16rpx;
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/search.png") no-repeat;
		background-size: cover;
	}

	.swiper {
		margin-top: 18rpx;
		height: 350rpx;
	}

	.big-title {
		padding: 10rpx 30rpx;
	}

	.big-title>.title {
		font-size: 34rpx;
		font-weight: 700;
	}

	.nav-list {
		margin: 20rpx 20rpx 0 20rpx;
		background: white;
		border-radius: 15rpx;
		opacity: 0.6;
		box-shadow: 0rpx 0rpx 10rpx #a3a3a3;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding-bottom: 20rpx;

		.nav-item {
			justify-content: center;
			align-items: center;
			display: flex;
			flex-direction: column;
			width: 33.3%;
			margin-top: 20rpx;
		}
	}

	.big-title>.sub-title {
		margin-left: 20rpx;
		font-weight: 400;
	}

	.list_view,
	.about-us {
		margin: 20rpx 25rpx;
		border-radius: 15rpx;
		background-color: white;
	}

	.nav-img {
		display: flex;
		justify-content: center;
	}

	.about-us {}

	.about-us .about-us-img {
		margin-top: 10rpx;
		width: 700rpx;
		height: 250rpx;
		/* 		width: 100%;
		height: 100%; */
		border-radius: 20rpx;
		/* 		background: url("http://121.37.210.175:8001/image/wxfe77e4c39c32be1c/about.jpg") no-repeat;
		background-size: cover; */
	}

	.list_item {
		padding: 0 0 0 30rpx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		height: 220rpx;
	}

	.img_item {
		width: 320rpx;
		height: 180rpx;
		border-radius: 10rpx;
	}

	.title_item {
		padding: 34rpx 0 0 42rpx;
	}

	.title {
		width: 375rpx;
		font-weight: bold;
		word-wrap: break-word;
		font-size: 21rpx;
		overflow: hidden;
		margin-bottom: 15rpx;
	}

	.content {
		width: 260rpx;
		height: 64rpx;
		word-wrap: break-word;
		font-size: 18rpx;
		overflow: hidden;
	}
	.card-detail{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>

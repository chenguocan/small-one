<template>
	<view class="map">
		<view class="search_view">
			<input type="text" value="" placeholder="搜索从这里开始" class="search" v-model="search_value" />
			<view class="search_icon">
			</view>
		</view>
		<view class="swiper_view" @click="xxx">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in bannerList" :key="index" >  <!-- @click='bannerDetail(item)' -->
						<image class="image-item" :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 公司简介 -->
		<view class="about-us">
			<view class="big-title">
				<text class="title">{{aboutList.title}}</text>
				<text class='sub-title'>{{aboutList.sub_title}}</text>
				<!-- <navigator hover-class="none" class='nav-img' url="../index/richText"> -->
				<view class='nav-img' @click='xxx'>
					<image :src="aboutList.image" class='about-us-img'></image>
				</view>		
				<!-- </navigator> -->
				
				<!-- <swiper class="aboutSwiper" :autoplay="autoplay" :interval="interval" :duration="duration">
					<swiper-item v-for="(item,index) in aboutList.banner" :key="index" >
						<navigator hover-class="none" class="about-us-img" url="../index/richText">
							<image class="image-item" :src="item"></image>
						</navigator>				
					</swiper-item>
				</swiper> -->
				<!-- <navigator hover-class="none" class="about-us-img" url="../index/richText"></navigator> -->
			</view>
		</view>
		<!-- 工位展示 -->
		<view class="list_view">
			<view class="big-title">
				<text class="title">{{showList.title}}</text>
				<text class="sub-title">{{showList.sub_title}}</text>
			</view>
<!-- 			<navigator hover-class="none"  :url="'../index/showDetails?id=' + item.id" class="list_item" v-for="(item,index) in list" :key="index"> -->
			<view class="list_item" v-for="(item,index) in list" :key="index">
				<image class="img_item" :src="item.url" @click='xxx'></image>
				<view class="title_item">
					<view class="title">
						{{item.title}}
					</view>
					<view class="content">
						{{item.subTitle}}
					</view>
				</view>
			</view>
<!-- 			</navigator> -->
		</view>
	</view>
</template>

<script>	
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
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
				aboutList:[],
			}
		},
		
		onShow () {
			this.getAbout();
			this.getShowList();
		},
		
		methods: {
			xxx(){
				return uni.showToast({
					icon:'none',
					title:'暂未授权',
				})
			},
			gofood(){
				uni.navigateTo({
					url:`../food/food`
				})
	/* 			uni.scanCode({
					success:function(res){
						uni.navigateTo({
							url:`../food/food?scence=${res.scence}?account=${res.account}`
						})
					}
				}) */
			},
			/**
			 * 跳转Banner
			 */
			bannerDetail(item){
				return uni.showToast({
					title:'暂未授权',
				})
				uni.navigateTo({
					url:'../index/bannerImage',
					success: () => {
						
					},
					fail: (err) => {
						console.log(err);
					}
				})
				console.log(item)
			},
			/**
			 * 获取公司简介
			 */
			getAbout(){
				let that=this;
				let openId=globalData.openid;
				uni.request({
					method:'POST',
					url:globalData.api+'/MCH/GetAbout',
					data:{
						appid:globalData.appid,
						language:'CHN',
						clienttype:1,
						openid:openId
					},
					success: (res) => {
						console.log(res);
						if(res.data.errCode===0){
							that.aboutList=res.data.data;
						}
						
						console.log(that.aboutList);
					}
				})
			},
			/**
			 * 获取房间分组
			 */
			getShowList () {
				let that = this;
				let openId=globalData.openid;
				console.log(globalData.api + '/MCH/GetShowList');
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCH/GetShowList',
					data: {
						appid: globalData.appid,
						clienttype:1,
						openid:openId
					},
					success: function (res) {
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

<style>
	page {
		background-color: #F1F2F2;
		/* padding: 20rpx; */

	}

	.map {
		width: 710rpx;
		margin: 0 auto;
		/* margin-top: 40rpx; */
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
		height: 373rpx;
	}
	
	.big-title {
		padding: 0 30rpx;
	}
	
	.big-title > .title {
		font-size: 34rpx;
		font-weight: 700;
	}
	
	.big-title > .sub-title {
		margin-left: 20rpx;
		font-weight: 400;
	}
	
	.list_view, .about-us {
		margin-top: 20px;
		padding: 16rpx 0;
		background-color: white;
	}
	.nav-img{
		display: flex;
		justify-content: center;
	}
	.about-us .about-us-img {
		margin-top: 10rpx;
		width: 650rpx;
		height: 250rpx;
/* 		width: 100%;
		height: 100%; */
		border-radius: 20rpx;
/* 		background: url("http://121.37.210.175:8001/image/wxfe77e4c39c32be1c/about.jpg") no-repeat;
		background-size: cover; */
	}
	
	.list_item {
		padding: 21rpx 0 0 30rpx;
		display: flex;
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		height: 220rpx;
	}

	.img_item {
		width: 233rpx;
		height: 173rpx;
		border-radius: 10rpx;
	}

	.title_item {
		padding: 34rpx 0 0 42rpx;
	}

	.title {
		width:375rpx;
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
</style>

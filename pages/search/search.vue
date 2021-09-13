<template>
	<view>
		<view>	
			<u-tabs-swiper ref="uTabs" font-size="34" active-color="#46b8ff" :list="list" :current="current" @change="tabsChange"
			 :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" class="swiper" @transition="transition" @animationfinish="animationfinish">
			<swiper-item>
				<scroll-view scroll-y enable-flex style="height: 1150rpx;width: 100%;" @scrolltolower="onreachBottom">
					<view class="room-view">
						<view v-for="(item2,index2) in oneList" :key="index2" class="room-item" @click="toDetail(item2.id)">
							<view class="room-img">
								<image  :src="item2.sign_image"></image>
							</view>
							<view class="room-detail">
								<view class="room-title">
									{{item2.title}}
								</view>
								<view class="room-subtitle">
									{{item2.sub_title}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view scroll-y enable-flex style="height: 1150rpx;width: 100%;" @scrolltolower="onreachBottom">
					<view class="room-view">
						<view v-for="(item2,index2) in twoList" :key="index2" class="room-item" @click="order">
							<view class="room-img">
								<image :src="item2.sign_image"></image>
							</view>
							<view class="room-detail">
								<view class="room-title">
									{{item2.title}}
								</view>
								<view class="room-subtitle">
									{{item2.sub_title}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view scroll-y enable-flex style="height: 1150rpx;width: 100%;" @scrolltolower="onreachBottom">
					<view class="room-view">
						<view v-for="(item2,index2) in threeList" :key="index2" class="room-item" @click="toDetail(item2.id)">
							<view class="room-img">
								<image  :src="item2.sign_image"></image>
							</view>
							<view class="room-detail">
								<view class="room-title">
									{{item2.title}}
								</view>
								<view class="room-subtitle">
									{{item2.sub_title}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<u-popup mode="center" @close="handleOrder" v-model="show" width="90%" height="65%" border-radius="10" closeable>
			<view class="order-detail">
				<view style="font-weight: 700;font-size: 32rpx;">
					预定紫薇茶餐厅
				</view>
				<view style="height: 150rpx;">
					
				</view>
				<view  style="width: 95%;height: 600rpx;border-radius: 10rpx;">
						<u-form :model="form" ref="uForm">
							<u-form-item label="日期"><u-input v-model="form.date" type="select" @click="dateShow=true" /></u-form-item>
							<u-form-item label="时间"><u-input v-model="form.time" type="select" @click="timeShow=true"/></u-form-item>
							<u-form-item label="人数">
								<u-input type="number" placeholder="请输入用餐人数" v-model="form.num"/>
							</u-form-item>
						</u-form>
						<view style="height: 30rpx;"></view>
						<u-button type="primary" @click="toOrder" hover-class="none" :custom-style="{backgroundColor:'#e03021'}">预定</u-button>
				</view>
			</view>
			
		</u-popup>
		<u-calendar :min-date="startDate" max-date="2050-12-30" v-model="dateShow" mode="date" @change="changedate"></u-calendar>
		<u-select v-model="timeShow" :list="timeList" @confirm="timeChange"></u-select>
	</view>
</template>

<script>
	import dayjs from "dayjs"
	const globalData = getApp().globalData;
	
	export default {
		data() {
			return {
				timeList:[{
					value:'午餐',
					label:'午餐'
				},{
					value:'晚餐',
					label:'晚餐'
				}],
				dateShow:false,
				timeShow:false,
				list: [{
					name: '客房'
				}, {
					name: '餐饮'
				}, {
					name: '康体'
				}],
				form:{
					date:'',
					time:'',
					num:'',
				},
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				oneList:[],
				twoList:[],
				threeList:[],
				show:false,
				startDate:'',
			};
		},
		onLoad() {
			/* this.getShowList(); */
			this.startDate=dayjs().format('YYYY-MM-DD');
			this.form.date=this.startDate;
			globalData.powerList.forEach(item=>{
				
				if(item.page==='reserve' && !item.enable){
					uni.showToast({
						title:item.tip,
						icon:'none'
					})
				}
			})
			this.getReserveConfig();
			
		},
		methods: {
			toOrder(){
				globalData.powerList.forEach(item=>{
					
					if(item.page==='reserve' && !item.enable){
						uni.showToast({
							title:item.tip,
							icon:'none'
						})
					}
				})
			},
			timeChange(e){
				console.log(e);
				this.form.time=e[0].value;
			},
			changedate(e){
				console.log(e);
				this.form.date=e.result;
			},
			handleOrder(){
				
			},
			order(){
				
				this.show=true
			},
			getReserveConfig(){
				let that=this;
				uni.request({
					method:'POST',
					url:globalData.url3+'/Reserve/GetReserveConfig',
					data:{
						uid:globalData.uid
					},
					success(res) {
						console.log(res);
						if(res.data.errCode===0){
							that.oneList=res.data.data[0].data;
							that.twoList=res.data.data[1].data;
							that.threeList=res.data.data[2].data;
						}
					}
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				/* if (index === 0) {
					this.showList=this.oneList;
				}else if(index===1){
					this.showList=this.twoList;
				}else if(index===2){
					this.showList=this.threeList;
				} else {
					this.showList = [];
				} */
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
				/* if (current === 0) {
					this.showList=this.oneList;
				}else if(current===1){
					this.showList=this.twoList;
				}else if(current===2){
					this.showList=this.threeList;
				} else {
					this.showList = [];
				} */
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			},
			toDetail(id) {
				let temindex = globalData.powerList[0];
				if (temindex === true){
					uni.navigateTo({
						url: `../index/showDetails?id=${id}`
					})
				}else {
					uni.showToast({
						icon: 'none',
						title: '功能暂未开放',
					})
				}
			},
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
							/* that.showList = resData.list
							console.log(JSON.stringify(that.showList)); */
						}
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	.swiper {
		background-color: white;
		height: 1150rpx;
		border-radius: 10rpx;
		margin: 20rpx;
	}
	.swiper-item {}

	.room-view {
		display: flex;
		flex-direction: column;

		.room-item {
			height: 270rpx;
			margin: 10rpx 10rpx 5rpx 10rpx;
			display: flex;

			.room-img {
				height: 216rpx;
				width: 216rpx;
				border-radius: 15rpx;
				image{
					width: 216rpx;height: 216rpx;border-radius: 15rpx;
				}
			}

			.room-detail {
				margin-left: 20rpx;
				.room-title{
					font-size: 30rpx;
					font-weight: 700;
				}
				.room-subtitle {
					font-size: 24rpx;
					color: #d7d7d7;
				}
			}
		}
	}
	
	.order-detail {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 20rpx;
	}
	
</style>

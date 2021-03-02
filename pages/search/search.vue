<template>
	<view>
		<view>
			<u-tabs-swiper ref="uTabs" font-size="34" active-color="#46b8ff" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
			 swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" class="swiper" @transition="transition" @animationfinish="animationfinish">
			<swiper-item  v-for="(item, index) in tabs" :key="index">
				<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
					<view>
						{{item}}
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '客房'
				}, {
					name: '餐饮'
				}, {
					name: '康体'
				},{
					name:'SPA'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				tabs:['1','2','3','4']
			};
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				console.log(index);
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
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				
			}
		}
	};
</script>
<style lang="scss">
	.swiper{
		background-color: white;
		height: 800rpx;
		border-radius: 10rpx;
		margin: 20rpx;
	}
	.swiper-item{
		
	}
</style>
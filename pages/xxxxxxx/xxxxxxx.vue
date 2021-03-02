<template>
	<view>
		<view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>
		<!-- <view class="empty">
			<u-empty  mode="coupon"></u-empty>
		</view> -->
		<view class="coupon">
			<view class="number blue" :class="current===0?'blue':'gray'">
				<view class="count" >
					￥30
				</view>
				<view class="request">
					满31可减
				</view>
			</view>
			<view class="detail" :style="{color:current===0?'':'gray'}">
				<text class="name">30元有效券</text>
				<view class="use-type">
					<text class="time">2021-02-02至2021-02-02</text>
					<view class="is-use" :style="{color:current===0?'':'gray',borderColor:current===0?'':'gray'}">
						{{list[current].name}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '未使用'
				}, {
					name: '已使用'
				}, {
					name: '已过期'
				}],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			};
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				let current = index;
				console.log(index);
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			},
		}
	};
</script>
<style lang="scss">
	.empty {
		margin: auto auto;
	}
	.coupon{
		padding: 20rpx;
		display: flex;
	}
	.blue{
		background-image: radial-gradient(circle at 0px 8px,
			transparent 6px,
			#55aaff 6px,
			#55aaff 0px),
			radial-gradient(circle at 199rpx 8px,
			transparent 4px,
			#55aaff 6px,
			#55aaff 0px);
	}
	.gray{
		background-image: radial-gradient(circle at 1px 8px,
			transparent 6px,
			#e7e7e7 6px,
			#e7e7e7 0px),
			radial-gradient(circle at 199rpx 8rpx,
			transparent 4px,
			#e7e7e7 6px,
			#e7e7e7 0px);
	}
	.detail{
		background-color: white;
		width: 460rpx;
		display: flex;
		flex-direction: column;
		padding: 20rpx 20rpx;
		justify-content: space-between;
		.use-type{
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.time{
				font-size: 20rpx;
			}
			.is-use{
				padding: 5rpx;
				font-size: 24rpx;
				color: #55aaff;
				border-radius: 5rpx;
				border:1px solid #55aaff;
			}
		}
	}
	.number {
		height: 240rpx;
		width: 240rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-size: 250rpx 12rpx;
		background-position: 0 0, 250rpx 0;
		background-repeat-x: no-repeat;
		color: #fff;
		box-sizing: border-box;
		.count{
			font-size: 50rpx;
		}
	}
</style>

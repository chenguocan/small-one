<template>
	<view>
		<view class="radius radius-right-top" v-if="top">	
		</view>
		<view class="radius radius-left-top" v-if="top">
		</view>
		<view class="radius radius-right-bottom" v-if="bottom">
		</view>
		<view class="radius radius-left-bottom" v-if="bottom">
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			top:{
				default:true,
				required:false
			},
			bottom:{
				default:true,
				required:false
			}
		},
		name: "detail-raidus",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.radius {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		position: absolute;
		background-color: #f1f2f2
	}
	.radius-right-top{
		top: -12rpx;
		right: -12rpx;
	}
	.radius-left-top{
		top: -12rpx;
		left: -12rpx;
	}
	.radius-right-bottom{
		bottom: -12rpx;
		right: -12rpx;
	}
	.radius-left-bottom{
		bottom: -12rpx;
		left: -12rpx;
	}
</style>

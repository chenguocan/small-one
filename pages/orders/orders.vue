<template>
	<view>
		<view class="header-tabs">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</view>
		<view style="margin-top: 80rpx;">
			<order-list></order-list>
		</view>
	</view>
</template>

<script>
	import orderList from "@/components/order-list.vue"
	export default {
		components:{
			orderList
		},
		data() {
			return {
				list: [{
					name: '待收货'
				}, {
					name: '待付款'
				}],
				current: 0
			}
		},
		methods: {
			change(index) {
				this.current = index;
			}
		}
	}
</script>

<style lang="scss">
.header-tabs{
	width: 100%;
	position: fixed;
	top: 0;
	box-shadow: 1rpx 1rpx 1rpx #F1F1F1;
}
</style>

<template>
	<view style="display: flex;justify-content: center;">
		<view style="width: 300rpx;">
			<u-button @click="scan" type="primary">点餐</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			scan(){
				uni.scanCode({
					success(res) {
						console.log(res)
						uni.navigateTo({
							url:'../scanfood/scanfood?url='+res.result
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>

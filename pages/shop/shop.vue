<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onShow(){
			uni.showToast({
				title:'暂未授权',
				icon:'none',
				duration:1500,
			})
			setTimeout(function(){
				uni.switchTab({
					url:'../tabBar/index',
					fail: (err) => {
						console.log(err);
					}
				})
			},1500);
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

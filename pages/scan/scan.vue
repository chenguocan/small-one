<template>
	<view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(){
			uni.scanCode({
				success: (res) => {
					let data=decodeURIComponent(res.rawData);
					console.log(data);
				    this.$refs.uToast.show({
					title: '扫码成功',
					type: 'success',
					duration:100,
					url: '/pages/food/food',
					params:{
						scene:'4d6375d93c9838ab,3,075,121212'
					}
				  })
				},
				fail:(err)=>{
					uni.showToast({
						icon:'none',
						title:'请重新扫码',
						duration:1000
					})
					setTimeout(function(){
						uni.navigateBack();
					},1000);
				}
			})
		},
		methods: {
			b64DecodeUnicode(str) {
			    return decodeURIComponent(atob(str).split('').map(function(c) {
			        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			    }).join(''));
			}
		}
	}
</script>

<style>

</style>

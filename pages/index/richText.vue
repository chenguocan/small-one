<template>
	<view class="container">
		<view v-html="nodes" class='container'></view>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				nodes: '', // 富文本框的内容
			}
		},
		
		onShow() {
			this.getAbout();
		},
		
		methods: {
			getAbout() {
				let that = this;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCH/GetAbout',
					data: {
						appid: globalData.appid,
						openid:globalData.openid,
						clienttype:1,
					},
					success: function (res) {
						console.log('getAbout', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.nodes = resData.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
							console.log(that.nodes);
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		padding: 0 40rpx;
	}
	.rich-text {
		height: 100%;
	}
</style>

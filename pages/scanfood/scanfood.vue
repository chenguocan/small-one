<template>
	<view>
		<u-link href='https://www.baidu.com'>
			点击
		</u-link>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		onLoad(options) {
			console.log(options)
			this.url=options
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

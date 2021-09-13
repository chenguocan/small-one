<template>
	<view class="advise-page">
		<view class="advise-header">
			<image class="header-image" src="http://59.60.7.188:49169/Image/bannner3.jpg"></image>
		</view>
		<view class="advise-main">
			<view class="title">
				顾客您好，感谢选择本餐厅用餐！诚邀您用几分钟的时间为我们餐厅提供宝贵的建议。
			</view>
			<view class="advise-item">
				<view class="advise-title">
					您对本次用餐的评价:
				</view>
				<view class="advise">
					<uni-rate :max="5" :value="value" />
				</view>
				<view class="advise-title">
					您对我们餐厅的建议:
				</view>
				<view class="advise">
					<u-input v-model="advise" border placeholder="在此填写您的建议" maxlength="255" type="textarea"></u-input>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn">
				<u-button type="primary" shape="circle" size="medium" @click="submitAdvise">提交</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				advise:'',
				value:0,
			}
		},
		methods: {
			submitAdvise(){
				if(this.advise!==''){
					uni.showModal({
						title: '提交成功',
						content:'本餐厅赠送您一张优惠券,可以点击去查看跳转到票券页面!',
						confirmText:'去查看',
						success(res) {
							if(res.confirm){
								uni.redirectTo({
									url:'../coupon/coupon'
								})
							}else if(!res.confirm){
								uni.switchTab({
									url:'../tabBar/index'
								})
							}
						}
					})
				}else if(this.advise===''){
					uni.showToast({
						title:'请填写您宝贵的建议哦!',
						icon:'none'
					})
				}else if(this.value===''){
					uni.showToast({
						title:'请选择您对本次用餐的评价哦!',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f8f8f8;
		width: 100%;
		height: 100%;
	}

	.advise-page {

		margin: 0 20rpx 0 20rpx;

		.advise-header {
			border-radius: 10rpx;
			width: 710rpx;
			height: 300rpx;

			.header-image {
				width: 710rpx;
				height: 300rpx;
				border-radius: 10rpx;
			}
		}

		.advise-main {
			.title {
				color: #877087;
				padding: 20rpx;
			}

			.advise-item {
				margin: 20rpx;

				.advise {
					margin: 10rpx 0;
				}
			}

		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 10rpx;
		z-index: 999;
		width: 700rpx;
		height: 80rpx;
		background-color: white;
		/* background-color:  #be2d29; */
		/*#69a6d2*/
		display: flex;
		justify-content: flex-end;
		border-radius: 40rpx;
		margin: 0 25rpx;

		.footer-btn {
			position: relative;
			width: 150rpx;
			height: 50rpx;
			right: 75rpx;
			top:10rpx;
		}
	}
</style>

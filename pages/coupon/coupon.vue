<template>
	<view>
		<view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
				swiperWidth="750"></u-tabs-swiper>
		</view>
		<!-- <view class="empty">
			<u-empty  mode="coupon"></u-empty>
		</view> -->
		<view class="coupo-item" v-for="(item,index) in couponList" :key="index">
			<u-read-more ref="uReadMore" close-text="查看票券说明" :toggle="true" :shadow-style="shadowStyle"
				show-height="250">
				<view class="coupon" @click="showCode(item)">
					<view class="detail">
						<view style="display: flex;width: 100%;">
							<view class="telephone">
								<image style="width: 200rpx; height: 170rpx ;border-radius: 10rpx;"
									:src="item.small_url"></image>
							</view>
							<view class="use-type">
								<view style="display: flex;justify-content: space-between;">
									<view style="font-weight: 700;font-size: 30rpx;color: #55aaff;"
										:style="{color:current===1?'':'gray'}">
										{{item.name}}
									</view>
									<view>
										<view @click.stop="presentTicket(item.id)" class="is-use send"
											v-if="current===1 || current===0" style="border:1px solid red;color:red">
											可转赠
										</view>
									</view>
								</view>
								<view
									style="color: red;font-size: 26rpx;font-weight: 700;display: flex;justify-content: flex-end;">
									<view style="display: inline-block;">
										<view style="text-align: center;">￥{{(item.amount/100).toFixed(2)}}</view>
										<view style="text-align: center;">满{{(item.minimum/100).toFixed(2)}}减</view>

									</view>
								</view>
								<!-- <view class="time">满{{(item.minimum/100).toFixed(2)}}减{{(item.amount/100).toFixed(2)}}</view> -->
								<view
									style="width:100%;display: flex;justify-content: space-between;align-items: flex-end;">
									<text class="time">{{item.start}}至{{item.stop}}</text>


									<view class="is-use" v-if="current===1 ">
										去使用
									</view>
								</view>
							</view>
						</view>
					</view>
					<view style="background-color: white;text-indent: 2em;">
						{{item.explain===''?'无':item.explain}}

					</view>

				</view>

			</u-read-more>
		</view>

		<u-popup mode="center" border-radius="10" :closeable="true" width="70%" height="40%" v-model="presentShow"
			@close="closePresent">
			<view class="card-detail">
				<u-form label-width="100" :model="presentForm" ref="editForm">
					<u-form-item label="手机号" prop="telephone">
						<u-input v-model="presentForm.telephone" type="telephone" placeholder="请输入赠送人的手机号" :clearable="false" />
					</u-form-item>
				</u-form>
				<view class="present-button" @click="sendTicket">
					赠送
				</view>
			</view>
		</u-popup>

		<u-popup mode="center" border-radius="10" :closeable="true" width="60%" height="40%" v-model="payShow"
			@close="closePay">
			<view class="card-detail">
				<view style="margin-bottom: 20rpx;font-weight: 700;font-size: 36rpx; ">{{currentTicket.name}}</view>
				<tki-qrcode ref="qrcode" :val="val" size="300" :onval="true" class="qrcode">
				</tki-qrcode>
				<view style="margin-top: 20rpx;" v-if="currentTicket.amount">
					面额:{{(currentTicket.amount/100).toFixed(2)}}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	export default {
		data() {
			return {
				presentForm: {
					telephone: ''
				},
				currentTicket:'',
				presentShow: false,
				list: [{
					name: '未激活'
				}, {
					name: '未使用'
				}, {
					name: '已使用'
				}, {
					name: '已过期'
				}, {
					name: '已取消'
				}],
				couponList: [],
				current: 1, // tabs组件的current值，表示当前活动的tab选项
				payShow: false,
				val: '',
				state: '1',
				shadowStyle: {
					backgroundImage: "none",
					paddingTop: "0",
					marginTop: "10rpx"
				},
				currentTicket: '',
				rules: {
					telephone: [{
							required: true,
							message: '请输入正确的手机号',
							trigger: ['blur'],
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '请输入正确的手机号',
							trigger: ['blur'],
						}
					]
				}
			};
		},
		onLoad() {
			this.getTickets()
		},
		onReady() {
			this.$refs.editForm.setRules(this.rules);
		},
		methods: {
			sendTicket(){
				let that=this;
				uni.request({
					method: 'POST',
					url: globalData.url3+'ticket/Present',
					data: {
						uid: globalData.uid,
						ticket:that.currentTicket,
						phone:that.presentForm.telephone
					},
					success(res) {
						uni.showToast({
							title:res.data.errMsg,
							icon:'none'
						})
						that.presentShow=false;
					}
				})
			},
			closePresent() {
				this.currentTicket='';
				this.presentForm.telephone='';
			},
			presentTicket(id) {
				this.currentTicket=id;
				this.presentShow = true;
			},
			getTickets() {
				let that = this;
				uni.request({
					method: 'POST',
					url: 'https://www.hotelcard.cn/TheHeavens/JunTai/ticket/GetTickets',
					data: {
						uid: globalData.uid,
						state: that.state
					},
					success(res) {
						console.log(res)
						if (res.data.errCode === 0) {
							that.couponList = res.data.data;

						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			showCode(item) {
				if (this.current == 1) {
					this.currentTicket = item;
					this.val = '[' + item.id + ']';
					this.payShow = true;
					this.$refs.qrcode._makeCode()
				}
			},
			closePay() {
				this.payShow = false;
				this.$refs.qrcode._clearCode();
			},
			// tabs通知swiper切换
			tabsChange(index) {
				let current = index;
				console.log(index);
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
				this.state = this.current;

				this.getTickets();
			},
		}
	};
</script>
<style lang="scss">
	.empty {
		margin: auto auto;
	}

	.coupon {
		padding: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.blue {
		/* background-image:url('http://121.4.13.106:8078/images/1-1.jpg'); */
		/* radial-gradient(circle at 1px 8px,
			transparent 6px,
			#e7e7e7 6px,
			#e7e7e7 0px),
			radial-gradient(circle at 199rpx 8rpx,
			transparent 4px,
			#e7e7e7 6px,
			#e7e7e7 0px);*/
		background-size: 100%;
	}

	.gray {
		/* background-image:url('http://121.4.13.106:8078/images/1-1.jpg') */
		/* radial-gradient(circle at 1px 8px,
			transparent 6px,
			#e7e7e7 6px,
			#e7e7e7 0px),
			radial-gradient(circle at 199rpx 8rpx,
			transparent 4px,
			#e7e7e7 6px,
			#e7e7e7 0px);*/
	}

	.detail {
		background-color: white;
		width: 100%;
		display: flex;

		/* flex-direction: column; */
		/* justify-content: space-between; */
		.use-type {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			margin: 15rpx;

			.time {
				font-size: 20rpx;
			}

			.is-use {
				padding: 5rpx;
				font-size: 24rpx;
				color: #55aaff;
				border-radius: 5rpx;

				border: 1px solid #55aaff;
			}
		}
	}

	.telephone {
		height: 230rpx;
		width: 230rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* background-size: 250rpx 12rpx;
		background-position: 0 0, 250rpx 0; */
		/* background-repeat-x: no-repeat; */
		/* background-image: url('http://121.4.13.106:8078/images/1-1.jpg'); */
		color: #fff;
		box-sizing: border-box;

		.count {
			font-size: 50rpx;
		}
	}

	.card-detail {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;

		.present-button {
			color: white;
			background-color: red;
			width: 40%;
			border: 1px solid red;
			border-radius: 10rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			position: absolute;
			bottom: 50rpx;
		}
	}
</style>

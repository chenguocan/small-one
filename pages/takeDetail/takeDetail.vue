<template>
	<view class="food-order">
		<view style="margin-bottom: 100rpx;">
			<view class="header" :style="'background-image:url('+payBackground+')'">
				<view style="margin-left: 20rpx;margin-bottom: 20rpx;">
					<i class="iconfont iconbiaoqing" style="font-size: 50rpx;font-weight: 700;" @click="toBack"></i>
					<!-- <u-icon name="arrow-left" size="54" @click="toBack"></u-icon> -->
				</view>
			</view>
			<!-- <view style="margin: 20rpx;">
				<view class="food-item">
					<view style="width: 200rpx;height: 200rpx;">
						<image style="width: 200rpx;height: 200rpx;border-radius: 15rpx" :src="payImage"></image>
					</view>
					<view class="detail-food">
						<view class="message">
							<view class="title">开餐时间：</view>
							<view class="name">{{reportDetail.create_datetime}}</view>
						</view>
						<view class="message">
							<view class="title">用餐时长：</view>
							<view class="name">{{reportDetail.timeSpan}}</view>
						</view>
						<view class="message">
							<view class="title">用餐地点：</view>
							<view class="name">{{reportDetail.table_name}}</view>
						</view>
						<view class="message">
							<view class="title">用餐属性：</view>
							<view class="name">{{reportDetail.attrib}}</view>
						</view>
					</view>
				</view>
			</view> -->

			<view style="margin: 20rpx;">
				<view class="food-item">
					<view class="detail-food">
						<transition name="my">
							<view class="message" @click="toAddress()" v-if="!isSend">
								<view class="title">收货地址：</view>
								<view class="input-box">
									<u-input disabled @click.stop="toAddress()" input-align="right" placeholder="请选择收货地址"
										v-model="addressItem.name" :clearable="false" />
									<view slot="right" class="slot-right">
										<u-icon name="arrow-right"> </u-icon>
									</view>
								</view>
							</view>
						</transition>
						<!-- <view class="message" @click="toAddress()">
							<view class="title">收货人：</view>
							<view class="input-box">
								<u-input disabled @click.stop="toAddress()" input-align="right" placeholder="请选择收货人"
									v-model="addressItem.link" :clearable="false" />
								<view slot="right" class="slot-right">
									<u-icon name="arrow-right"> </u-icon>
								</view>
							</view>
						</view> -->
						<view class="message" @click="selectTime()">
							<view class="title">送货时间：</view>
							<view class="input-box">
								<u-input disabled @click.stop="selectTime()" input-align="right" v-model="sendTime"
									:clearable="false" />
								<!-- <view slot="right">
									<u-icon  name="arrow-down" > </u-icon>
								</view> -->
							</view>
						</view>
						<view class="message">
							<view class="title">自取：</view>
							<view class="input-box">
								<u-switch size="30" v-model="isSend"></u-switch>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view style="margin: 20rpx;">
				<view class="pay-item">
					<view class="pay-title" @click="toFoodDetail">
						<view></view>
						<view class="title">
							<view class="circle">
								<image class="font-image" src="../../static/images/one.png">
							</view>
							<view>餐品详情</view>
						</view>
						<!-- <view>
							<u-icon name="arrow-right" size="28"></u-icon>
						</view> -->
					</view>
					<!-- <view class="pay-food">
						<view class="message">
							<view class="title">菜品数量：</view>
							<view class="name">{{unsubmitted.length}}道</view>
						</view>
					</view> -->
					<view id="middle">
						<!-- 未提交的订单 -->
						<view id="unsubmit" class="order-box">

							<view class="menu">
								<view v-for="(i, index) in unsubmitted" :key="index" class="list">
									<view class="food-name"><text>{{i.name}}</text><span class="unit">/{{i.unit}}</span>
									</view>
									<view class="count">×{{i.count}}</view>
									<view class="price">￥{{i.price*i.count}}</view>
								</view>
							</view>
						</view>
						<view id="total">
							总价<text class="symbol">￥</text><text class="total-price">{{tempCount}}</text>
						</view>
					</view>

					<view style="margin: 20rpx;">
						<view class="pay-item">
							<view class="pay-food">
								<view class="message">
									<view class="title">票券</view>
									<view class="ticket-name">
										<view class="ticket" @click="selectTicket" v-if="selectList.length===0">
											{{ticketList.length}}张券可选</view>
										<view class="ticket" @click="selectTicket" v-else>选择了{{selectList.length}}张优惠券
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="message">
						<view class="title"></view>
						<view class="input-box">
							<u-input disabled input-align="right" placeholder="请选择优惠券" v-model="addressItem.name"
								:clearable="false" />
							<view slot="right" class="slot-right">
								<u-icon name="arrow-right"> </u-icon>
							</view>
						</view>
					</view> -->
				</view>
			</view>

			<view style="margin: 20rpx;">
				<view class="pay-item">
					<view style="font-weight: 700;width: 100%;text-align: center;">备注</view>
					<view class="pay-food">
						<view class="message" style="justify-content: flex-end;">
							<u-input style="width: 100%;" input-align="right" :autoHeight="false"
								placeholder="如有特殊需要,可以进行备注" v-model="remarks" :clearable="false" />
							<!-- <u-input type="textarea" placeholder="如有特殊需要,可以进行备注"></u-input> -->
						</view>
					</view>
				</view>
			</view>
			<!--选择票券-->
			<!-- <view style="margin: 20rpx;">
				<view class="pay-item">
					<view style="font-weight: 700;width: 100%;text-align: center;">选择票券</view>
					<view class="pay-food">
						<view class="message">
							<view class="title">票券</view>
							<view class="ticket-name">
								<view class="ticket" @click="selectTicket" v-if="selectList.length===0">{{ticketList.length}}张券可选</view>
								<view class="ticket" @click="selectTicket" v-else>选择了{{selectList.length}}张优惠券</view>
							</view>
						</view>
					</view>
				</view>
			</view> -->

			<!-- <view style="margin: 20rpx;">
				<view class="pay-item">
					<view style="font-weight: 700;width: 100%;text-align: center;">支付详情</view>
					<view class="pay-food">
						<view class="message">
							<view class="title">商品总价</view>
							<view class="name">{{(reportDetail.original_amount/100).toFixed(2)}}</view>
						</view>
						<view class="message">
							<view class="title">折扣金额</view>
							<view class="name">{{(reportDetail.discount_amount/100).toFixed(2)}}</view>
						</view>
						<view class="message">
							<view class="title">抵扣金额</view>
							<view class="name" >{{(reportDetail.deduction_amount/100).toFixed(2)}}</view>
						</view>
					</view>
				</view>
			</view> -->

			<!-- <view style="margin: 20rpx;">
				<view class="pay-item">
					<view style="font-weight: 700;width: 100%;text-align: center;"></view>
					<view class="pay-food">
						<view class="message">
							<view class="title" style="font-weight: 700;">已支付</view>
						</view>
						<view class="message">
							<view class="title detail-title">金额</view>
							<view class="name" >{{(reportDetail.paid/100).toFixed(2) || 0}}</view>
						</view>
						<view class="message">
							<view class="title" style="font-weight: 700;">优惠</view>
						</view>
						<view class="message">
							<view class="title detail-title">折扣</view>
							<view class="name" >{{(reportDetail.discount_amount/100).toFixed(2)}}</view>
						</view>
						<view class="message">
							<view class="title detail-title">券</view>
							<view class="name" >{{(reportDetail.deduction_amount/100).toFixed(2)}}</view>
						</view>
					</view>
				</view>
			</view> -->
			<view style="margin: 20rpx;">
				<view class="pay-item">
					<view style="font-weight: 700;width: 100%;text-align: center;">支付详情</view>
					<view class="pay-food">
						<view class="message">
							<view class="name">
								<view>商品总价：</view>
								<view style="font-weight: 700;">{{tempCount}}</view>
							</view>
						</view>
						<view class="message">
							<view class="name">
								<view>优惠券：</view>
								<view style="font-weight: 700;">{{ticketCount}}</view>
							</view>
						</view>
						<view class="message">
							<view class="name">
								<view>折后价：</view>
								<view style="font-weight: 700;">{{discounted_price}}</view>
							</view>
						</view>

						<!-- <view class="message">
							<view></view>
							<view class="name">优惠：<text style="color: red;margin-right: 20rpx;">{{(reportDetail.gift_amount/100).toFixed(2)}}</text>
							实际支付：<text style="font-weight: 700;">{{(reportDetail.pay_amount/100).toFixed(2)}}</text></view>
						</view>
			 -->
					</view>
				</view>
			</view>
		</view>
		<view class="pay-btn">
			<view style="width: 50%;margin: 0 20rpx;">
				<u-button hover-class="none" :disabled="!reportDetail.membership"
					:custom-style="{color:membercolor,fontWeight:'700',backgroundImage:'linear-gradient('+memberbutton+')'}"
					type="primary" shape="circle">会员卡支付</u-button>
			</view>
			<view style="width: 50%; margin: 0 20rpx;">
				<u-button hover-class="none" @click="submitOrder"
					:custom-style="{color:paycolor,fontWeight:'700',backgroundImage:'linear-gradient('+paybutton+')'}"
					type="primary" shape="circle">支付</u-button>
			</view>

		</view>
		<u-popup mode="center" @close="handleTicket" v-model="ticketShow" width="90%" height="65%" border-radius="10"
			closeable>
			<view class="ticket-detail">
				<view style="font-weight: 700;font-size: 32rpx;">
					选择票券
				</view>
				<view style="height: 30rpx;">

				</view>
				<scroll-view scroll-y style="width: 95%;height: 600rpx;border: 1px solid #d1a766;border-radius: 10rpx;">
					<uni-data-checkbox mode="list" selectedColor="#d1a766" wrap multiple v-model="ticketValue"
						:localdata="ticketList" @change="change">
					</uni-data-checkbox>
				</scroll-view>
				<view style="align-self: flex-end;margin: 10rpx 25rpx 0 0">抵扣金额:{{ticketCount}}</view>
			</view>
		</u-popup>
		<u-picker mode="time" v-model="timeShow" :default-time="sendtime" :params="params" @confirm="toggleTime">
		</u-picker>
	</view>
</template>

<script>
	import dayjs from "dayjs"
	import uniDataCheckBox from "../../components/uni-data-checkbox/uni-data-checkbox.vue"
	const prefix = getApp().globalData.url3;
	const globalData = getApp().globalData;
	export default {
		components: {
			uniDataCheckBox
		},
		data() {
			return {
				orderInfo: {},
				appid: '',
				openid: '',
				point: '',
				phone: '',
				ticketList: '',
				payValue: 0,
				ticketShow: false,
				background: [],
				payBackground: '',
				payImage: '',
				reportDetail: '',
				ticketShow: false,
				ticketValue: '',
				selectList: [],
				ticketCount: 0,
				allTicketList: [],
				tempCount: 0,
				paybutton: '',
				memberbutton: '',
				membercolor: '',
				paycolor: '',
				order_address: '',
				target: '101',
				remarks: '',
				total: 0,
				unsubmitted: [],
				sendTime: '',
				name: '',
				address: '',
				timeShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
				},
				addressItem: {
					id: '',
					link: '',
					address: '',
					number: '',
					label: '家',
					link: '',
					title: 0,
					phone: '',
				},
				isSend: false,
				loaded: false,
			}
		},
		computed: {
			discounted_price() {
				let money=(this.tempCount * 1 * 0.9 - this.ticketCount * 1).toFixed(2)
				if(money>=0){
					return (this.tempCount * 1 * 0.9 - this.ticketCount * 1).toFixed(2)
				}else{
					money=0
					return money.toFixed(2)
				}
			},
		},
		onLoad() {
			this.sendTime = dayjs().add(30, 'minute').format('YYYY-MM-DD HH:mm')
			if (!globalData.relate) {
				uni.showModal({
					title: '请先关注酒店微信公众号，支付后获取优惠券',
					showCancel: false,
					success(res) {

					}
				})
			}

			let unsubmitted = uni.getStorageSync('takeout_jtjd_order');
			let total = 0;
			this.unsubmitted = unsubmitted;
			if (unsubmitted) {
				for (let i = 0; i < unsubmitted.length; i++) {
					let price = unsubmitted[i].price;
					let count = unsubmitted[i].count;
					total += price * count;
				}
				this.total = parseFloat(total).toFixed(2);
				this.tempCount = this.total
			}
			/* this.getReport(); */
			this.getBackground()
			/* this.getPhone(); */
			this.getTickets()
		},
		onShow: async function() {
			await this.getAddress();
			if (this.currentItem !== '' && this.loaded) {
				uni.showModal({
					title: '提示',
					content: '暂未设置地址',
					confirmText: '去设置',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '../myAddress/myAddress'
							})
						}
					}
				});
			}
			// this.addressItem = uni.getStorageSync('jtjd_address');
			// console.log(this.addressItem);
		},
		methods: {
			submitOrder() {
				if (this.addressItem.name !== '') {
					let transactDetails = [];
					let that = this;
					let order = uni.getStorageSync('takeout_jtjd_order');

					for (let i = 0; i < order.length; i++) {
						let count = order[i].count;
						let id = order[i].id;
						let list = {
							id: id,
							count: count
						};
						transactDetails.push(list);
					}
					uni.request({
						method: 'POST',
						url: prefix + '/PMS/SetCateringOrder',
						data: {
							uid: globalData.uid,
							target: that.target,
							consume: transactDetails
						},
						success(res) {
							if (res.data.errCode === 0) {
								console.log(res)
							}
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请选择地址'
					})
				}
				// uni.navigateTo({
				// 	url:'../takeOrderDetail/takeOrderDetail'
				// })
			},
			selectTicket() {
				this.ticketShow = true;
			},
			getAddress() {
				let that = this;
				uni.request({
					url: globalData.url3 + 'Config/GetMemberAddressList',
					method: 'POST',
					data: {
						uid: globalData.uid,
					},
					success(res) {
						if (res.data.errCode === 0) {
							if (res.data.data.length !== 0) {
								that.addressItem = res.data.data[0]
							}
						}
					}
				})
			},
			toggleTime(e) {
				console.log(e);
				this.sendTime = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`
			},
			selectTime() {
				this.timeShow = true;
			},
			toFoodDetail() {
				uni.navigateTo({
					url: '../takeFoodDetail/takeFoodDetail'
				})
			},
			toAddress() {
				if(!this.isSend){
					uni.navigateTo({
						url: `../myAddress/myAddress?url=takeOrder`
					})
				}
			},
			handleTicket() {
				// this.getReport();
				this.total = this.tempCount * 1 - this.ticketCount * 1
				if (this.total <= 0) {
					this.total = 0
				}
				/* console.log(this.ticketValue);
				let count=0;
				let list=[];
				list=[...this.ticketValue];
				this.ticketList.forEach(item=>{
					list.forEach((item2,index2)=>{
						if(item.id===item2.id){
							count+=parseInt(item.amount)
							list.splice(index2,1);
						}
					})
				})
				this.ticketCount=count;
				this.reportDetail.discounted_price=this.tempCount-count; */
			},
			change(e) {
				console.log('e:', e);
				let list = e.detail.data;
				let amount = 0;
				list.forEach(item => {
					amount += (parseFloat(item.amount).toFixed(2)) * 100
				})
				console.log(amount);
				this.ticketCount = (amount / 100).toFixed(2)
				/* this.selectList=e.detail.value;
				let count=0;
				let list=[];
				list=[...e.detail.value];
				this.ticketList.forEach(item=>{
					list.forEach((item2,index2)=>{
						if(item.id===item2.id){
							count+=parseInt(item.amount)
							list.splice(index2,1);
						}
					})
				})
				this.ticketCount=count;
				this.reportDetail.discounted_price=this.tempCount-count; */


			},
			selectTicket() {
				this.ticketShow = true;
			},
			toBack() {
				uni.navigateBack();
			},
			getPhone() {
				let that = this;
				uni.request({
					method: 'POST',
					url: prefix + '/catering/Getphone',
					data: {
						uid: globalData.uid,
						appid: globalData.appid,
						openid: globalData.openid
					},
					success(res) {
						console.log(res);
						if (res.data.status === 0) {
							that.phone = res.data.data;
							/* that.getTickets() */
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			getReport() {
				let that = this;
				uni.request({
					method: 'POST',
					url: prefix + '/Catering/Report',
					data: {
						target: that.target,
						uid: globalData.uid,
						tickets: that.ticketValue
					},
					success(res) {
						console.log(res);
						console.log(globalData.uid);
						if (res.data.errCode === 0) {
							that.reportDetail = res.data.data;
							that.tempCount = res.data.data.discounted_price;
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			getBackground() {
				let that = this;
				uni.request({
					method: 'POST',
					url: prefix + '/Config/GetTargetConfig',
					data: {
						target: that.target,
						uid: globalData.uid
					},
					success(res) {
						if (res.data.errCode === 0) {
							console.log(res);
							that.payBackground = res.data.data.background_image;
							that.payImage = res.data.data.pay_logo_image;
							let paybutton = res.data.data.wechat_pay_button.split(',');
							let paycolor = paybutton[3];
							paybutton.splice(3, 1).join(',');
							let memberbutton = res.data.data.member_pay_button.split(',');
							let membercolor = memberbutton[3];
							memberbutton.splice(3, 1).join(',');
							console.log(paybutton)
							that.paybutton = paybutton;
							that.membercolor = membercolor;
							that.paycolor = paycolor
							that.memberbutton = memberbutton;
							console.log(that.background);
						} else {

						}
					}
				})
			},
			getTickets() {
				const that = this;
				uni.request({
					method: 'POST',
					url: 'https://www.hotelcard.cn/TheHeavens/JunTai/Ticket/GetTicketsForOrder',
					data: {
						target: that.target,
						uid: globalData.uid
					},
					success: function(res) {
						let tempData = res.data.data.data;
						let list = [];
						tempData.forEach(item => {
							let obj = {};
							obj.text = item.name;
							obj.value = item.id;
							/* obj.amount=item.amount; */
							obj.image = item.sub_image
							obj.start = dayjs(item.stop).format('YYYY-MM-DD');
							obj.amount = (item.amount / 100).toFixed(2);
							obj.minimum = (item.minimum / 100).toFixed(2);
							list.push(obj)
						})
						that.ticketList = list;
					},
				})
			},
			/**
			 * 支付接口
			 */
			toPay() {
				let that = this;
				let totalFee = -1;
				let point = uni.getStorageSync('point');
				let account = uni.getStorageSync('account');
				let appid = uni.getStorageSync('appId');
				let openid = uni.getStorageSync('openId');
				totalFee = this.reportDetail.discounted_price;
				uni.request({
					method: 'POST',
					url: prefix + '/wx/pay',
					data: {
						appid: appid,
						id: openid,
						point: point,
						openid: openid,
						clienttype: 1,
						total_fee: totalFee,
						uid: globalData.uid,
						target: that.target,

					},
					success: function(res) {
						console.log('/wx/pay', res);

						if (res.data.errCode == 0) {
							const resData = res.data.data;
							console.log(res);
							wx.requestPayment({
								timeStamp: resData.timeStamp,
								nonceStr: resData.nonceStr,
								package: resData.package,
								signType: resData.signType,
								paySign: resData.paySign,
								success(res) {
									that.payCallBack();
								},
								fail(err) {
									console.log(err);
								}
							})
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},

			pay() {

				let that = this;
				let totalFee = -1;
				console.log(this.ticketValue);
				let point = uni.getStorageSync('point');
				let account = uni.getStorageSync('account');
				let appid = uni.getStorageSync('appId');
				let openid = uni.getStorageSync('openId');
				totalFee = this.reportDetail.discounted_price
				uni.request({
					method: 'POST',
					url: prefix + '/WeChat/Pay',
					data: {
						appid: appid,
						openid: openid,
						total_fee: totalFee,
						out_trade_no: '234020210411',
						tickets: that.ticketValue,
						uid: globalData.uid,
						target: that.target
					},
					success: function(res) {
						console.log('/wx/pay', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							wx.requestPayment({
								timeStamp: resData.timeStamp,
								nonceStr: resData.nonceStr,
								package: resData.package,
								signType: resData.signType,
								paySign: resData.paySign,
								success(res) {
									/* that.payCallBack(); */
									that.payCall()
								},
								fail(err) {
									console.log(err);
								}
							})
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			payCall() {
				let that = this;
				uni.request({
					method: 'POST',
					url: prefix + '/Wx/PayCallBack',
					data: {
						uid: globalData.uid,
						target: that.target
					},
					success: function(res) {
						console.log('payCallBack', res)
						if (res.data.errCode === 0) {
							uni.showToast({
								title: '支付成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.redirectTo({
									url: '../food/food'
								})
							}, 800)
						}
					},
					complete: function(res) {

					}
				})
			},
			/**
			 * 支付回调
			 */
			payCallBack() {
				/* let outTradeNo = this.reserveNo; */
				let that = this;
				let outTradeNo = dayjs().format('YYYYMMDDHHssmm');
				let openId = globalData.openid;
				uni.request({
					method: 'POST',
					url: globalData.api + '/wx/PayCallBack',
					data: {
						appid: globalData.appid,
						out_trade_no: outTradeNo,
						openid: openId,
						uid: globalData.uid,
						target: that.target
					},
					success: function(res) {
						console.log('payCallBack', res)

					},
					complete: function(res) {
						uni.switchTab({
							url: '../tabBar/search'
						})
					}
				})
			},

			create(mode = 0) {
				const that = this;
				const room = this.roomId;
				const start = this.start;
				const stop = this.stop;
				const group = this.group;
				const type = this.type;
				const ticket = this.ticket;
				const appId = globalData.appid;
				const openId = globalData.openid;
				this.mode = mode;
				if (openId && appId) {
					that.reserve();
				} else {
					uni.showToast({
						title: '请先登录后操作',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #F1F2F2;
	}
	.ticket-detail {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.food-order {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}

	.pay-btn {
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		background-color: white;
		padding: 10rpx 0;

	}

	.header {
		height: 160rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		display: flex;
		align-items: flex-end;
	}

	.cont {

		width: 671rpx;
		margin: 0rpx auto;
		padding-top: 24rpx;
		height: 100%;



		/* justify-content: center;
		align-items: center; */
	}

	.product {
		position: relative;
		padding: 20rpx 50rpx;
		display: flex;
		background: white;
	}

	.img {
		width: 240rpx;
		height: 240rpx;
	}

	.center-title .title {
		font-size: 18px;
	}

	.food-item {
		display: flex;
		padding: 10rpx;
		background-color: white;
		border-radius: 15rpx;
		width: 100%;

		.detail-food {
			margin: 0;
			width: 100%;
			margin: 20rpx;

			.message {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				.title {
					width: 180rpx;
					display: flex;
					/* justify-content: flex-start; */
				}

				.name {
					width: 100%;
					display: flex;
					justify-content: space-between;
					/* 	justify-content: flex-end; */
				}

				.input-box {
					display: flex;
					align-items: center;

					.slot-right {
						margin-left: 20rpx;
					}
				}
			}
		}

	}

	.detail-title {
		text-indent: 1em;
	}

	.pay-item {
		display: flex;
		flex-direction: column;
		padding: 10rpx;
		background-color: white;
		border-radius: 15rpx;
		width: 100%;

		.message {
			display: flex;
			margin: 0 20rpx;
			justify-content: space-between;

			.title {
				display: flex;
				/* justify-content: flex-start; */
			}


			.name {
				display: flex;
				/* 	justify-content: flex-end; */
			}

			.input-box {
				display: flex;
				align-items: center;

				.slot-right {
					margin-left: 20rpx;
				}
			}
		}

		.pay-title {
			font-weight: 700;
			width: 100%;
			display: flex;
			justify-content: center;

			.title {
				display: flex;
			}

			.circle {
				border-radius: 50%;
				background-color: #be2d29;
				width: 40rpx;
				margin: 0 20rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.font-image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}

		.pay-food {
			width: 100%;
			padding: 20rpx 0;

			.message {
				display: flex;
				margin: 0 20rpx;
				justify-content: space-between;

				.title {
					display: flex;
					/* justify-content: flex-start; */
				}


				.name {
					width: 100%;
					justify-content: space-between;
					display: flex;
					/* 	justify-content: flex-end; */
				}
			}

			.ticket-name {
				background-color: #e03021;

				.ticket {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 26rpx;
					margin: 0 20rpx;
					color: white;
				}
			}

		}
	}

	.center {
		position: relative;
		width: 250rpx;
		margin-left: 49rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
	}

	.sub-title {
		color: #646464;
	}

	.check {
		width: 100%;
		display: flex;
		justify-content: center;
		background: #F1F2F2;
	}

	.price_now {
		position: absolute;
		bottom: 15rpx;
		right: 15rpx;
		color: red;
	}

	.center_top {
		height: 50%;
		line-height: 150rpx
	}

	.center_botton {
		height: 50%;
		display: flex;
		/* justify-content: center; */
		/* align-items: center; */
	}

	.price {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.info {
		height: 100%;
		margin-top: 24rpx;
		background: white;
		padding: 10rpx 0 14rpx 38rpx;
	}

	.info-item {
		font-size: 26rpx;
		display: flex;
		margin-top: 25rpx;
		/* justify-content: center; */
		align-items: center;
	}

	.change {
		font-size: 20rpx;
		display: flex;
		align-items: center;
		position: absolute;
		right: 56rpx;
	}

	.icon {
		width: 38rpx;
		height: 36rpx;
	}

	.coupon-icon {
		background: url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/coupon_icon.png') no-repeat;
		background-size: cover;
	}

	.discount-icon {
		background: url('https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/price_icon.png') no-repeat;
		background-size: cover;
	}

	.discount {
		position: absolute;
		right: 56rpx;
	}

	.discountNum {
		padding: 5rpx 10rpx;
		color: white;
		background: #ff223f;
		border-radius: 7rpx;
	}

	.show {
		display: none;
	}

	.bottom {
		flex-direction: column;
		align-items: center;
		position: absolute;
		width: 100%;
		display: flex;
		bottom: 0;
		justify-content: center;
		/* border: 1rpx solid black; */
		background-color: white;

	}

	.price_view {
		width: 40%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.button {
		width: 100%;
	}

	button {
		border-radius: 0;
	}

	.button_s {
		width: 100%;
		height: 100%;
		background: #1876FE;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	button::after {
		border: none;
	}

	.button_s:first-child {
		margin-right: 20rpx;
	}

	.orderPay {
		visibility: hidden;
	}

	.info-title {
		font-weight: 700;
	}

	.read-mask {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.read-mask .read {
		width: 70%;
		height: 70%;
		transform: translateY(-50rpx);
	}

	.detail {
		padding: 20rpx;
		transform: translateX(-20rpx);
		background: white;
		height: 100%;
		width: 550rpx;
	}

	.confirm {
		color: white;
		font-size: 16px;
		bottom: 0;
		width: 590rpx;
		transform: translateX(-20rpx);
		background: #1876FE;
	}

	.rule-title {
		font-weight: 700;
		font-size: 14px;
	}

	.read-notice {
		height: 100%;
	}

	.notice {
		display: inline-block;
		align-self: center;
		margin: 0 5rpx;
		height: 100%;
		color: #7291ff;
	}

	#middle {
		background-color: #fff;

		#total {
			padding: 10rpx 20rpx;
			display: flex;
			justify-content: flex-end;
			align-items: flex-end;
			border-bottom: 1px solid #F3F3F3;
			padding-bottom: 35rpx;
		}

		.title {
			display: flex;
			align-items: center;
			padding-left: 25rpx;
			height: auto;
			/* border-left: 2px solid #E35952; */
			color: #E35952;
			box-sizing: border-box;
		}

		.menu {
			display: flex;
			flex-direction: column;

			.list {
				width: 100%;
				display: flex;
				/* flex-direction: column; */
				padding: 20rpx 20rpx;
				justify-content: space-between;

				.food-name {
					width: 60%;
				}
			}

		}
	}
</style>

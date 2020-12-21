<template>
	<view>
		<view class="cont">
			<view class="product">
				<image class="img" :src="orderInfo.image">
				</image>
				<view class="center">
					<view class='center-title'>
						<p class='title'>{{orderInfo.title}}</p>
						<p class='sub-title'>{{orderInfo.subtitle}}</p>
					</view>
				</view>
				<view class='price_now'>
					￥{{orderInfo.price_now}}
				</view>
			</view>
			
			<view class="info">
				<view class="info-item">
					<view class='info-title'>
						预定开始时间
					</view>
					<view class="discount">
						{{orderInfo.start}}
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						预定结束时间
					</view>
					<view class="discount">
						{{orderInfo.stop}}
					</view>
				</view>
				<view class="info-item">
					<view class="icon discount-icon">
					</view>
					<view class='info-title'>
						付款类型
					</view>
					<view class="discount">
						<!-- {{orderInfo.cycle_mode}} -->
						<view class="uni-list-cell-db">
							<picker @change="bindCycleModeChange" :value="cycleModeIndex" :range="cycleMode">
								<view>{{cycleMode[cycleModeIndex]}}</view>
							</picker>
						</view>
					</view>
				</view>
				<view class="info-item">
					<view class="icon coupon-icon">
					</view>
					<view class='info-title'>
						优惠券
					</view>
					<view class="discount">
						<picker @change="bindTicketsChange" :value="ticketsIndex" :range="tickets">
							<view>{{tickets[ticketsIndex]}}</view>
						</picker>
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						押金金额
					</view>
					<view class="discount">
						￥{{orderInfo.deposit}}
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						房间金额
					</view>
					<view class="discount">
						￥{{orderInfo.price}}
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						优惠券金额
					</view>
					<view class="discount">
						￥{{orderInfo.ticket}}
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						折扣金额
					</view>
					<view class="discount">
						￥{{orderInfo.discount}}
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						发票信息
					</view>
					<view class="discount">
						{{orderInfo.bill_mode}}
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						支付方式
					</view>
					<view class="discount">
						{{orderInfo.pay_mode}}
					</view>
				</view>
				<view class="info-item">
					<view class='info-title'>
						合计
					</view>
					<view class="discount">
						￥{{orderInfo.amount}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<u-checkbox class="check" v-model="checked" @change="toggleBtn" >
				我已阅读《酒店预定需知》
			</u-checkbox>
			<view class="button">
				<!-- <view class="button_s orderPay" @click="create(2)">
					支付订金
				</view> -->
				<button class="button_s" @click="create(1)" :disabled="disabled">
					提交订单
				</button>
			</view>
		</view>
		
		<u-mask :show='show' @click="maskClick">
			<view class='read-mask'>
				<slot>
					<view class="read" @tap.stop>
						<scroll-view class='detail' scroll-y="true">
							<h1 style="text-align: center;font-weight: 700;font-size: 18px;">酒店入驻守则</h1>
						
							<view>
							<p class='rule-title'>一、酒店入住管理</p>
							</view>
						</scroll-view>
						<button class='confirm' @click="confirm" :disabled="confirmable">
							<view v-if='confirmable===false'>我已阅读</view>
							<view v-else>阅读{{confirmTime}}秒后,可点击确认</view>
						</button>
					</view>
				</slot>
			</view>
		</u-mask>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				orderInfo: [], // 订单信息
				cycleMode: [], // 押金数组
				cycleModeId: [], // 押金id数组
				tickets: ['不使用优惠券'], // 优惠券数组
				ticketsId: ['-1'], // 优惠券id数组
				cycleModeIndex: 0,
				ticketsIndex: 0,
				ticket: -1, // 优惠券id
				roomId: 0,
				start: '',
				stop: '',
				group: '',
				type: '',
				reserveNo: '', // 预定编号
				mode: 0, // 支付选择，看看是订单支付还是订金支付，1：订单支付，2：订金支付
				checked:false,//是否能够提交订单
				disabled:true,
				show:false,//展示
				confirmable:true,//
				confirmTime:3,//控制点击确认等待时间
				intervalId:'',//定时器id
				length:0,
			}
		},
		async onLoad(options) {
			// this.orders = JSON.parse(options.data);
			console.log('options', options);
			if(options.stop){
				this.stop=options.stop;
			}else{
				this.length=options.length;
			}
			this.roomId = options.id;
			this.start = options.start;
			this.group = options.group;
			this.type = options.type;
			// console.log(JSON.parse(options.data));
			// console.log(this.orders);
			await this.getCycleMode(); // 获取压几付几
			this.getTickets(); // 获取可使用优惠券
			this.reserveReport();
		},
		methods: {
			//点击遮罩层时间
			maskClick(){
				this.show=false;
				this.checked=false;
			},
			//点击确认时间
			confirm(){
				this.show=false;
				this.disabled=false;
				this.checked=true;
			},
			//点击check事件
			toggleBtn(){
				if(this.checked===false){
					this.disabled=true;
				}else{
					this.confirmable=true;
					this.show=true;
					let that=this;
					this.intervalId=setInterval(()=>{
						that.confirmTime--;
						if(that.confirmTime===0){
							clearInterval(that.intervalId);
							that.confirmTime=3;
							that.confirmable=false;
						}
					},1000);
				} 
			},
			
			/**
			 * 押金变动
			 */
			bindCycleModeChange: function(e) {
				this.cycleModeIndex = e.target.value;
				this.reserveReport();
			},
			
			/**
			 * 优惠券变动
			 */
			bindTicketsChange: function(e) {
				this.ticketsIndex = e.target.value;
				let index=parseInt(this.ticketsIndex);
				this.ticket=this.ticketsId[index];
				this.reserveReport();
			},
			
			reserveReport () {
				let that = this;
				let roomId = this.roomId;
				let start = this.start;
				let group = this.group;
				let type = this.type;
				let ticket = this.ticketsId[this.ticketsIndex];
				let cycleMode = this.cycleModeId[this.cycleModeIndex];
				let openid=globalData.openid;
				let id=this.roomId;
				let stop='';
				let length='';
				let data={};

				if(this.stop){
					stop=this.stop;
					data={
						appid: globalData.appid,
						start: start,
						room: roomId,
						ticket: ticket,
						cycle_mode: cycleMode,
						id:id,
						openid:openid,
						stop:stop,
						clienttype:1
					}
				}else{
					length=this.length;
					data={
						appid: globalData.appid,
						start: start,
						room: roomId,
						ticket: ticket,
						cycle_mode: cycleMode,
						id:id,
						openid:openid,
						length:length,
						clienttype:1
					}
				}
				console.log(data);
				console.log(globalData);
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCR/ReserveReport',
					data,
					success: function (res) {
						console.log('reserveReport', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							that.orderInfo = resData;
							that.orderInfo.amount=resData.amount.toFixed(2);
							that.orderInfo.deposit=resData.deposit.toFixed(2);
							that.orderInfo.discount=resData.discount.toFixed(2);
							that.orderInfo.price=resData.price.toFixed(2);
							that.orderInfo.price_now=resData.price_now.toFixed(2);
							that.orderInfo.price_old=resData.price_old.toFixed(2);
						} else {
							that.orderInfo = [];
							uni.showModal({
								title: '提示',
								content:res.data.errMsg,
								showCancel:false,
								success:function(result){
									if(result.confirm){
										uni.navigateBack();									
									}
								}
							})
						}
					}
				})
			},
			
			/**
			 * 获取可使用的票券
			 */
			getTickets() {
				const that = this;
				const room = this.roomId;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCR/GetTickets',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						room: room,
						clienttype:1
					},
					success: function (res) {
						console.log('getTickets', res)
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							let tickets = [];
							let ticketsId = [];
							// let cycleMode = [];
							// let cycleModeId = [];
							let ticIndex=0;
							if(resData.length===0){
								tickets[0] = '不使用优惠券';
								ticketsId[0] = '-1';
							}
							for (let index in resData) {
								if(parseInt(index)===0){
									tickets[0] = '不使用优惠券';
									ticketsId[0] = '-1';
								}
								ticIndex=parseInt(index)+1;
								tickets[ticIndex] = resData[index].title;
								ticketsId[ticIndex] = resData[index].id;
							}
							that.tickets = tickets;
							that.ticketsId = ticketsId;
						}else{
							uni.showModal({
								title: '提示',
								content:res.data.errMsg,
								showCancel:false,
								success:function(result){
									if(result.confirm){
										uni.navigateBack();									
									}
								}
							})
						}
					},
				})
			},
			
			/**
			 * 获取压几付几
			 */
			async getCycleMode() {
				let that = this;
				let id=this.roomId;
				let group=this.group;
				const [err,res]=await uni.request({
					method: 'POST',
					url: globalData.api + '/MCR/GetCycleMode ',
					data: {
						appid: globalData.appid,
						id:id,
						openid:globalData.openid,
						clienttype:1
					},
				})
				console.log('getCycleMode', res)
				if (res.data.errCode == 0) {
					const resData = res.data.data;
					let cycleMode = [];
					let cycleModeId = [];
					for (let item of resData) {
						cycleMode.push(item.name);
						cycleModeId.push(item.id);
					}
					that.cycleMode = cycleMode;
					that.cycleModeId = cycleModeId;
				}else{
					uni.showModal({
						title: '提示',
						content:res.data.errMsg,
						showCancel:false,
						success:function(result){
							if(result.confirm){
								uni.navigateBack();									
							}
						}
					})
				}
			},
			
			/**
			 * 预定接口
			 */
			reserve() {
				const mode = this.mode;
				const orderInfo = this.orderInfo;
				let id=this.roomId;
				if (orderInfo) {
					if (mode == 1 || mode == 2) {
						const that = this;
						const room = this.roomId;
						const start = this.start;
						const group = this.group;
						const type = this.type;
						const ticket = this.ticket;
						const appId = globalData.appid;
						const openId = globalData.openid;
						const cycleMode=this.cycleModeId[this.cycleModeIndex];
						let stop='';
						let length='';
						let data={};
						let value;
						if(this.stop){
							value=stop=this.stop;
							data={
								appid: globalData.appid,
								start: start,
								room: room,
								ticket: ticket,
								cycle_mode: cycleMode,
								id:id,
								openid:openId,
								stop:stop,
								clienttype:1
							}
						}else{
							value=length=this.length;
							data={
								appid: globalData.appid,
								start: start,
								room: room,
								ticket: ticket,
								cycle_mode: cycleMode,
								id:id,
								openid:openId,
								length:length,
								clienttype:1
							}
						}
						if (room && start && value&& group && type && ticket) {
							uni.request({
								method: 'POST',
								url: globalData.api + '/MCR/Reserve',
								data,
								success: function (res) {
									console.log('Reserve', res)
									if (res.data.errCode == 0) {
										const resData = res.data.data;
										that.reserveNo = resData;
										that.pay();
									} else {
										that.reserveNo = '';
										uni.showToast({
											title: res.data.errMsg,
											icon: 'none'
										})
									}
								},
							})
						} else {
							uni.showToast({
								title: '参数不能为空',
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title: 'mode参数错误',
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: '订单信息错误',
						icon: 'none'
					})
				}
			},
			
			/**
			 * 支付接口
			 */
			pay() {
				let that = this;
				let outTradeNo = this.reserveNo;
				let mode = this.mode;
				let totalFee = -1;
				if (outTradeNo) {
					if (mode == 1) {
						totalFee = this.orderInfo.amount * 100;
					} else if (mode == 2) {
						totalFee = this.orderInfo.deposit * 100;
					}
					uni.request({
					  	method: 'POST',
					  	url: globalData.api + '/wx/pay',
					  	data: {
					  		appid: globalData.appid,
					  		openid: globalData.openid,
					  		out_trade_no: outTradeNo,
					  		total_fee: totalFee,
							mode: mode,
							clienttype:1
					  	},
					  	success: function (res) {
					  		console.log('/wx/pay', res);
					  		if (res.data.errCode == 0) {
					  			const resData = res.data.data;
								wx.requestPayment({
								   timeStamp: resData.timeStamp,
								   nonceStr: resData.nonceStr,
								   package: resData.package,
								   signType: resData.signType,
								   paySign: resData.paySign,
								   success (res) {
									   that.payCallBack();
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
				} else {
					uni.showToast({
						title: 'outTradeNo为空',
						icon: 'none'
					})
				}
				
			},
			
			/**
			 * 支付回调
			 */
			payCallBack() {
				let outTradeNo = this.reserveNo;
				let openId = globalData.openid;
				uni.request({
					method: 'POST',
					url: globalData.api + '/wx/PayCallBack',
					data: {
						out_trade_no: outTradeNo,
						openid: openId,
					},
					success: function (res) {
						console.log('payCallBack', res)
						
					},
					complete: function (res) {
						uni.switchTab({
							url: '../tabBar/search'
						})
					}
				})
			},
			
            create(mode = 0){
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

<style>
	page {
		background-color: #F1F2F2;
	}

	.cont {
		width: 671rpx;
		margin: 0rpx auto;
		padding-top: 24rpx;
		height: 700rpx;



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
		width: 278rpx;
		height: 184rpx;
	}
	.center-title .title{
		font-size: 18px;
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
	.sub-title{
		color:#646464;
	}
	.check{
		width: 100%;
		display: flex;
		justify-content: center;
		background: #F1F2F2;
	}
	.price_now{
		position: absolute;
		bottom: 15rpx;
		right: 15rpx;
		color:red;
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
	button{
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
	button::after{
		border: none;
	}
	.button_s:first-child {
		margin-right: 20rpx;
	}
	.orderPay{
		visibility: hidden;
	}
	.info-title{
		font-weight: 700;
	}
	.read-mask{
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.read-mask .read{
		width: 70%;
		height: 70%;
	}
	.detail{
		padding:20rpx;
		transform: translateX(-20rpx);
		background: white;
		height: 100%;
		width: 550rpx;
	}
	.confirm{
		color:white;
		font-size: 16px;
		bottom: 0;
		width: 590rpx;
		transform: translateX(-20rpx);
		background:#1876FE ;
	}
	.rule-title{
		font-weight: 700;
		font-size: 14px;
	}
</style>

<template>
	<view class="container">
		<view class="lease">
			<view class="lease-item" v-for="(item, index) in leaseList" :key="item.id">
				<view class="title">
					<view class="title-parent">{{item.title}}</view>
					<view class="title-sub">{{item.sub_title}}</view>
					<view class="state">
						<text v-if="item.state==0">预定</text>
						<text v-if="item.state==1">执行中</text>
						<text v-if="item.state==2">已完成</text>
						<text v-if="item.state==3">已取消</text>
						<text v-if="item.state==4">作废</text>
					</view>
				</view>
				<view class="view">
					<view class="bill" @click="viewInfo(item.id)">账单详情</view>
					<view v-if="item.checkin==0" class="auth" @click="showAuthModel(item.id)">入住认证</view>
				</view>
			</view>
		</view>
		
		<u-modal v-model="show" title="身份认证" :show-cancel-button="true" @confirm="modelConfirm">
			<view class="slot-content">
				<view class="id-item">
					<u-upload ref="front" :action="action" :multiple="false" :show-progress="false" :show-tips="false" :auto-upload="true" @on-remove="onFrontRemove" @on-change="onFrontChange" max-count="1"></u-upload>
					<text class="id-item-title">1. 上传身份证正面</text>
				</view>
				<view class="id-item">
					<u-upload ref="reverse" :action="action" :multiple="false" :show-progress="false" :show-tips="false" :auto-upload="true" @on-remove="onReverseRemove" @on-change="onReverseChange" max-count="1"></u-upload>
					<text class="id-item-title">2. 上传身份证反面</text>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	const globalData = getApp().globalData;
	export default {
		data() {
			return {
				offset: 0, // 从第几页开始
				length: 10, // 每页长度
				isLoadMore: true, // 是否加载更多
				leaseList: [], // 消息列表
				show: false,
				action: 'https://www.hotelcard.cn/Print/api/wxtest/uploadfile', // 图片上传的地址
				// action: 'https://www.hotelcard.cn/Publish/Wx/WxPostFile', // 图片上传的地址
				authId: 0,
				idFrontImage: '',
				idReverseImage: '',
			};
		},
		
		onLoad() {
			this.getRoomHistoryList();
		},

		onReachBottom: function () {
			this.getRoomHistoryList();
		},
		
		methods: {
			/**
			 * 点击授权提交按钮
			 */
			modelConfirm() {
				// const frontImage = this.$refs.front.lists[0];
				// const reverseImage = this.$refs.reverse.lists[0];
				const idFrontImage = this.idFrontImage;
				const idReverseImage = this.idReverseImage;
				const order = this.authId;
				if (!order) {
					uni.showToast({
						title: '订单id不能为空',
						icon: 'none'
					})
					return false;
				}
				if (idFrontImage && idReverseImage) {
					uni.showLoading({
						title: '数据加载中'
					})
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCO/CheckIn',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							order: order,
							imageUrl1: idFrontImage,
							imageUrl2: idReverseImage,
							clienttype:1
						},
						success: function (res) {
							console.log('CheckIn', res);
							uni.hideLoading({})
							if (res.data.errCode == 0) {
								uni.showToast({
									title: '上传成功',
									icon: 'none'
								})
							}
						}
					})
				} else {
					uni.showToast({
						title: '请上传完整图片。',
						icon: 'none'
					})
				}
			},
			/**
			 * 显示授权模态框
			 */
			showAuthModel(id) {
				this.show = true;
				this.authId = id;
			},
			
			/**
			 * 选择身份证正面图片后出发
			 */
			onFrontChooseComplete (lists, name) {
				/* const file = lists;
				if (file[0].response.status) {
					
				} */
				
				
				
				/* uni.uploadFile({
					url: 'https://www.hotelcard.cn/Print/api/wxtest/uploadfile',//你上传接口
					filePath:file[0].url,//上传的文件
					name:"file", //后台接收文件的标识
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
					}
				}); */
			},
			
			/**
			 * 删除身份证正面照片
			 */
			onFrontRemove() {
				
			},
			/**
			 * 删除身份证反面照片
			 */
			onReverseRemove() {
			
			},
			
			/**
			 * 改变身份证图片返回
			 */
			onFrontChange(res, index, lists, name) {
				console.log('resFront', res);
				console.log('indexFront', index);
				console.log('listsFront', lists);
				console.log('nameFront', name);
				if (lists[0].response.status) {
					this.idFrontImage = lists[0].response.message;
				}
				console.log('this.idFrontImage', this.idFrontImage);
			},
			
			/**
			 * 改变身份证图片返回
			 */
			onReverseChange(res, index, lists, name) {
				console.log('resReverse', res);
				console.log('indexReverse', index);
				console.log('listsReverse', lists);
				console.log('nameReverse', name);
				if (lists[0].response.status) {
					this.idReverseImage = lists[0].response.message;
				}
				console.log('this.idReverseImage', this.idReverseImage);
			},
			/**
			 * 获取预定列表
			 */
			getRoomHistoryList() {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let leaseList = this.leaseList;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCM/GetRoomHistoryList',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							pageIndex: offset,
							pageSize: length,
							clienttype:1
						},
						success: function (res) {
							console.log('GetRoomHistoryList', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const leaseList = resData;
								that.leaseList = that.leaseList.concat(leaseList);
								if (resData.length < length) {
								  that.isLoadMore = false;
								} else {
								  that.isLoadMore = true;
								  that.offset = that.offset + that.length;
								}
							} else {
								that.isLoadMore = false;
								uni.showToast({
									title: '暂无数据',
									icon: 'none'
								})
							}
						}
					})
				}  else {
				  uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				  })
				}
			},
			
			/**
			 * 获取工位账单明细
			 */
			getRoomHistory(id) {
				let that = this;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetRoomHistory',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						id: id,
						clienttype:1
					},
					success: function (res) {
						console.log('GetRoomHistory', res);
						if (res.data.errCode == 0) {
							const resData = res.data.data;
							let str = 'ID：' + resData.id + '\r\n标题：' + resData.title + '\r\n时间：' + resData.datetime + '\r\n金额：' + resData.amount;
							uni.showModal({
							    title: '详情',
							    content: str,
								showCancel: false
							});
						} else {
							that.isLoadMore = false;
							uni.showToast({
								title: '暂无详情',
								icon: 'none'
							})
						}
					}
				})
			},
			
			/**
			 * 查看详情
			 */
			viewInfo(id) {
				// this.getRoomHistory(id);
				uni.navigateTo({
					url: './leaseDetails?id=' + id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		min-height: 100vh;
		background-color: #fff;
	}
	.lease {
		
	}
	.lease-item {
		display: flex; 
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 40rpx;
		border-bottom: 1px solid #eee;
		> .title {
			width: 500rpx;
			white-space: nowrap;
			> .title-parent {
				font-weight: 700;
				font-size: 34rpx;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			> .title-sub {
				margin-top: 10rpx;
				font-size: 24rpx;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			> .state {
				margin-top: 10rpx;
				font-size: 24rpx;
			}
		}
		> .view {
			display: flex;
			flex-direction: column;
			> .bill, > .auth {
				width: 150rpx;
				height: 50rpx;
				line-height: 46rpx;
				font-size: 24rpx;
				text-align: center;
				border-radius: 40rpx;
				border: 1px solid #ccc;
			}
			> .auth {
				margin-top: 12rpx;
			}
		}
	}
	.id-item {
		margin-top: 10px;
		&:last-child {
		}
		> .id-item-title {
			display: block;
			margin: 20rpx auto 0;
			font-size: 26rpx;
			text-align: center;
		}
	}
</style>

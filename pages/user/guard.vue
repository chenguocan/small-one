<template>
	<view class="container">
		<!-- 手机号码列表 -->
		<view class="list">
			<view class="list-item" v-for="(item, index) in phoneList" :key="index" v-if="masterList[index]">
				<view class="left">
					<view class="left-room">房间：{{item.room}}</view>
					<view class="left-name">姓名：{{item.name}}</view>
					<view class="left-phone">手机号：{{item.phone}}</view>
				</view>
				<view class="right" @click="cancelAuth(item.phone, item.room, index)">
					取消授权
				</view>
			</view>
		</view>
		<!-- 添加手机号授权按钮 -->
		<view class="add">
			<view class="add-button" @click="addAuth()">添加授权</view>
		</view>
		
		<u-modal v-model="show" title="添加授权" :show-cancel-button="true" @confirm="modelConfirm">
			<view class="slot-content">
				<u-input v-model="nameVal" type="text" placeholder="请输入姓名"></u-input>
				<u-input v-model="phoneNum" type="number" placeholder="请输入手机号"></u-input>
				<u-input v-model="roomVal" type="text" placeholder="请选择房间号" @click="showSelect=true" disabled="disabled"></u-input>
			</view>
		</u-modal>
		<u-select v-model="showSelect" :list="usableRoomList" @confirm="roomConfirm"></u-select>
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
				phoneList: [], // 手机列表
				masterList: [], // 控制显示隐藏
				show: false,
				nameVal: '',
				phoneNum: '',
				roomVal: '', // 房间号
				usableRoomList: [], // 可用的房间列表
				showSelect: false,
				list: [
					{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
				],
			}
		},
		
		onLoad() {
			this.getLockAuthorizePhone();
			this.getLockAuthorizeRoom()
		},
		
		methods: {
			roomConfirm(e) {
				this.roomVal = e[0].value;
			},
			/**
			 * 获取已授权的手机号列表
			 */
			getLockAuthorizePhone() {
				let that = this;
				let offset = this.offset;
				let length = this.length;
				let isLoadMore = this.isLoadMore;
				let phoneList = this.phoneList;
				let masterList = this.masterList;
				if (isLoadMore) {
					uni.request({
						method: 'POST',
						url: globalData.api + '/MCM/GetLockAuthorizePhone',
						data: {
							appid: globalData.appid,
							openid: globalData.openid,
							pageIndex: offset,
							pageSize: length,
							clienttype:1
						},
						success: function (res) {
							console.log('GetLockAuthorizePhone', res);
							if (res.data.errCode == 0) {
								const resData = res.data.data;
								const phoneList = resData;
								
								for (let index in phoneList) {
									masterList.push(true)
								}
								
								that.phoneList = that.phoneList.concat(phoneList);
								that.masterList = masterList;
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
				} else {
				  uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				  })
				}
			},
			
			/**
			 * 取消手机号授权
			 */
			cancelAuth (phone, room, index) {
				const that = this;
				uni.showModal({
				  title: '提示',
				  content: '确定取消对手机号' + phone + '的授权吗？',
				  success (res) {
				    if (res.confirm) {
						that.$set(that.masterList, index, false);
						that.roomVal = room;
						that.setLockAuthorizePhone(phone, 1);
				    }
				  }
				})
			},
			
			/**
			 * 新增手机号授权
			 */
			addAuth() {
				const that = this;
				this.nameVal = '';
				this.phoneNum = '';
				this.roomVal = '';
				if(this.usableRoomList.length===0){
					return uni.showModal({
						title:'温馨提示',
						content:'没有授权',
						showCancel:false,
					})
				}
				this.show=true;
			},
			/**
			 * 模态点击确认
			 */
			modelConfirm() {
				const name = this.nameVal;
				const phoneNum = this.phoneNum;
				const room = this.roomVal;
				if (name) {
					if (this.isPhoneNumber(phoneNum)) {
						this.setLockAuthorizePhone(phoneNum, 0);
					} else {
						uni.showToast({
							 title: '请填入正确的手机号',
							 icon: 'none'
						})
					}
				} else if (name == '') {
					uni.showToast({
						 title: '姓名不能为空',
						 icon: 'none'
					})
				} else if (room == '') {
					uni.showToast({
						 title: '房间号不能为空',
						 icon: 'none'
					})
				}
			},
			
			/**
			 * 判断手机号
			 */
			isPhoneNumber(phone) {
				return /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(phone);
			},
			
			/**
			 * 添加删除授权的手机号
			 */
			setLockAuthorizePhone (phone, oper) {
				let that = this;
				const name = that.nameVal;
				const room = that.roomVal;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/SetLockAuthorizePhone',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						phone: phone,
						name: name,
						room: room,
						operate: oper,
						clienttype:1
					},
					success: function (res) {
						console.log('setLockAuthorizePhone', res);
						if (res.data.errCode == 0) {
							if (oper == 0) {
								that.offset = 0;
								that.length = 0;
								that.isLoadMore = true;
								that.phoneList = [];
								that.masterList = [];
								that.getLockAuthorizePhone();
							}
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			
			/**
			 * 获取可授权开锁的房间列表
			 */
			getLockAuthorizeRoom () {
				let that = this;
				const name = that.nameVal;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCM/GetLockAuthorizeRoom',
					data: {
						appid: globalData.appid,
						openid: globalData.openid,
						clienttype:1
					},
					success: function (res) {
						console.log('GetLockAuthorizeRoom', res);
						if (res.data.errCode == 0) {
							const data = res.data.data;
							let usableRoomList = [];
							for (let index in data) {
								let listItem = usableRoomList[index] = {};
								listItem.value = data[index];
								listItem.label = data[index];
							}
							that.usableRoomList = usableRoomList;
						} else {
							uni.showToast({
								title: res.data.errMsg,
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.list {
		padding-bottom: 100rpx;
		> .list-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 40rpx;
			background-color: #fff;
			border-bottom: 1px solid #ccc;
			> .left {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 500rpx;
			}
			> .right {
				width: 180rpx;
				height: 50rpx;
				line-height: 50rpx;
				text-align: center;
				background-color: #007AFF;
				border-radius: 20rpx;
				color: #fff;
			}
		}
	}
	.add {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #007AFF;
		color: #fff;
		text-align: center;
	}
	.slot-content {
		padding: 0 50rpx;
	}
</style>

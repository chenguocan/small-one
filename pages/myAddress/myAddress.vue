<template>
	<view class="container">
		<view class="address-list" style="padding-bottom: 120rpx;">
			<u-swipe-action :options="options" v-for="(item, index) in siteList" :key="res.id">
				<view class="item">
					<view class="top">
						<view class="name">{{ item.name }}</view>
						<view class="phone">{{ item.phone }}</view>
						<view class="tag">
							<text :class="{red:item.default=='默认'}" v-if="item.default">默认</text>
						</view>
					</view>
					<view class="bottom">
						<view class="address">
							<text>{{item.name}}</text>
							<text>{{item.number}}</text>
							<text>{{item.remark}}</text>
						</view>
						<u-icon name="edit-pen" :size="40" color="#999999" @click="editAddess(item)"></u-icon>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>

		<u-popup @close="closeAddressPopup" v-model="show" border-radius="10" width="95%" height="80%" mode="bottom">
			<view class="addForm">
				<u-form label-width="150" :model="form" ref="uForm">
					<u-form-item label="地址" prop="address">
						<u-input type="select" placeholder="请选择地址" v-model="form.address" :clearable="false"
							@click="addressShow=true" />
					</u-form-item>
					<u-form-item label="门牌号" prop="number">
						<u-input v-model="form.number" placeholder="请填写具体门牌号" :clearable="false" />
					</u-form-item>
					<u-form-item label="地址详情" prop="remark">
						<u-input v-model="form.remark" placeholder="请填写具体地址详情" :clearable="false" />
					</u-form-item>
					<u-form-item label="标签" prop="type">
						<uni-data-checkbox v-model="form.type" mode="tag" :localdata="labelRange"></uni-data-checkbox>
					</u-form-item>
					<u-form-item label="电话" prop="contact">
						<u-input v-model="form.contact" type="number" placeholder="请输入您的联系方式" :clearable="false" />
					</u-form-item>
					<u-form-item label="联系人" prop="linkman">
						<view style="display: flex;align-items: 
						center;">
							<u-input style="width: 200rpx;flex:1" v-model="form.linkman" placeholder="联系人"
								:clearable="false" />
							<uni-data-checkbox style="height: 50rpx;" v-model="form.title" :localdata="titleRange">
							</uni-data-checkbox>
						</view>
					</u-form-item>
					<u-form-item label="默认地址">
						<u-switch size="30" v-model="form.default"></u-switch>
					</u-form-item>
				</u-form>

				<view style="margin-top: 30rpx;">
					<u-button type="primary" shape="circle" @click="submitAddress(currentIndex)"
						v-if="currentIndex===0">修改地址</u-button>
					<u-button type="primary" shape="circle" @click="submitAddress(currentIndex)" v-else>添加地址</u-button>
				</view>
			</view>
		</u-popup>
		<u-select label-name="name" value-name="id" v-model="addressShow" :list="list" @confirm="confirmAddress">
		</u-select>
	</view>
</template>

<script>
	import uniDataCheckBox from "../../components/uni-data-checkbox/uni-data-checkbox.vue"
	const globalData = getApp().globalData;
	export default {
		components: {
			uniDataCheckBox
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				siteList: [],
				value: 0,
				list: [],
				titleRange: [{
					"value": 1,
					"text": "先生"
				}, {
					"value": 0,
					"text": "女士"
				}],
				labelRange: [{
					"value": 1,
					"text": "家"
				}, {
					"value": 2,
					"text": "公司"
				}, {
					"value": 3,
					"text": "学校"
				}],
				showModal: false,
				content: '是否删除该地址',
				addressList: [],
				show: false,
				editShow: false,
				addressShow: false,
				addressRange: [],
				currentItem: [],
				form: {
					linkman: '',
					contact: '',
					address_id: '',
					address: '',
					number: '',
					remark: '',
					id: '',
					type: 0,
					title: 1,
					default: false

				},
				currentAddress: [],
				current: 0,
				id: '',
				currentAddress: 0,
				currentItem: [],
				currentDefault: false,
				scrollHeight: 500,
				currentIndex: 0,
				url: '',
				rules: {
					contact: [{
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
					],
					address: [{
						required: true,
						message: '请输入地址',
						trigger: ['blur'],
					}],
					linkman: [{
						required: true,
						message: '请输入联系人',
						trigger: ['blur'],
					}],
					number: [{
						required: true,
						message: '请输入门牌号',
						trigger: ['blur'],
					}],
					remark: [{
						required: true,
						message: '请输入地址详情',
						trigger: ['blur'],
					}],
				}
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(options) {
			console.log(options);
			if (options.url) {
				this.url = options.url;
			}
			/* if(options.id){
				this.id=options.id;
			}*/
			this.getMemberAddress();
			this.getAddress()
			/*this.getAccountAddress(); */
		},
		methods: {
			confirmAddress(e) {
				this.form.address = e[0].label;
				this.form.address_id = e[0].value
			},
			setAddress(item) {
				uni.showModal({
					content: '是否设为当前收货地址?',
					success(res) {
						if (res.confirm) {
							uni.setStorageSync('jtjd_address', item);
							uni.navigateBack();
						}
					}
				})
			},
			closeAddressPopup() {
				this.form = {
					linkman: '',
					contact: '',
					address_id: '',
					address: '',
					number: '',
					remark: '',
					id: '',
					type: 0,
					title: 1,
					default: false
				}
			},
			submitAddress(index) {
				//index ====>为0 编辑  为 1添加
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let that = this;
						let data = {
							uid: globalData.uid,
							address_id: that.form.address_id,
							number: that.form.number,
							remark: that.form.remark,
							type: that.form.type,
							title: that.form.title,
							default: that.form.default,
							linkman: that.form.linkman,
							contact: that.form.contact,
						}
						if (index === 0) {
							data.id = that.form.id;
						}
						uni.request({
							method: 'POST',
							url: globalData.url3 + 'Config/SetMemberAddress',
							data,
							success(res) {
								uni.showToast({
									title: res.data.errMsg,
									icon: 'none'
								})
								that.show = false;
								that.editShow = false;
								that.getMemberAddress()
							}
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			chooseAddress() {
				let that = this;
				uni.chooseLocation({
					success(res) {
						console.log(res);
						that.form.address = res.address + res.name
					}
				})
			},
			deleteOptions(item) {

			},
			deleteAddress() {
				let that = this;
				uni.showModal({
					content: '是否删除该地址',
					success(res) {
						console.log(res);
						if (res.confirm) {
							uni.request({
								method: 'POST',
								url: globalData.url3 + 'Config/DeleteMemberAddress',
								data: {
									id: that.form.id,
									uid: globalData.uid,
								},
								success(res) {
									uni.showToast({
										title: res.data.errMsg,
										icon: 'none'
									})
									that.editShow = false;
									that.getMemberAddress();
								}
							})
						}
					}
				})
			},
			optionsAddress(index) {

			},
			closePopup() {

			},
			getMemberAddress() {
				let that = this;
				uni.request({
					url: globalData.url3 + 'Config/GetMemberAddressList',
					method: 'POST',
					data: {
						uid: globalData.uid,
					},
					success(res) {
						console.log(res);
						if (res.data.errCode === 0) {
							that.siteList = res.data.data;
						}
					}
				})
			},
			getAddress() {
				let that = this;
				uni.request({
					url: globalData.url3 + 'Config/GetAddressList',
					method: 'POST',
					data: {
						uid: globalData.uid,
					},
					success(res) {
						if (res.data.errCode === 0) {
							that.list = res.data.data;
						}

					}
				})
			},
			getAccountAddress() {

			},
			selectTap(id, index) {

			},
			editAddess(item) {
				// console.log(item)
				// this.form = item
				this.currentIndex = 0;
				this.form = {
					address_id: item.address_id,
					number: item.number,
					remark: item.remark,
					type: item.type,
					title: item.title,
					default: item.default,
					linkman: item.linkman,
					contact: item.contact,
				}
				this.show = true;
				/* this.currentItem=item; */
			},
			handleAddress(e) {

			},
			toAddSite() {
				this.currentIndex = 1;
				this.show = true;
			}
		}
	}
</script>

<style lang="scss">
	.item {
		padding: 25rpx;
		.top {
			display: flex;
			font-weight: bold;
			font-size: 34rpx;

			.phone {
				margin-left: 60rpx;
			}

			.tag {
				display: flex;
				font-weight: normal;
				align-items: center;

				text {
					display: block;
					width: 60rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #ffffff;
					font-size: 20rpx;
					border-radius: 6rpx;
					text-align: center;
					margin-left: 30rpx;
					background-color: rgb(49, 145, 253);
				}

				.red {
					background-color: red
				}
			}
		}

		.bottom {
			display: flex;
			margin-top: 20rpx;
			font-size: 28rpx;
			align-items: center;
			justify-content: space-between;
			color: #999999;

		}
	}

	.addSite {
		display: flex;
		justify-content: space-around;
		width: 600rpx;
		line-height: 80rpx;
		position: fixed;
		bottom: 15rpx;
		left: 80rpx;
		background-color: red;
		border-radius: 60rpx;
		font-size: 30rpx;

		.add {
			display: flex;
			align-items: center;
			color: #ffffff;

			.icon {
				margin-right: 10rpx;
			}
		}
	}

	.address-name {
		display: flex;
		width: 600rpx;

		.address-detail {
			font-weight: 700;
			font-size: 26rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.label {
		text-align: center;
		padding: 3 15rpx;
		font-size: 26rpx;
		width: 90rpx;
		background-color: #e9f2fd;
		color: #1678ff;
		margin-right: 10rpx;
		font-weight: bold;
	}

	.link {
		display: flex;
		margin-top: 10rpx;
		color: #bbbbbe;
		font-size: 24rpx;
	}

	.addForm {
		width: 100%;
		height: 100%;
		padding: 30rpx 60rpx;
	}

	.container {
		background-color: #F2f2f2;
	}

	.address-list {
		// width: 100%;
		// background-color: #fff;
		// margin-top: 20upx;
		width: 100%;
	}

	.address-list .a-address {
		width: 720upx;
		margin-left: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx 0;
		border-bottom: 1upx solid #eee;
	}

	.a-address .left-text {
		width: 610upx;
		box-sizing: border-box;
		padding-left: 58upx;
	}

	.a-address .left-text.active {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAoCAYAAACrUDmFAAAAAXNSR0IArs4c6QAABTFJREFUaAXtmW9MHEUUwN8b7oAColQId2ia2qb9YEwa0g/6ocT7ywXi1Q8CFdMEohaDaKNo1CYmEhP/pzFREmttLEbTpsG2SKVnODjQEGNSrYlJrY2mxkS55U/BPz0L3O2ObzCL273d7V054a7pfZmZ92bevt/M2zdvAeEa+v0RCKyNyQvdyHmQI56zlZW78Frhmwi4tygyHOOcb1CZbMxezdRBLreS39Msy/ClFg4Az1XYbGdtuQzGGxvzpJkLrymK8pSWAxF+5vkYwJOh+ZwN0T+DwfLY3xePcOAeHdxP+fY17ptDoV+FPCcBx2vdW0GBY8D5Oi2cCEs7s3kqwuFxVZ5z72DU62oBmY/p4RDw+7xidrcWLqdOkLe12aXzP+6lRPK4ejpqS3DfQX6hzxkKTakytc2JEJ3Y7q2UY3IvOV2jOr7UInxbwvP8pcPDF5Zkmk7Wh6hU675TjinfkM9JcJQtTxUVFHvN4ARnVgPS/fawosAXAPwWzaEsdgnuqwKw+W8aGJjV67TjrAxRut/yo7PT3ZRIdmmdXeojjNmLSusr+vv/WpKZdLIOcMrvr0rw+FHO4S4jn+nkRpHl3+MYHIwZ6fWyrArRSZ9vW0JJnDaDo1t7yFFWUZ8qnIDNGsCo39Uh80SEKpNK/SmIMZ3cZ85b1wext/eSkd5MtuohyltbC6XfftnHFd5i6iTCpw77mgYMhebN5pjJVxVwxudbNweyKLm2mjlI8uPOjZt34P79cYs5pqpVC9FowOueh8TXVnCI2OuscTVdLZygXgQUZdBEnWcj7+paEeBxr7sTZCVMyaTCdOsRDznKypuxqythOicFBVLmqpYhMUAPc9KOnWeI7ZXhyGAKa9OewoPBouiliwfo1JqtFtN70+OocT1EcIrVvFR0OO5znQYO1drJBHqwsOTGzrK+vt+18uX0pdra2xQ5fpyqki1XsHOAwvKRTMCJ5xCgO0Y7WqR/KKXlKFXp7Y6hkU/0unTHEz53QAY4RM9Za7WWNvYdRzjSQS23mpeOjlE4HDFaIEJW4byPvr8OR+vqzN8Vo8UameTzPEdxdvJKcMDwLefQyKOZhBNuIK+rK5Dic+KvUfUav/TdacbYbtrdw3qF2XiysbFEnp3uIbv3mc1R5Qhsr3M48rQ6zmS7eA+K4laane4lZ7ZbGafd7behrV3/1axfM+n3b5KVRB9VJbfrdUljhFerhkb3JMkzJFi8Fqj8WXBs2NRAAEet7IoNiCvxM5LP/aDZvGitt4FKrlOpwNE7/uL/CSd8vKySoXvQJo19/hGB7DADUOXk3Blk/D3k+IOCMEfZ8Q56b++njLxNnWPZIjxPcC9ZzsmA8jJAYU/8rXFiZqqHEsPODNg3NIEMn3WGR143VGZYmFS5ULjKlTWuFgrXgxl+1r/mEDtXCk48MOkEVSgKU4z6PfsovbepsuW09CAOyHY7hyLdy7GT7lpTQGFIQNI99jYljI50DWvnCzjOoL0qPPquVr4SfUtA1QEq596k/X9CHafTUqhTDoJdVBG9n866TM1NegeNDFO2e5IcfcNIZyWjNTL9n651teCEbykBiolURj3DkKWc1unUEsjYzqpw5EOxfrV+KYWo1rmoz/UC3XddWpm+T0bjkJf3gHNw+GO9bqXHaQMKByWve48C/GVDZxEXKCyaMvEVYmg/TWHKIaq16xgeeQUZPEYyqmD++9En1hRwdm+2wAnPruoEVaQpr3dzHHkTXQLrqWw7W1x4wwelJ05Mq/rr7fUdWP4O/AP2Ss0GlCgUhgAAAABJRU5ErkJggg==) no-repeat left center;
		background-size: 28upx auto;
	}

	.a-address .left-text .name-tel {
		margin-bottom: 20upx;
	}

	.a-address .left-text .address-box {
		font-size: 24upx;
		color: #888888;
		line-height: 36upx;
	}

	.a-address .right-edit {
		width: 109upx;
		height: 100%;
		padding: 50upx 0 50upx 58upx;
		box-sizing: border-box;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAABPhJREFUeAHtnE1oE0EUx80HQW39SCvYgBVBqhUU+l1FD1ZFPIgnQdDiRfGmh168eBDR4k1B8OLHSVTQg6gnUQ+CaNLWQGu8lSqtrZQKgk1jkzb1/zSzvKyTIO0mM7uZgc28eftm571fZnaTzGR8y4qkRCJRPTMzswsmG3HULiwsBIqYO3bK5/PNoa1oR0fHG8cuWuBCIyMjyycnJy+hzW6YIPPdr6uru1BfX5+iKj57PTjm6+vrOwz9WchdyIN2mzKWL3R2dl4pVXujo6MrJiYmniHO/bwNQLqFN+cM6fIA9ff3b85ms7dRYS+voFCehqNr4HDWaR8KwaF20F4mHA6vamhomLV6RzQabZufn3+B82GnnVnC9RaWULdg1WJwcpWCYBGC/BcQ4GxB4RWO1TkDLTK8k71O957/gEOxv25sbPxJQhDDyR+Lxe5ALgRnEE4OwG7Y7/enqVIZ0hzaiLW3t791si2CMz4+/hzX3FfkumPBYPCUOB/EDfkgCnuEQuSAMoSjB06+FDo356LnIIaicAKBwN6WlpYvIlbqQSdFQeQAk4C+CzfI70Ln5lzAQUx5TytbTGMEp62tbZjrg4DRiopctwxD6RQMKx4OQfEDDn0ItBKAzba2tsYshYuFpfQcEbYfwnJRyOUpQMrvUjYDNxSdgENxEiDPJafgEBjPAXISjucAOQ3HU4BKAcczgEoFxxOASgnH9YBKDcfVgMoBx7WAygWHAFk/mFHBDYng/M9PFrIvnouJz1UfFMsNh4C6BpAKOK4BpAqOKwCphKM9INVwtAakAxxtAekCR0tAOsHRDpBucLQCpCMcbQDpCocAKf8upgOcoaGh9VgHdRrzgTSRehcTpqMEh5LSrxq0eKmcXzz/hpz/Go/H1wJOP7SXsfTnIvI41irUCSulgKampsihfcIZSS6dDpbYLVqVyWRosdgGcQH0oFrMCx4VZaWA4Mxx4YgkLzmcXJu19rbRk9YJnVJAcKLQDG654AgOBXOlgNCD7kk80wYO+aYUUE1NzSU8OW7Aj18Y97QO8QV+CdxtX4JCjqpKSh/ztEgSgZ9DT+oZGBgIAcyMKhCF2lUKSDiF3kNL7ujQLikdYtrRkDhkAEmgcJUBxGlIZANIAoWrDCBOQyIbQBIoXGUAcRoS2QCSQOEqA4jTkMgGkAQKVxlAnIZENoAkULjKAOI0JLIBJIHCVQYQpyGRDSAJFK4ygDgNiWwASaBwlQHEaUhkA0gChav8uekWS4cZhoqChngDVvA5gTMhGN9sBqsHBwd12p7C5p6zRcDI+1Nz7uo/RCv0r+e8/4nTiVQq1S0MKiDfbo8RTCaEjobYU1FgeW9uPw+m8p6IXSe2IiraAigvgcl7ofCHQqEHUNAMJ0/VKDzBdjmNXOklGZtHhdBTruOw33M/5S2gampq+orAr0mC34YtYj6gJ53nC4okdq5T0eiYnp6mjZUO2Z3HWoGbXPdngyXaiiuZTL5DhX/GozBGL0tCzoiyi3PqOStl/iPG4UgkskNsz0U21g5UWIq2KZ1O09hbL6vsdR3g0Jt/AMPrDY/VGn/Nzc2fcT/aCcOP3KBC5Hn0qhN2OBS7BYgKBKmqqmoXIF1F8c8ucKT3cqJhhWM/NpN7JIvTGmL2k3iCRUD1GNbrHcG5BhwRHP986rTX070MGBnENQ4/E7ghP8SWgI/5Pcfu/2//c4lF4CDN7wAAAABJRU5ErkJggg==) no-repeat 43upx center;
		background-size: 35upx auto;
	}

	.bottom-box {
		position: fixed;
		width: 100%;
		bottom: 0;
		padding: 0 20rpx;
		font-size: 28upx;
		color: #000000;
		border-top: 1upx solid #eee;
		height: 100upx;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>

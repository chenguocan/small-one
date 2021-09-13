<template>
	<view class="container">
		<view style="height: 20rpx;"></view>
		<scroll-view class="address-list" scroll-y :style="{height:scrollHeight+'px'}">
			<view class="a-address" v-for="(item,index) in addressList" :key="index">
				<view>
					<view class="address-name">
						<!-- <view class="label">{{item.remark}}</view> -->
						<text class="address-detail">{{item.name}}-{{item.address}}</text>
					</view>
					<!-- <view class="link">
						<view>
							{{item.link}}
						</view>
						<view>
							{{parseInt(item.title)===0?'先生':'女士'}}
						</view>
						<view style="margin-left: 20rpx;">
							{{item.phone}}
						</view>
					</view> -->
					<!-- <view style="margin-top: 10rpx;" v-if="url">
						<u-button type="primary" shape="circle" size="mini" @click="setAddress(item)">设为地址</u-button>
					</view> -->
				</view>
				<view style="display: flex;align-items: center; margin-right: 20rpx;">
					<u-icon name="edit-pen" size="40" color="#d0d0d0" @tap="editAddess(item)"
						style="margin-right: 20rpx;"></u-icon>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-box" @click="addAddess">
			<view style="display: flex;align-items: center;">
				<u-icon name="plus-circle" size="36"></u-icon>
				新增收货地址
			</view>
			<view>
				<u-icon name="arrow-right" size="36" color="#d0d0d0"></u-icon>
			</view>
		</view>

		<u-popup @close="closeAddressPopup" v-model="show" mode="center" border-radius="10" closeable width="90%"
			height="70%">
			<view class="addForm">
				<u-form label-width="100" :model="form" ref="uForm">
					<u-form-item label="电话" prop="number">
						<u-input v-model="form.number" type="number" placeholder="请输入您的联系方式" :clearable="false" />
					</u-form-item>
					<u-form-item label="地址" prop="address">
						<u-input type="select" placeholder="请输入填写/选择地址" v-model="form.address" :clearable="false"
							@click="addressShow=true" />
					</u-form-item>
					<u-form-item label="单元">
						<u-input v-model="form.remark" placeholder="请补充具体地址" :clearable="false" />
					</u-form-item>
				</u-form>
				<view style="width: 500rpx;margin-top: 20rpx;display: flex;justify-content: space-between;">
					<view style="width: 200rpx;">

					</view>
					<view style="width: 200rpx;">
						<u-button type="primary" @click="submitAddress(0)">提交</u-button>
					</view>
				</view>
			</view>
		</u-popup>


		<u-popup @close="closeAddressPopup" v-model="editShow" mode="center" border-radius="10" closeable width="90%"
			height="70%">
			<view class="addForm">
				<u-form  label-width="150" :model="form" ref="editForm">
					<u-form-item label="地址" prop="address">
						<u-input type="select" placeholder="请输入填写/选择地址" v-model="form.address" :clearable="false"
							@click="addressShow=true" />
					</u-form-item>
					<u-form-item label="单元">
						<u-input v-model="form.remark" placeholder="请补充具体地址" :clearable="false" />
					</u-form-item>
					
					<u-form-item label="电话" prop="number">
						<u-input v-model="form.number" type="number" placeholder="请输入您的联系方式" :clearable="false" />
					</u-form-item>
					
					<u-form-item label="联系人" prop="number">
						<u-input v-model="form.number" type="number" placeholder="请输入您的联系方式" :clearable="false" />
					</u-form-item>
					
					<u-form-item label="联系方式" prop="number">
						<u-input v-model="form.number" type="number" placeholder="请输入您的联系方式" :clearable="false" />
					</u-form-item>
					
				</u-form>
				<view style="width: 500rpx;margin-top: 20rpx;display: flex;justify-content: space-between;">
					<view style="width: 200rpx;">
						<u-button type="error" @click="deleteAddress()">删除</u-button>
					</view>
					<view style="width: 200rpx;">
						<u-button type="primary" @click="submitAddress(1)">提交</u-button>
					</view>
				</view>
			</view>
		</u-popup>

		<u-select label-name="name" value-name="id" v-model="addressShow" :list="list" @confirm="confirmAddress"></u-select>
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
				value: 0,
				list: [],
				titleRange: [{
					"value": 0,
					"text": "先生"
				}, {
					"value": 1,
					"text": "女士"
				}],
				labelRange: [{
					"value": "家",
					"text": "家"
				}, {
					"value": "公司",
					"text": "公司"
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
					address_id: '',
					address:'',
					number: '',
					remark:'',
					id:'',
					
				},
				currentAddress: [],
				current: 0,
				id: '',
				currentAddress: 0,
				currentItem: [],
				currentDefault: false,
				scrollHeight: 500,
				url: '',
				rules: {
					number: [{
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
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			this.$refs.editForm.setRules(this.rules);
		},
		onLoad(options) {
			console.log(options);
			if (options.url) {
				this.url = options.url;
			}
			console.log('123');
			let that = this;
			uni.getSystemInfo({
				success(res) {
					that.scrollHeight = res.windowHeight * 0.85
				}
			})
			/* if(options.id){
				this.id=options.id;
			}*/
			this.getMemberAddress();
			this.getAddress()
			/*this.getAccountAddress(); */
		},
		methods: {
			confirmAddress(e){
				this.form.address=e[0].label;
				this.form.address_id=e[0].value
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
					address_id: '',
					number: '',
					remark:'',
					id:'',
					address:'',
				}
			},
			submitAddress(index) {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let that = this;
						let data = {
							uid: globalData.uid,
							address_id: that.form.address_id,
							number: that.form.number,
							remark:that.form.remark
						}
						if (index === 1) {
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
							that.addressList = res.data.data;
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
							console.log('list',that.list)
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
				this.form = {
					address_id: item.address,
					number: item.number,
					remark:item.remark,
					id:item.id,
					address:item.name,
				}
				this.editShow = true;
				/* this.currentItem=item; */
			},
			handleAddress(e) {

			},
			addAddess() {
				this.show = true;
			}
		}
	}
</script>

<style lang="scss">
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
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.container {
		background-color: #F2f2f2;
	}

	.address-list {
		width: 100%;
		background-color: #fff;
		margin-top: 20upx;
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

<template>
	<view class="wrap">
		<view class="inputText">
			<u-input :border="border" placeholder="名称" v-model="model.name" type="text" class="input"></u-input>
		</view>
		<view class="inputText">
			<u-input :border="border" placeholder="电话号" v-model="model.phone" type="number" class="input"></u-input>
		</view>
		<view class="cont">
			企业认证
		</view>
		<view class="inputText">
			<u-input :border="border" placeholder="公司全称" v-model="model.company" type="text" class="input"></u-input>
		</view>
		<view class="inputText">
			<u-input :border="border" placeholder="法人联系人" v-model="model.linkMan" type="text" class="input"></u-input>
		</view>
		<view class="picture">
			<view class="left">
				<view class="left_title">
					营业执照
				</view>
				<view>
					<u-toast ref="uToast"></u-toast>
					<u-upload ref="uUpload" :custom-btn="customBtn" :action="action" :auto-upload="autoUpload" :file-list="fileList"
					 :show-progress="showProgress" :deletable="deletable" :max-count="maxCount" @on-list-change="onListChange">
						<view v-if="customBtn" slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
							<u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon>
						</view>
					</u-upload>
					<u-button :custom-style="{marginTop: '20rpx'}" @click="upload" class="uploadButton">上传</u-button>
				</view>
			</view>
			<view class="right">
				<view class="right_title">
					法人证件照
				</view>
				<view>
					<u-toast ref="uToast"></u-toast>
					<u-upload ref="uUpload1" :custom-btn="customBtn" :action="action1" :auto-upload="autoUpload" :file-list="fileList1"
					 :show-progress="showProgress" :deletable="deletable" :max-count="maxCount" @on-list-change="onListChange1">
						<view v-if="customBtn" slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
							<u-icon name="photo1" size="60" :color="$u.color['lightColor']"></u-icon>
						</view>
					</u-upload>
					<u-button :custom-style="{marginTop: '20rpx'}" @click="upload1" class="uploadButton">上传</u-button>
				</view>
			</view>
		</view>
		<u-button @click="submit" class="sumbitButton">提交</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			let that = this;
			return {
				border: false,
				model: {
					name: '',
					phone: '',
					linkMan: '',
					company: ''
				},
				/////////////////////////////////
				customBtn: false,
				deletable: true,
				fileList: [],
				fileList1: [],
				action: 'http://www.tp5.com',
				action1: 'http://www.tp5.com',
				autoUpload: false,
				showProgress: true,
				maxCount: 1,
			};
		},
		onLoad() {

		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			}
		},
		methods: {
			onListChange(lists) {
				// console.log('onListChange', lists);
				this.lists = lists;
			},
			onListChange1(lists) {
				// console.log('onListChange', lists);
				this.lists = lists;
			},
			upload() {
				this.$refs.uUpload.upload();
			},
			upload1() {
				this.$refs.uUpload1.upload();
			},
			submit() {
				console.log(this.model);
			},
			errorChange(index) {
				if (index == 0) this.errorType = ['message'];
				if (index == 1) this.errorType = ['toast'];
				if (index == 2) this.errorType = ['border-bottom'];
				if (index == 3) this.errorType = ['border'];
			}
		}
	};
</script>

<style scoped lang="scss">
	page {
		background: #f5f5f5;
	}

	.wrap {
		width: 698rpx;
		margin: 0 auto;
	}

	.cont {
		height: 86rpx;
		display: flex;
		margin: 0 auto;
		font-size: 32rpx;
		justify-content: center;
		align-items: center;
		line-height: 57rpx;
		margin-top: 40rpx;
		border-top: 1px solid rgba(0, 0, 0, .1);
		border-bottom: 1px solid rgba(0, 0, 0, .1);
	}

	.uploadImg {
		margin-left: 117rpx
	}

	.inputText {
		// border: 1px solid black;
		background-color: #DDDDDD;
		margin-top: 20rpx;
		min-height: 98rpx;
		border-radius: 15rpx;
	}

	.input {
		position: relative;
		top: 13rpx;
		left: 15px;
	}

	.uploadButton {
		width: 150px;
	}

	.sumbitButton {
		margin-top: 57rpx;
		width: 179rpx;
		height: 79rpx;
	}

	.u-up {
		margin-top: 20rpx;
	}

	.picture {
		display: flex;
		margin-top: 73rpx;
	}

	.left {
		width: 50%;
		text-align: center;
	}

	.right {
		width: 50%;
		text-align: center;
	}
</style>

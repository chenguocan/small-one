<template>
	<view>
		<view class="Background">
		</view>
		<view class="cont">
			<view class="form">
				<view class="box">
					<view class="label_name">
						预定类型:
					</view>
					<radio-group @change="radioChange" class="radio_group">
						<label class="radio_label"  v-for="(item, index) in items" :key="index">
							<view class="label_name">{{item.name}}</view>
							<view>
								<radio :value="item.id"  :disabled="index===0?false:true" :checked="index == current" class="rio" />
							</view>
						</label>
					</radio-group>
				</view>

				<view class="box">
					<view class="label_name">
						房间类型:
					</view>
					<view class="number_view">
						<picker @change="bindPickerChange"  :value="currentIndex===-1 ? index :currentIndex" :range="array">
						    <view class="number">{{currentIndex===-1 ? array[index] :array[currentIndex]}}</view>
						</picker>
						<!-- <input class="number" type="number" placeholder="请输入人数"  v-on:input="test($event)"/> -->
					</view>
				</view>
				<view class="box">
					<view class="label_name">
						来店日期:
					</view>
					<view class="start">
						<picker class="start-picker" mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDate1Change">
							<view class="title">{{date1}}</view>
						</picker>
					</view>
					<view class="start-time" v-if="current==1">
						<picker mode="time" :value="time1" :start="startTime" end="23:59" @change="bindTime1Change">
							<view>{{time1}}</view>
						</picker>
					</view>
				</view>
				
				<view class="box">
					<view class="label_name">
						{{timeType===0?'入住天数:':'离店日期:'}}
					</view>
					<view class="end">
						<picker class="start-picker" mode="date" v-if="timeType===1" :value="stopDate"  @change="stopChange">
							<view class="title">{{stopDate}}</view>
						</picker>
						<picker class="end-picker" v-else-if="timeType===0" @change="bindEndChange" :value="endTimeIndex" :range="endTimeArr">
							<text class="number">{{endTimeArr[endTimeIndex]}}</text><text>天</text>
						</picker>
						
						
						
						<!-- <input v-else-if="current==1" class="number" type="number" placeholder="请输入大于0的整数" :value="endTimeInputValue" @input="changeInputValue" />
						
						<input v-else-if="current==2" class="number" type="number" :value="endTimeKaZuoValue" disabled="true"></input> -->
						<!-- <picker mode="date" :value="date2" :start="startDate" :end="endDate" @change="bindDate2Change">
							<view class="title">{{date2}}</view>
						</picker> -->
					</view>
					<!-- 		<picker class="end-picker" v-if="current==0" @change="bindEndChange" :value="endTimeIndex" :range="endTimeArr">
								<view class="number">{{endTimeArr[endTimeIndex]}}</view>
							</picker> 
					<!-- <text>天</text> -->
					<!-- <text v-if="current==0">个月</text>
					<text v-else-if="current==1">小时</text>
					<text v-else-if="current==2">天</text> -->
					<!-- <view class="end-time" v-if="current==1">
						<picker mode="time" :value="time2" :start="startTime" end="23:59" @change="bindTime2Change">
							<view>{{time2}}</view>
						</picker>
					</view> -->
				</view>
			</view>
		</view>
		<view class="button" @click="sumbit">
			预定
		</view>
	</view>
</template>

<script>
	import dayjs from "dayjs"
	const globalData = getApp().globalData;
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			});
			const currentTime = this.getTime();
			const stopTime=this.getStop();
			return {
				params:{
					day: true,
				},
			/* 	endYear:'',
				endMonth:'',
				endDay:'', */
				title: 'picker',
				array: [],
				arrayId: [], // 存储人数数组的id
				endTimeArr: [], // 结束时间数组
				index: 0, // 开始时间的索引
				endTimeIndex: 0, // 结束时间的索引
				endTimeInputValue: 1, // input 输入框的值
				endTimeKaZuoValue: 1, // 卡座的结束时间值
				date1: currentDate,
				date2: currentDate,
				time1: currentTime,
				time2: currentTime,
				stopDate:stopTime,
				currentIndex:-1,
				length:0,
				shows: 'show',
				timeType:0,
				items: [/* {
						value: 'USA',
						name: '工位区',
						checked: 'true'
					},
					{
						value: 'CHN',
						name: '会议区'
					} */
				],
				current: 0,
				stop:'',
			}
		},
		async onLoad() {
			await this.getRoomType();
			this.getRoomCycle();
			this.changeType()
	
		},
		onShow() {
			uni.showToast({
				title:'暂未授权',
				icon:'none',
				duration:1500,
			})
			setTimeout(function(){
				uni.switchTab({
					url:'index',
				})
			},1500);
			this.changeType();
			this.date1 = this.getDate();
			this.date2 = this.getDate();
			this.time1 = this.getTime();
			this.time2 = this.getTime();
		},
		onHide(){
			uni.removeStorageSync('currentIndex');
		},
		onUnload(){
			uni.clearStorageSync();
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			startTime() {
				return this.getTime();
			}
		},
		methods: {
			//展示Picker
			//更换类型
			toggleType(current,index){
				if(this.items.length!==0){
					const list = this.items[current].list;
					this.current=current;
					this.index = index;
					let array = [];
					let arrayId = [];
					if (current == 1) {
						this.date1 = this.getDate();
						this.date2 = this.getDate();
						this.time1 = this.getTime();
						this.time2 = this.getTime();
					}
					console.log(list);
					for (let item of list) {
						array.push(item.name);
						arrayId.push(item.id);
					}
					this.array = array;
					this.arrayId = arrayId;
					console.log('arrayId='+this.arrayId);
				}
			},
			//更新类型
			changeType(){
				let index=uni.getStorageSync('currentIndex');
				let current;
				if(index>=0 && index!==''){
					let currentIndex=uni.getStorageSync('currentIndex');
					if(uni.getStorageSync("id")){
						current=1;
						index=this.arrayId.findIndex(item=>parseInt(item)===currentIndex);
					}else{
						current=0;
						if(this.items.length!==0){
							const list = this.items[current].list;
							let arrayId=[];
							for (let item of list) {
								arrayId.push(item.id);
							}
							this.arrayId = arrayId;
							index=this.arrayId.findIndex(item=>parseInt(item)===currentIndex);
						}
					}
					this.toggleType(current,index)
				};	
			},
			// 人数选择器
			bindPickerChange: function(e) {
				console.log(e);
				// console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value;
				console.log(this.index);
			},
			
			bindEndChange: function(e) {
				this.endTimeIndex = e.target.value;
			},
		
			/**
			 * @param {Object} e
			 */
			changeInputValue(e) {
				const value = e.detail.value;
				this.endTimeInputValue = value;
				console.log('e', value);
			},
			/**
			 * 日期选择器1
			 */
			bindDate1Change: function(e) {
				let endTime=new Date(Date.parse(this.stopDate));
				let startTime=new Date(Date.parse(e.target.value));
				if(startTime>=endTime){
					this.stopDate=dayjs(startTime).add(1,'day').format('YYYY-MM-DD')
				}
				this.date1 = e.target.value
			},
			/**
			 * 日期选择器2
			 */
			bindDate2Change: function(e) {
				this.date2 = e.target.value
			},
			/**
			 * 时间选择器1
			 */
			bindTime1Change: function(e) {
				this.time1 = e.target.value
			},
			
			/**
			 * 时间选择器2
			 */
			bindTime2Change: function(e) {
				this.time2 = e.target.value
			},
			stopChange:function(e){
				let endTime=new Date(Date.parse(e.target.value));
				let startTime=new Date(Date.parse(this.date1));
				console.log(endTime>startTime);
				if(endTime > startTime===false){
					return uni.showToast({
						title:'起始日期不能大于结束日期'
					})
				}
				this.stopDate=e.target.value;
			},
			/**
			 * 格式化日期
			 * @param type ，两种类型：start表示开始时间，end表示结束时间
			 */
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year;
				} else if (type === 'end') {
					year = year + 10;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			
			/**
			 * 格式化时间
			 */
			getTime() {
				const date = new Date();
				let hours = date.getHours();
				let minutes = date.getMinutes();
				hours = hours > 9 ? hours : '0' + hours;;
				minutes = minutes > 9 ? minutes : '0' + minutes;
				return `${hours}:${minutes}`;
			},
			getStop(){
				let now=dayjs().add(1,'day').format('YYYY-MM-DD');
				return now;
			},
			/**
			 * 判断大于0的整数
			 */
			isPositiveInt (number) {
				return  /^\+?[1-9]\d*$/.test(number);
			},
			
			/**
			 * 获取房间周期
			 */
			getRoomCycle () {
				const that = this;
				let openId=globalData.openid;
				uni.request({
					method: 'POST',
					url: globalData.api + '/MCR/GetRoomCycle',
					data: {
						appid: globalData.appid,
						openid:openId,
					},
					success: function (res) {
						console.log('GetRoomCycle', res);
						if (res.data.errCode == 0) {
							that.endTimeArr=res.data.data;
						}
					}
				})
			},
			
			
			// 切换区域
			radioChange: function(e) {
				const id = e.detail.value;
				let current = this.current = parseInt(id - 1);
				// current = current == 0 ? 1 : 0;
				const list = this.items[current].list;
				this.index = 0;
				let array = [];
				let arrayId = [];
				this.getTimeType();
				if (current == 1) {
					this.date1 = this.getDate();
					this.date2 = this.getDate();
					this.time1 = this.getTime();
					this.time2 = this.getTime();
				}
				
				for (let item of list) {
					array.push(item.name);
					arrayId.push(item.id);
				}
				this.array = array;
				this.arrayId = arrayId;
				console.log(array);
				console.log(this.arrayId);
			},
			
			/**
			 * 比较两个日期大小
			 * @param date1 日期1
			 * @param date2 日期2
			 * @return boolean
			 */
			dateCompare: function (date1, date2) {
			    let oDate1 = new Date(date1);
			    let oDate2 = new Date(date2);
			    return oDate1.getTime() <= oDate2.getTime();
			},

			sumbit(){
				const current = this.current;
				const items = this.items;
				
				const startDate = this.date1;
				const endDate = this.date2;
				const group = this.items[current].id;
				const type = this.arrayId[this.index];
				const timeType=this.timeType;
				
				const endTimeInputValue = this.endTimeInputValue;
				const endTimePickerValue = this.endTimeArr[this.endTimeIndex];
				
				const startTime = startDate + ' ' + this.time1;
				const endTime = endDate + ' ' +  this.time2;
				let start = current == 0 || current == 2 ? startDate : startTime;
				let arg='';
				let value='';
				let data={};
				let stop='';
				if(timeType===0){
					arg='length',
					value=this.endTimeArr[this.endTimeIndex];
					data = {
						start: start,
						group: group,
						type: type,
						length:value,
					}
				}else{
					arg='stop',
					value=this.stopDate;
					data = {
						start: start,
						group: group,
						type: type,
						stop:value,
					}
				}
				console.log(arg);
				/* let stop = current == 0 || current == 2 ? endTimePickerValue : endTimeInputValue; */
				/* if (current == 2) stop = this.endTimeKaZuoValue; */
				// const start = current == 0 ? startDate : startTime;
				// const stop = current == 0 ? endDate : endTime;
				console.log(data);
				console.log(start,value,group,type);
				if (start != '' && value != '' && group != '' && type >= 0) {
					if (value) {
						uni.navigateTo({
							url: '../reserve/reserve?start=' + start + '&group=' + group + '&type=' + type +'&'+arg+'='+value
							
						});
					} else {
						uni.showToast({
						    title: '结束时间请输入大于1的整数',
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
					    title: '参数不能为空',
						icon: 'none'
					});
				}
			},
			
			/**
			 * 获取房间分组
			 */
			async getRoomType() {
				let that = this;
				let openId=globalData.openid;
				const [err,res]=await uni.request({
					method: 'POST',
					url: globalData.api + '/MCR/GetRoomType',
					data: {
						appid: globalData.appid,
						openid:openId
					},
				})
				console.log('GetRoomType', res);
				let items = [];
				if (res.data.errCode == 0) {
					const resData = res.data.data;
					console.log(resData);
					for (let index in resData) {
						let item = resData[index];
						items[index] = {};
						items[index].id = item.id;
						items[index].name = item.name;
						items[index].datetimetype=item.datetimetype;
						// items[index].time = item.time;
						items[index].list = item.list;
					}
					that.items = items;
					const list = items[that.current].list;
					that.timeType=parseInt(items[that.current].datetimetype);
					let array = [];
					let arrayId = [];
					for (let item of list) {
						array.push(item.name);
						arrayId.push(item.id);
					}
					that.array = array;
					that.arrayId = arrayId;
					console.log(that.array);
					console.log(that.arrayId);
					console.log(that.items);
					// console.log('this.item', this.items);
			}
		}
	},
}
</script>

<style scoped>
	page {
		background-color: #F1F2F2;
		/* padding: 285rpx 0 0 53rpx; */
		/* background: url(../../static/slices/office.png); */
		/* background-size: 750rpx 10rpx; */

	}

	.Background {
		background: url("https://office-lot.oss-cn-shenzhen.aliyuncs.com/icon/office.png") no-repeat;
		background-size: cover;
		width: 100%;
		height: 521rpx;
	}

	.cont {
		width: 675rpx;
		height: 784rpx;
		padding: 175rpx 0 0 135rpx;
		background: white;
		border-radius: 21rpx;
		position: absolute;
		left: 44rpx;
		top: 174rpx;
		display: flex;

	}

	.form {
		width: 100%;
		/* border: 1px solid black; */
		/* display: flex; */
		/* flex: wrap; */

	}

	.box {
		height: 50rpx;
		display: flex;
		width: 100%;
		/* border: 1px solid black; */
		margin-top: 69rpx;
	}

	.radio_label {

		display: flex;
		/* margin-left: 13rpx; */
	}

	.radio_group {
		display: flex;
		margin-left: 45rpx;
	}

	.label_name {
		margin: auto 0;
	}

	.number_view {
		display: flex;
		align-items: center;
		text-align: center;
		/* border: 1px solid black; */
		height: 45rpx;
		width: 246rpx;
		margin-left: 45rpx;
		background: #F1F2F2;
		border-radius: 7rpx;
	}
	
	.number_view picker {
		width: 100%;
		text-align: center;
	}
	
	.number {
		width: 100%;
		height: 100%;
		font-size: 21rpx;
		text-align: center;
	}

	.rio {
		transform: scale(0.6);
	}

	.start, .end {
		/* border: 1px solid #000000; */
		/* z-index: 7; */
		height: 47rpx;
		width: 246rpx;
		margin-left: 45rpx;
		background: #F1F2F2;
		border-radius: 7rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: gray;
		font-size: 20rpx;
		/* line-height: -15rpx; */
	}
	.select-end{
		height: 47rpx;
		width: 100rpx;
		margin-left: 45rpx;
		background: #F1F2F2;
		border-radius: 7rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: gray;
		font-size: 20rpx;
	}
	.start > .start-picker,
	.end > .end-picker {
		width: 100%;
		text-align: center;
	}
	.start-time, .end-time {
		height: 47rpx;
		width: 100rpx;
		margin-left: 10rpx;
		background: #F1F2F2;
		border-radius: 7rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: gray;
		font-size: 20rpx;
	}

	/* .title{
		z-index: -1rpx;
	} */
	.button {
		display: flex;
		position: absolute;
		top: 974rpx;
		left: 94rpx;
		width: 561rpx;
		height: 70rpx;
		align-items: center;
		justify-content: center;
		background-color: #1876FE;
		border-radius: 30rpx;
	}
</style>

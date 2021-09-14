const globalData = getApp().globalData;
export const ticketMixin={
	data(){
		return{
			couponList:[],
		}
	},
	async created(){
		await this.$onLaunched;
		this.getTickets()
	},
	methods:{
		getTickets() {
			let that = this;
			uni.request({
				method: 'POST',
				url: globalData.url3+'/ticket/GetTickets',
				data: {
					uid: globalData.uid,
					state: "1"
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
	}
}
<template>
	<view>
		<u-field
			v-model="money"
			label="金额"
			type="number"
			placeholder="请输入充值金额"
		>
		</u-field>
		<u-button type="success">充值</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: '',
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

<template>
<!--pages/order/order.wxml-->
<view class="container">
  <view id="top">
    <view id="name">餐厅</view>
    <!-- <view id="orderButton">继续点餐</view> -->
  </view>
  <view id="middle">
    <!-- 未提交的订单 -->
    <view id="unsubmit" class="order-box">
      <view class="title">
        已点餐品
      </view>
      <view class="menu">
        <view v-for="(i, index) in unsubmitted" :key="index" class="list">
          <view class="food-name">{{i.name}}<span class="unit">/份</span></view>
          <view class="count">×{{i.count}}</view>
          <view class="price">￥{{i.price*i.count}}</view>
        </view>
      </view>
    </view>
    <view id="total">
      总价<text class="symbol">￥</text><text class="total-price">{{total}}</text>
    </view>
    <!-- 其它消费者点选的餐品 -->
    <view id="other" class="order-box">
      <view class="title">
        您本次点餐期间，其它消费者点选的餐品
      </view>
      <view class="menu">
        <view v-for="(i, index) in other" :key="index" class="list">
          <view class="food-name">{{i.name}}<span class="unit">/{{i.unit}}</span></view>
          <view class="count">×{{i.count}}</view>
          <view class="price">￥{{i.current_price}}</view>
        </view>
      </view>
    </view>

    <!-- 已提交菜品 -->
    <view id="submitted" class="order-box">
      <view class="title">
        已提交餐品
      </view>
      <view class="menu">
        <view v-for="(i, index) in submitted" :key="index" class="list">
          <view class="food-name">{{i.name}}<span class="unit">/{{i.unit}}</span></view>
          <view class="count">×{{i.count}}</view>
          <view class="price">￥{{i.current_price}}</view>
        </view>
      </view>
    </view>
  </view>
  <view id="bottom">
    <view class="order-price"><text class="symbol">￥</text><text class="total-price">{{total}}</text></view>
    <view v-if="firstTouch" id="submit" @click="submit">提交订单</view>
    <view v-else id="submit">提交订单</view>
  </view>
</view>
</template>

<script>
// pages/order/order.js
const prefix = getApp().url3; // const point = '075';

export default {
  data() {
    return {
      openid: '',
      point: '',
      appId: '',
      other: [],
      //其他人点的餐品
      submitted: [],
      //点过的餐品
      unsubmitted: [],
      //当前未提交的餐品
      total: 0,
      //总价
      firstTouch: true //第一次点击提交按钮

    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let unsubmitted = uni.getStorageSync('order');
    let point = uni.getStorageSync('point');
    this.openid= uni.getStorageSync('openId'),
    this.appId= uni.getStorageSync('appId'),
    this.unsubmitted= unsubmitted,
    this.point= point
    this.getTransact();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    // 获取帐单的交易明细
    getTransact() {
      let appId = this.appId;
      let point = this.point;
      let openid = this.openid;
      let unsubmitted = this.unsubmitted; //console.log(unsubmitted)

      let total = 0;

      if (unsubmitted) {
        for (let i = 0; i < unsubmitted.length; i++) {
          let price = unsubmitted[i].price;
          let count = unsubmitted[i].count;
          total += price * count;
        }
        this.total=total
      } else {
        uni.showModal({
          content: '订单出现异常,请重新扫码后重新下单',
          showCancel: false,
          confirmText: '确认'
        });
      }

      let that = this;
      uni.showLoading({
        title: '加载中...'
      });
      uni.request({
        url: prefix + 'Catering/GetTransact',
        data: {
		  clienttype:1,
		  openid:openid,
          appid: appId,
          id: openid,
          point: point
        },
        header: {},
        method: 'post',
        success: function (res) {
          // console.log(res)
          uni.hideLoading();
          let other = res.data.data.other;
          let submitted = res.data.data.submitted;
          this.other=other,
          this.submitted= submitted
        }
      });
    },

    //提交
    submit() {
      let firstTouch = this.firstTouch;
      let point = this.point;
      let total = this.total;
      this.firstTouch= false
      let openid = this.openid;
      let transactDetails = [];
      let that = this;
      let order = uni.getStorageSync('order');

      for (let i = 0; i < order.length; i++) {
        let count = order[i].count;
        let id = order[i].id;
        let list = {
          id: id,
          count: count
        };
        transactDetails.push(list);
      }

      uni.showLoading({
        title: '加载中...'
      });

      if (total != 0) {
        // 如果是0就为买单
        uni.request({
          url: prefix + 'Catering/SetTransact',
          data: {
            id: openid,
            transactDetails: transactDetails,
            point: point,
			clienttype:1,
			openid:openid
          },
          method: 'post',
          success: function (res) {
            // console.log(res)
            uni.hideLoading();

            if (res.data.status == 0) {
              let order = [];
              let goodsInfo = null;
              uni.setStorageSync('order', order);
              uni.setStorageSync('goodsInfo', goodsInfo);
              uni.removeStorageSync('sort');
              uni.showModal({
                title: '提示',
                content: '订单提交成功',
                confirmText: '确定',
                showCancel: false,

                success(res) {
                  if (res.confirm) {
                    //wx.navigateBack({
                    //  delta: 1
                    //})
                    uni.navigateTo({
                      url: '../food/food'
                    });
                  }
                }

              });
            } else if (res.data.status == 1) {
              let order = [];
              let goodsInfo = null;
              uni.setStorageSync('order', order);
              uni.setStorageSync('goodsInfo', goodsInfo);
              uni.removeStorageSync('sort');
              let emptyMenu = res.data.data;
              let str = '';

              for (let i = 0; i < emptyMenu.length; i++) {
                if (i + 1 == emptyMenu.length) {
                  str += '"' + emptyMenu[i] + '" \n';
                } else {
                  str += '"' + emptyMenu[i] + '" \n';
                }
              }

              uni.showModal({
                title: '提示',
                content: '订单部分提交成功,以下菜品已售罄:\n' + str,
                confirmText: '确定',
                showCancel: false,

                success(res) {
                  if (res.confirm) {
                    //wx.navigateBack({
                    //  delta: 1
                    //})
                    uni.navigateTo({
                      url: '../food/food'
                    });
                  }
                }

              });
            } else {
              uni.showModal({
                title: '提示',
                content: '订单提交失败',
                confirmText: '确定',
                showCancel: false
              });
              this.firstTouch=true
            }
          },

          fail() {
            uni.hideLoading();
            uni.showModal({
              title: '提示',
              content: '订单提交失败',
              confirmText: '确定',
              showCancel: false
            });
            this.firstTouch= true
          }

        });
      } else {
        console.log('askaskask');
        uni.request({
          url: prefix + 'Publish/Wx/Pay1',
          // 这里可以获得openid
          data: {
            appid: 'wx5e42830a7a8937f4',
            openid: openid
          },
          method: 'post',
          dataType: 'json',

          success(res) {
            uni.hideLoading();
            console.log('pay', res);

            if (res.data.errCode == 0) {
              uni.requestPayment({
                'timeStamp': res.data.data.timeStamp,
                'nonceStr': res.data.data.nonceStr,
                'package': res.data.data.package,
                'signType': res.data.data.signType,
                'paySign': res.data.data.paySign,
                'success': function (res) {
                  uni.navigateTo({
                    url: '../food/food'
                  });
                },
                'fail': function (res) {
                  console.log('wx.requestPayment fail', res);
                },
                'complete': function (res) {
                  console.log('wx.requestPayment complete');
                }
              });
            } else {
              uni.showModal({
                title: '提示',
                content: res.data.errMsg,
                confirmText: '确定',
                showCancel: false,

                success(res) {
                  if (res.confirm) {}
                }

              });
            }
          },

          fail() {
            uni.hideLoading();
            uni.showModal({
              title: '提示',
              content: '订单提交失败',
              confirmText: '确定',
              showCancel: false
            });
            this.firstTouch=true
          }

        });
      }
    }

  }
};
</script>
<style>
/* pages/order/order.wxss */
.container{
  padding: 20rpx;
  background-color: #F6F6F6;
  height: 100vh;
  font-size: 28rpx;
}
#top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25rpx;
  background-color: #fff;
  height: 100rpx;
  border-bottom: 1px solid #F3F3F3;
}
#name{
  font-size: 32rpx;
  font-weight: 550;
}
#orderButton{
  width: auto;
  padding: 10rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E35952;
  border: 1rpx solid #E35952;
  border-radius: 30rpx;
}
#middle{
  background-color: #fff;
  padding: 25rpx 0;
}
.title{
  display: flex;
  align-items: center;
  padding-left: 25rpx;
  height: auto;
  border-left: 2px solid #E35952;
  color: #E35952;
  box-sizing: border-box;
  margin-bottom: 10rpx;
}
.menu{
  display: flex;
  flex-direction: column;
}
.list{
  width: 100%;
  display: flex;
  padding: 20rpx 20rpx;
  justify-content: space-between;
}
.food-name{
  width: 60%;
}
.unit{
  font-size: 22rpx;
  color: #A0A0A0;
}
.order-box{
  border-bottom: 1px solid #F3F3F3;
  margin-bottom: 25rpx;
}

#bottom{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
  height: 100rpx;
  background-color: #C7A86D;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 20rpx;
}
.order-price{
  color: #333;
  padding-left: 10rpx;
}

#submit{
  width: 200rpx;
  height: 70rpx;
  /* padding: 10rpx 20rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #FF6100;
  border: 1rpx solid #FF6100;
  border-radius: 35rpx;
}

#total{
  padding: 10rpx 20rpx;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  border-bottom: 1px solid #F3F3F3;
  padding-bottom: 35rpx;
}
.symbol{
  font-size: 22rpx;
  font-weight: 550;
}
.total-price{
  font-size: 36rpx;
  font-weight: 550;
}
</style>
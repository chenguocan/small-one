<template>
<!--pages/food/food.wxml-->
<view class="container">
    <!-- 顶部背景图 -->
    <!-- <image class="top-bg" src=""></image> -->
    <swiper class="top-bg" autoplay circular interval="3000" :current="currentSwiper">
      <swiper-item v-for="(item, index) in imgUrls" :key="index">
        <view class="lb">
          <image :src="item.name"></image>
        </view>
      </swiper-item>
    </swiper>
    <!-- 回到首页按钮 -->
    <!-- <view id="scan" bindtap="scan"></view> -->
    <!-- 板块选项内容 -->
    <view class="wrap">
      <view>
        <!-- 位置 -->
        <view class="position">
          <image src="/static/image/food/position.jpg"></image>
          <text>{{info.address}}</text>
		 <!-- <u-icon name="scan" size="48" @click="scan"></u-icon> -->
        </view>
        <view class="phone">联系电话：{{info.tel || ''}}</view>
        <view class="phone">桌台号：{{tableName || ''}}</view>
        <!-- 店铺logo -->
        <view class="shop-logo"><image :src="info.logo"></image></view>
      </view>
      <view>
        <!-- 选项卡板块 -->
        <view class="plate">
          <view :class="plateActive==0?'active':''" data-index="0" @click="onPlate">点餐</view>
          <view :class="plateActive==1?'active':''" data-index="1" @click="onPlate">订单详情<text></text></view>
          <view :class="plateActive==2?'active':''" data-index="2" @click="onPlate">商家</view>
        </view>
        <!-- 搜索 -->
        <!-- <view class="search" catchtap="onSearch">
          想吃点什么
        </view> -->
      </view>
    </view>
    <!-- 各版块详情 -->
    <view class="details">
      <view v-if="plateActive==0" class="order" :style="'height: ' + orderHeight + 'rpx'">
        <scroll-view class="order-left" scroll-y enable-flex>
          <view v-for="(item, index) in sort" :key="index" :class="'sort-item ' + (sortActive==item.id?'active':'')" :data-index="index" :data-id="item.id" @click="onSort">
            <icon></icon>
            <text v-if="item.picture==''"><image v-if="item.locate==0&&icon" src></image>{{item.name}}<image v-if="item.locate==1&&icon" src></image></text>
            <view v-else class="sort-icon-box"><image :src="item.picture" class="sort-icon"></image></view>
            <text class="num" :hidden="sortGoodsNum[index]==0">{{sortGoodsNum[index]}}</text>
          </view>
        </scroll-view>
        <scroll-view class="order-right" :scroll-into-view="goodsView" scroll-y enable-flex scroll-with-animation="true" @scroll="goodsScroll">
          <!-- <view class="product-sort-fixed">{{name}}</view> -->
          <view v-for="(i, sortIndex) in sort" :key="sortIndex" class="product" :id="'sort' + i.id" data-ii="1">
            <view class="product-sort">{{i.name}}</view>
            <view v-for="(j, goodsIndex) in goods[sortIndex]" :key="goodsIndex" :class="'product-item ' + (goodsIndex==0?'first':'')" @click="onShowGoodsDetails" :data-sort-index="sortIndex" :data-goods-index="goodsIndex" :data-goods-id="j.id" :data-goods-name="j.name" :data-goods-price="j.current_price" :data-goods-quantity="j.quantity" :data-goods-tip="j.tip">
              <view class="product-left">
                <image :src="j.picture"></image>
              </view>
              <view class="product-right">
                <text class="title">{{j.name}}</text>
                <view class="label-box" v-if="j.labelArray.length!=0"><text v-for="(k, labelIndex) in j.labelArray" :key="labelIndex" class="label">{{k}}</text></view>
                <view v-else><text class="label"></text></view>
                <view class="appraise"><text>月售{{j.count}}</text><text>好评度{{j.favourable}}%</text></view>
                <view class="selected-count" v-if="j.selected!=0">已点数量{{j.selected}}</view>
                <view>
                  <view class="price"><text>￥</text>{{j.current_price}}<text class="old-price" v-if="j.current_price!=j.original_price"> ￥{{j.original_price}}</text><text> /{{j.unit}}</text></view>
                  <view class="red-add" v-if="j.quantity>0">
                    <view class="red" @click.stop="onRed" :data-name="j.name" :hidden="goodsNum[sortIndex][goodsIndex]==0" :data-sort-index="sortIndex" :data-goods-index="goodsIndex" :data-goods-id="j.id" :data-price="j.current_price">-</view>
                    <text class="num" :hidden="goodsNum[sortIndex][goodsIndex]==0">{{goodsNum[sortIndex][goodsIndex]}}</text>
                    <view class="add" @click.stop="onAdd" :data-name="j.name" :data-sort-index="sortIndex" :data-goods-index="goodsIndex" :data-goods-id="j.id" :data-price="j.current_price" :data-tip="j.tip">+</view>
                  </view>
                  <view v-else>已售罄</view>
                </view>
                <view class="discount" v-if="j.current_price!=j.original_price"> {{j.discount}}折</view>
              </view>
            </view>
          </view>          
        </scroll-view>
        
      </view>
      <view v-else-if="plateActive==1" class="order-detail">
        <!-- 订单详情 -->
        <view class="order-box">
          <view class="order-title">
            您本次点餐期间，其它消费者点选的餐品
          </view>
          <view class="order-menu">
            <view v-for="(i, index) in other" :key="index" class="order-list">
              <view class="order-food-name">{{i.name}}<span class="order-unit">/{{i.unit}}</span></view>
              <view class="order-count">×{{i.count}}</view>
              <view class="order-price">￥{{i.current_price}}</view>
            </view>
            <view class="total">
              总价<text class="symbol">￥</text><text class="total-price">{{totalOthers}}</text>
            </view>
          </view>
        </view>
        <view class="order-box">
          <view class="order-title">
            已提交餐品
          </view>
          <view class="order-menu">
            <view v-for="(i, index) in submitted" :key="index" class="order-list">
              <view class="order-food-name">{{i.name}}<span class="order-unit">/{{i.unit}}</span></view>
              <view class="order-count">×{{i.count}}</view>
              <view class="order-price">￥{{i.current_price}}</view>
            </view>
            <view class="total">
              总价<text class="symbol">￥</text><text class="total-price">{{totalMyself}}</text>
            </view>
          </view>
        </view>
        <view class="order-box">
          <view class="order-menu">
            <view class="total">
              合计<text class="symbol">￥</text><text class="total-price">{{totalOthers+totalMyself}}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="plateActive==2" class="business">
        <view class="title">商家信息</view>
        <view class="business-time">名称：{{info.name || ''}}</view>
        <view class="position-phone">
          <text>位置：{{info.address || ''}}</text>
          <!-- <text class="calling"></text> -->
        </view>
        <view class="business-time">营业时间：{{info.time || ''}}</view>
        <!-- <view class="delivery-time">配送时间：17:30 - 21:00</view> -->
      </view>
    </view>
    <!-- 商品详情 -->
    <view class="goods-details" v-if="showGoodsDetails">
      <view class="close" @click="onHideGoodsDetails"></view>
      <image :src="goodsDetailsData.image" mode="widthFix"></image>
      <view>
        <view class="top">
          <view class="goods-title">{{goodsDetailsData.title}}</view>
        </view>
        <view class="buttom">
          <view class="price">￥{{goodsDetailsData.price}}</view>
          <view class="red-add" v-if="goodsDetailsData.quantity>0">
            <view class="red" @click="onRed" :data-name="goodsDetailsData.title" :hidden="goodsNum[goodsDetailsData.sortIndex][goodsDetailsData.goodsIndex]==0" :data-sort-index="goodsDetailsData.sortIndex" :data-goods-index="goodsDetailsData.goodsIndex" :data-goods-id="goodsDetailsData.goodsId" :data-price="goodsDetailsData.price">-</view>
            <text class="num" :hidden="goodsNum[goodsDetailsData.sortIndex][goodsDetailsData.goodsIndex]==0">{{goodsNum[goodsDetailsData.sortIndex][goodsDetailsData.goodsIndex]}}</text>
            <view class="add" @click="onAdd" :data-name="goodsDetailsData.title" :data-sort-index="goodsDetailsData.sortIndex" :data-goods-index="goodsDetailsData.goodsIndex" :data-goods-id="goodsDetailsData.goodsId" :data-price="goodsDetailsData.price" :data-tip="goodsDetailsData.tip">+</view>
          </view>
          <view v-else>已售磬</view>
        </view>
      </view>
      <view>
        <view class="dishes-details">菜品详情</view>
        <view class="info">{{goodsDetailsData.detail}}</view>
      </view>
      <view id="close-model" @click="onHideGoodsDetails"><image src="/static/image/food/back.png"></image></view>
    </view>
    <!-- 底部购物车 -->
    <view class="footer" v-if="plateActive==0">
      <image @click="onShowCart" src="/static/image/food/buy.png"></image>
      <text class="num" :hidden="totalGoodsNum==0">{{totalGoodsNum}}</text>
      <view class="price-count" v-if="!totalPrice">未选购商品</view>
      <view class="price-count" v-else>￥<text>{{totalPrice}}</text></view>
      <view class="buy">
        <!-- <block wx:if="{{!totalPrice}}">
          ￥{{startSellPrice}}起售
        </block>
        <block wx:elif="{{diffSellPrice>0&&diffSellPrice<=startSellPrice}}">
          差￥{{diffSellPrice}}起售
        </block> -->
        <view v-if="!totalPrice"><!-- bindtap="onBuy">立即买单-->
          0元起售
        </view>
        <block v-else>
          <text @click="onBuy">提交菜单</text>
        </block>
      </view> 
    </view>
    <!-- 购物车详情 -->
    <view class="shop-cart-details" :hidden="showCart||purItems==''" @click.stop="onShowCart">
      <view class="goods">
        <view class="goods-title">
          <text>已选商品</text>
          <view @click.stop="clearCart">
            <icon></icon>
            <text>清空</text>
          </view>
        </view>
        <scroll-view class="goods-list" scroll-y>
          <view v-for="(i, purIndexKey) in purIndexArr" :key="purIndexKey">
            <!-- <view class="product-item" wx:for="{{purGoodsList}}" wx:key="{{purGoodsKey}}" wx:for-index="purGoodsKey" wx:for-item="j" wx:if="{{goodsNum[i[0]][i[1]]!=0}}"> -->
            <view class="product-item" v-if="goodsNum[i[0]][i[1]]!=0">
              <view class="product-left">
                <image :src="purGoodsList[purIndexKey].picture"></image>
              </view>
              <view class="product-right">
                <text class="title">{{purGoodsList[purIndexKey].name}}</text>
                <view>
                  <view class="price"><text>￥</text>{{purGoodsList[purIndexKey].current_price}}<text> /小份</text></view>
                  <view class="red-add">
                    <view class="red" @click="onRed" :hidden="goodsNum[i[0]][i[1]]==0" :data-sort-index="i[0]" :data-goods-index="i[1]" :data-goods-id="purGoodsList[purIndexKey].id" :data-price="purGoodsList[purIndexKey].current_price" :data-name="purGoodsList[purIndexKey].name">-</view>
                    <text class="num" :hidden="goodsNum[i[0]][i[1]]==0">{{goodsNum[i[0]][i[1]]}}</text>
                    <view class="add" @click="onAdd" :data-sort-index="i[0]" :data-goods-index="i[1]" :data-goods-id="purGoodsList[purIndexKey].id" :data-price="purGoodsList[purIndexKey].current_price" :data-name="purGoodsList[purIndexKey].name">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <!-- 搜索板块 -->
    <view class="search-plate" v-if="isSearch">
      <!-- 搜索框部分 -->
      <view class="search-top">
        <view class="search-box">
          <icon></icon>
          <input type="text" placeholder="想吃什么搜一搜" placeholder-class="placeholder-class" focus></input>
        </view>
        <view class="cancel" @click.stop="cancelSearch">取消</view>
      </view>
      <!-- 历史记录部分 -->
      <view class="history-search" v-if="showHistory">
        <text>历史搜索</text>
        <view class="history-item">
          <!-- <text>鸭爪</text>
          <text>猪蹄</text>
          <text>鸭爪</text>
          <text>猪蹄</text>
          <text>鸭爪鸭爪鸭爪</text>
          <text>猪蹄猪蹄</text>
          <text>鸭爪</text>
          <text>猪蹄</text>
          <text>鸭爪猪蹄</text>
          <text>猪蹄</text>
          <text>鸭爪猪蹄</text>
          <text>猪蹄</text> -->
        </view>
      </view>
      <!-- 商品列表 -->
      <view class="goods-list" v-if="showSearchGoods">
        <scroll-view class="goods-list" scroll-y>
          <view v-for="(i, purIndexKey) in purIndexArr" :key="purIndexKey">
            <view class="product-item" v-if="goodsNum[i[0]][i[1]]!=0">
              <view class="product-left">
                <image :src="purGoodsList[purIndexKey].picture"></image>
              </view>
              <view class="product-right">
                <text class="title">{{purGoodsList[purIndexKey].title}}</text>
                <view>
                  <view class="price"><text>￥</text>{{purGoodsList[purIndexKey].price}}<text> /小份</text></view>
                  <view class="red-add">
                    <view class="red" @click="onRed" :data-name="purGoodsList[purIndexKey].title" :hidden="goodsNum[i[0]][i[1]]==0" :data-sort-index="i[0]" :data-goods-index="i[1]" :data-goods-id="purGoodsList[purIndexKey].id" :data-price="purGoodsList[purIndexKey].price">-</view>
                    <text class="num" :hidden="goodsNum[i[0]][i[1]]==0">{{goodsNum[i[0]][i[1]]}}</text>
                    <view class="add" @click="onAdd" :data-name="purGoodsList[purIndexKey].title" :data-sort-index="i[0]" :data-goods-index="i[1]" :data-goods-id="purGoodsList[purIndexKey].id" :data-price="purGoodsList[purIndexKey].price">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
</view>
</template>

<script>
// pages/food/food.js
const prefix = getApp().globalData.url3; // const point = '075';
// const point = '075';
const app = getApp();

export default {
  data() {
    return {
      point: '',
      account: '',
      appId: '',
      openid: '',
      currentSwiper: 0,
      // 当前轮播图位置初始化到第1个
      info: null,
      //公司信息
      imgUrls: [],
      //轮播图
      other: [],
      //其他人点的餐品
      submitted: [],
      //点过的餐品
      totalMyself: 0,
      //总价
      totalOthers: 0,
      //总价
      sort: [],
      // 分类数组
      goods: [],
      // 商品数组
      plateActive: 0,
      // 板块选择，0：点餐，1：评价，2：商家
      sortActive: 0,
      // 分类选择
      sortName: '',
      // 分类名称
      // goodsNum: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], // 商品数量
      // sortGoodsNum: [0, 0, 0], // 分类的商品总数
      goodsNum: [],
      // 商品数量
      sortGoodsNum: [],
      // 分类的商品总数
      totalGoodsNum: 0,
      // 总商品数量
      goodsView: '',
      // 控制商品部分的锚点定位
      totalPrice: 0,
      // 总价格
      startSellPrice: 0,
      // 起售价格
      diffSellPrice: 0,
      // 差多少起售
      showCart: true,
      // 显示购物车
      purItems: [],
      // 已购买的商品id数组
      purIndex: [],
      // 已购买的商品所在位置数组
      purGoodsList: [],
      // 购物车中的商品列表
      purIndexArr: [],
      // 已购买的商品所在位置数组,初始化后的数据
      scrollArr: [],
      // 滚动的位置记录
      fixedPlate: false,
      // 控制上划到一定位置固定板块详情内容
      monitorScroll: true,
      // 监听商品滚动，对应的左边菜单滚动开关
      orderHeight: 0,
      // 点餐板块高度
      isSearch: false,
      // 是否开启搜索页面
      showHistory: true,
      // 是否显示历史搜索字段
      showSearchGoods: false,
      // 是否显示搜索商品的列表
      showGoodsDetails: false,
      // 显示商品详情
      goodsDetailsData: null,
      // 商品详情数据
      firstBinding: true,
      //是否为第一次验证绑定
      tableName: '',
      // 桌台号
      isBinding: false,
      pageLoad1: false,
      pageLoad2: false,
      pageLoad3: false,
      controlPt: false,
      goodsNumArr: "",
      sortGoodsNumArr: ""
    };
  },

  components: {},
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //--------------------------------------------------------------------------
    // 2020-05-27 22:13:00 增加通过微信扫描带参数的微信二维码的功能，取到的信息为“销售点*帐单号”
    console.log('food.js->onLoad', options.scene); //wx.setStorageSync('account', '')
	console.log(options);
   if (options.scene != null) {
      // undefined
      let point1 = options.scene.split(",")[2];
      let account1 = options.scene.split(",")[3];
	  console.log(point1);
	  console.log(account1);
      if (account1 != null) uni.setStorageSync('account', account1);
      if (point1 != null) uni.setStorageSync('point', point1);
    } //--------------------------------------------------------------------------

    let appId = uni.getStorageSync('appId');
    let openId = uni.getStorageSync('openId');
	this.appId=appId;
	this.openid=openId;
    let register = uni.getStorageSync('register');
    let point = uni.getStorageSync('point');
    let account = uni.getStorageSync('account'); //console.log('appId',appId)
    //console.log('openId',openId)
    //console.log('register',register)
    //console.log('point',point)
    //console.log('account',account)
    console.log('Result:', appId === '' || openId === '' || register === '');
	if (point=='' || account==''){
		this.isBindingBill(appId, openId, point, account);
	}else{
		this.binding(appId, openId, point, account);
	}
	console.log(register);
/* 	if (register === false || register=== '') {
		uni.showToast({
			title:'请授权信息',
			icon:'none',
			duration:1500,
		})
		setTimeout(function(){
			uni.redirectTo({
			  url: '../user/login?nav=food',
			})
		},1500)
    }; */
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let register = uni.getStorageSync('register');
    if (register === true) {
	  this.appId = uni.getStorageSync('appId');
	  this.openid = uni.getStorageSync('openId');
	  console.log(this.appId);
      let appId = this.appId;
      let openId = this.openid;
      let point = uni.getStorageSync('point');
      let account = uni.getStorageSync('account');
	  this.getItemGroupAboutClient();  
      this.getBanner();
      this.accountAbout();
      // if (!this.data.isBinding) {
      //   this.isBindingBill(appId, openId, point, account);
      // }
    }

    if (!uni.getStorageSync('order') || uni.getStorageSync('order').length == 0) {
      let sort = this.sort;
      let goods = this.goods;
      let goodsNum = [];
      let sortGoodsNum = [];

      for (let i = 0; i < sort.length; i++) {
        sortGoodsNum[i] = 0;
      } // 初始化分类数组


      for (let i = 0; i < goods.length; i++) {
        goodsNum[i] = [];

        for (let j = 0; j < goods[i].length; j++) {
          goodsNum[i][j] = 0;
        }
      } // 初始化商品数组


      this.totalGoodsNum= 0;
      this.totalPrice= 0;
      this.diffSellPrice= 0;
        // 差多少起售
      this.showCart= true;
        // 显示购物车
      this.purItems= [];
        // 已购买的商品id数组
      this.purIndex= [];
        // 已购买的商品所在位置数组
      this.purGoodsList= [];
        // 购物车中的商品列表
      this.purIndexArr= [];
        // 已购买的商品所在位置数组,初始化后的数据
      this.goodsNum= goodsNum;
        // 商品数量
      this.sortGoodsNum= sortGoodsNum; // 分类的商品总数
    }
  },

  //下拉刷新
  onPullDownRefresh() {
    console.log('onPullDownRefresh');
    uni.stopPullDownRefresh();
    this.getItemGroupAboutClient();
    this.getBanner();
    this.accountAbout();
    if (this.isBinding) this.getTransact();
  },

  methods: {
    /**
     * 扫码
     */
    scan: function () {
      let that = this;
      let openId = uni.getStorageSync('openId');
      let appId = this.appId;
      uni.navigateTo({
      	url:'../scan/scan'
      })
    },

    /**
     * 板块选择
     */
    onPlate: function (e) {
      let index = e.currentTarget.dataset.index; //console.log(index)

      if (index == '1') {
        this.getTransact();
      }

      this.plateActive= parseInt(index),
      this.fixedPlate= true

    },

    /**
     * 分类选择
     */
    onSort: function (e) {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let sort = this.sort;
      this.controlPt= false;
      this.sortActive= parseInt(id);
      this.goodsView= 'sort' + id;
      this.sortName= sort[index].name; // orderHeight: '740rpx'

      if (this.sortActive == sort[sort.length - 1].id) {
        // 当前选中的等于最后一个,控制最后一个分类滚动时的样式变化
          this.monitorScroll=false
      } else {
          this.monitorScroll= true
      }
    },

    /**
     * 监听商品滚动
     */
    goodsScroll: function (e) {
      let scrollTop = e.detail.scrollTop;
      let scrollArr = this.scrollArr;
      let sort = this.sort;
      let monitorScroll = this.monitorScroll;
      let goods = this.goods;
      /* if (scrollTop == 0) {
        this.setData({
          fixedPlate: false
        })
      } else {
        this.setData({
          fixedPlate: true
        })
      } */
      // console.log(scrollArr)
      // console.log(scrollTop);
      // if (monitorScroll || ((goods[goods.length - 1]).length >= 3)) {

      if (monitorScroll) {
        for (let i = 0; i < scrollArr.length; i++) {
          if (scrollTop >= scrollArr[i] - i * 2 && scrollTop < scrollArr[i + 1] - i * 2) {
            this.sortActive= sort[i].id;
            this.sortName= sort[i].name;
          } else if (i == scrollArr.length - 1 && this.sortActive == sort[i - 1].id && scrollTop >= scrollArr[scrollArr.length - 1] - scrollArr.length * 2) {
            // 控制最后一个值
            this.sortActive= sort[i].id;
            this.sortName= sort[i].name;
          }
        }
        this.monitorScroll=true
		}
	},

    /**
     * 商品增加
     */
    onAdd: function (e) {
      // console.log(e)
      let goodsIndex = parseInt(e.currentTarget.dataset.goodsIndex); // 商品数组下标

      let sortIndex = parseInt(e.currentTarget.dataset.sortIndex); // 分类数组下标

      let goodsId = parseInt(e.currentTarget.dataset.goodsId); // 商品id

      let price = parseFloat(e.currentTarget.dataset.price); // 商品价格

      let name = e.currentTarget.dataset.name; // 商品名称

      let totalPrice = parseFloat((this.totalPrice + price).toFixed(2)); // 总价格

      let purItems = this.purItems;
      console.log('tip', e.currentTarget.dataset.tip);

      if (e.currentTarget.dataset.tip == true) {
        let that = this;
        uni.showModal({
          title: '提示',
          content: '此为收费项目',
          confirmText: '确定',
          showCancel: true,

          success(res) {
            if (res.cancel) {} else {
              //------------------------------------------
              console.log('ddddffffff');
              purItems.push(goodsId); // 存储商品id数组

              let purIndex = that.purIndex; // 存储已购买的商品所在位置数组

              if (purIndex.indexOf("[" + sortIndex + "," + goodsIndex + "]") == -1) {
                purIndex.push("[" + sortIndex + "," + goodsIndex + "]");
              }

              let goodsNumArr = "goodsNum[" + sortIndex + "][" + goodsIndex + "]";
              let sortGoodsNumArr = "sortGoodsNum[" + sortIndex + "]";
			  that.goodsNum[sortIndex][goodsIndex]=parseInt(that.goodsNum[sortIndex][goodsIndex] + 1);
              that.sortGoodsNum[sortIndex]=parseInt(that.sortGoodsNum[sortIndex] + 1);
		      that.totalGoodsNum= that.totalGoodsNum + 1;
              that.totalPrice= totalPrice;
              that.purItems= purItems;
              that.purIndex= purIndex; // console.log('goodsNumArr', goodsNumArr)
              // console.log('sortGoodsNumArr', sortGoodsNumArr)
              // console.log('totalGoodsNum', this.data.totalGoodsNum)
              // console.log('totalPrice', this.data.totalPrice)
              // console.log('purItems', this.data.purItems)
              // console.log('purIndex', this.data.purIndex)

              let goodsInfo = {
                goodsNum: that.goodsNum,
                sortGoodsNum: that.sortGoodsNum,
                totalGoodsNum: that.totalGoodsNum,
                totalPrice: that.totalPrice,
                purItems: that.purItems,
                purIndex: that.purIndex
              };
              uni.setStorageSync('goodsInfo', goodsInfo);
              let count = parseInt(that.goodsNum[sortIndex][goodsIndex]);
              let list = {
                id: goodsId,
                name: name,
                count: count,
                price: price
              };

              if (uni.getStorageSync('order')) {
                let order = uni.getStorageSync('order');

                if (order.length == 0) {
                  order.push(list);
                  uni.setStorageSync('order', order);
                } else {
                  let flag = true;

                  for (let i = 0; i < order.length; i++) {
                    if (order[i].id == goodsId) {
                      //订单中已有该商品.仅改变数量
                      flag = false;
                      order[i].count = count;
                      uni.setStorageSync('order', order);
                    }
                  }

                  if (flag) {
                    //订单中没有改商品,创建新项
                    order.push(list);
                    uni.setStorageSync('order', order);
                  }
                }
              } else {
                let order = [];
                order.push(list);
                uni.setStorageSync('order', order);
              }

              let diffSellPrice = parseFloat((that.startSellPrice - that.totalPrice).toFixed(2)); // 还差多少起送
                that.diffSellPrice= diffSellPrice //------------------------------------------
            } //if (res.confirm) {
            //  console.log('此为收费项目',res)
            //}

          }

        });
      } else {
        purItems.push(goodsId); // 存储商品id数组

        let purIndex = this.purIndex; // 存储已购买的商品所在位置数组

        if (purIndex.indexOf("[" + sortIndex + "," + goodsIndex + "]") == -1) {
          purIndex.push("[" + sortIndex + "," + goodsIndex + "]");
        }

        let goodsNumArr = "goodsNum[" + sortIndex + "][" + goodsIndex + "]";
        let sortGoodsNumArr = "sortGoodsNum[" + sortIndex + "]";
      	this.goodsNum[sortIndex][goodsIndex]=parseInt(this.goodsNum[sortIndex][goodsIndex] + 1);
        this.sortGoodsNum[sortIndex]=parseInt(this.sortGoodsNum[sortIndex] + 1);
	    this.totalGoodsNum= this.totalGoodsNum + 1;
        this.totalPrice= totalPrice;
        this.purItems= purItems;
        this.purIndex= purIndex ;
         // console.log('goodsNumArr', goodsNumArr)
        // console.log('sortGoodsNumArr', sortGoodsNumArr)
        // console.log('totalGoodsNum', this.data.totalGoodsNum)
        // console.log('totalPrice', this.data.totalPrice)
        // console.log('purItems', this.data.purItems)
        // console.log('purIndex', this.data.purIndex)

        let goodsInfo = {
          goodsNum: this.goodsNum,
          sortGoodsNum: this.sortGoodsNum,
          totalGoodsNum: this.totalGoodsNum,
          totalPrice: this.totalPrice,
          purItems: this.purItems,
          purIndex: this.purIndex
        };
        uni.setStorageSync('goodsInfo', goodsInfo);
        let count = parseInt(this.goodsNum[sortIndex][goodsIndex]);
        let list = {
          id: goodsId,
          name: name,
          count: count,
          price: price
        };

        if (uni.getStorageSync('order')) {
          let order = uni.getStorageSync('order');

          if (order.length == 0) {
            order.push(list);
            uni.setStorageSync('order', order);
          } else {
            let flag = true;

            for (let i = 0; i < order.length; i++) {
              if (order[i].id == goodsId) {
                //订单中已有该商品.仅改变数量
                flag = false;
                order[i].count = count;
                uni.setStorageSync('order', order);
              }
            }

            if (flag) {
              //订单中没有改商品,创建新项
              order.push(list);
              uni.setStorageSync('order', order);
            }
          }
        } else {
          let order = [];
          order.push(list);
          uni.setStorageSync('order', order);
        }
		
        let diffSellPrice = parseFloat((this.startSellPrice - this.totalPrice).toFixed(2)); // 还差多少起送
        this.diffSellPrice= diffSellPrice
      }
    },

    /**
     * 商品减少
     */
    onRed: function (e) {
      let goodsIndex = parseInt(e.currentTarget.dataset.goodsIndex);
      let sortIndex = parseInt(e.currentTarget.dataset.sortIndex);
      let goodsId = parseInt(e.currentTarget.dataset.goodsId); // 商品id

      let price = parseFloat(e.currentTarget.dataset.price);
      let totalPrice = parseFloat((this.totalPrice - price).toFixed(2));
      let name = e.currentTarget.dataset.name; // 商品名称

      let diffSellPrice = parseFloat((this.totalPrice - price).toFixed(2)); // 还差多少起送

      let purItems = this.purItems;
      let purItemsIndex = purItems.indexOf(goodsId);
      purItems.splice(purItemsIndex, 1); // 存储商品id数组

      let purIndex = this.purIndex;
      let purIndexIndex = purIndex.indexOf("[" + sortIndex + "," + goodsIndex + "]");

      if (this.goodsNum[sortIndex][goodsIndex] <= 1) {
        purIndex.splice(purIndexIndex, 1); // 存储已购买的商品所在位置数组
      }

      if (diffSellPrice < this.startSellPrice) {
        // 如果差价小于起送价格
        diffSellPrice = parseFloat((this.startSellPrice - diffSellPrice).toFixed(2));
      }

      if (this.goodsNum[sortIndex][goodsIndex] > 0) {
        // 判断商品选购数量大于0，才执行
        let goodsNumArr = "goodsNum[" + sortIndex + "][" + goodsIndex + "]";
        let sortGoodsNumArr = "sortGoodsNum[" + sortIndex + "]";
       	this.goodsNum[sortIndex][goodsIndex]=parseInt(this.goodsNum[sortIndex][goodsIndex] - 1);
        this.sortGoodsNum[sortIndex]=parseInt(this.sortGoodsNum[sortIndex] - 1);
        this.totalGoodsNum= this.totalGoodsNum - 1
        this.totalPrice= totalPrice
        this.diffSellPrice= diffSellPrice
        this.purItems= purItems
        this.purIndex= purIndex
         //保存购物车信息

        if (this.totalGoodsNum == 0) {
          let goodsInfo = null;
          uni.setStorageSync('goodsInfo', goodsInfo);
          this.totalGoodsNum= 0;
          this.totalPrice= 0;
          this.diffSellPrice= 0;
            // 差多少起售
          this.showCar= true;
            // 显示购物车
          this.purItems= [];
            // 已购买的商品id数组
          this.purIndex= [];
            // 已购买的商品所在位置数组
          this.purGoodsList= [];
            // 购物车中的商品列表
          this.purIndexArr= [];
            // 已购买的商品所在位置数组,初始化后的数据


            ////////////111111111111111111111
          this.goodsNum= this.goodsNum
            // 商品数量
          this.sortGoodsNum= this.sortGoodsNum // 分类的商品总数
        } else {
          let goodsInfo = {
            goodsNum: this.goodsNum,
            sortGoodsNum: this.sortGoodsNum,
            totalGoodsNum: this.totalGoodsNum,
            totalPrice: this.totalPrice,
            purItems: this.purItems,
            purIndex: this.purIndex
          };
          uni.setStorageSync('goodsInfo', goodsInfo);
        }

        let count = parseInt(this.goodsNum[sortIndex][goodsIndex]);
        let list = {
          id: goodsId,
          name: name,
          count: count,
          price: price
        };
        let order = uni.getStorageSync('order');

        for (let i = 0; i < order.length; i++) {
          if (order[i].id == goodsId) {
            //改变数量
            if (count == 0) {
              order.splice(i, 1);
            } else {
              order[i].count = count;
            }

            uni.setStorageSync('order', order);
          }
        }
      }

      if (this.totalPrice <= 0) {
        // 如果总价格为零（也就是无选购商品），关闭购物车显示
        this.showCart= true
      } // console.log(this.data.purIndex)

    },

    /**
     * 调用拨打电话
     */
    calling: function (res) {// wx.makePhoneCall({
      //   phoneNumber: '', //此号码并非真实电话号码，仅用于测试
      //   success: function () {
      //     console.log("拨打电话成功！")
      //   },
      //   fail: function () {
      //     console.log("拨打电话失败！")
      //   }
      // })
    },

    /**
     * 显示购物车
     */
    onShowCart: function () {
      let purIndex = this.purIndex;
      let purIndexArr = []; // 已购买的商品所在位置数组,初始化后的数据
      let purGoodsList = []; // 购物车中的商品列表

      for (let i = 0; i < purIndex.length; i++) {
        // 在购物车中增加已选择的商品列表
        let index = JSON.parse(purIndex[i]);
        purIndexArr[i] = index;
        purGoodsList[i] = this.goods[index[0]][index[1]];
      }
      this.showCart=!this.showCart;
      this.purIndexArr=purIndexArr;
      this.purGoodsList=purGoodsList;
       // console.log(this.data.purGoodsList)
      // console.log(this.data.purIndexArr)
      // console.log(this.data.purGoodsList.length)
    },

    /**
     * 显示商品详情
     */
    onShowGoodsDetails: function (e) {
      // console.log(e)
      let that = this;
      let openid = this.openid;
      let point = this.point;
      let appId = this.appId;
      let goodsId = e.currentTarget.dataset.goodsId;
      let goodsIndex = e.currentTarget.dataset.goodsIndex;
      let sortIndex = e.currentTarget.dataset.sortIndex;
      let price = e.currentTarget.dataset.goodsPrice;
      let title = e.currentTarget.dataset.goodsName;
      let quantity = e.currentTarget.dataset.goodsQuantity;
      let tip = e.currentTarget.dataset.tip;
      console.log('tip:', tip); // console.log(this.data.goodsDetailsData)

      console.log(prefix + 'HotelService/Catering/GetItemAboutClient');
      console.log('food.js->onShowGoodsDetails appId:', appId);
      console.log('food.js->onShowGoodsDetails openid:', openid);
      console.log(this.point);
      console.log('food.js->onShowGoodsDetails goodsId:', goodsId);
      uni.request({
        url: prefix + 'MCC/GetItemAboutClient',
        data: {
          "appId": appId,
          "id": openid,
		  "openid":openid,
          // 登录ID
          "point": point,
		  "clienttype":1,
          "item": goodsId // 餐品ID
        },
        method: 'post',
        success: function (res) {
          console.log(res);
          let image = 'http://121.37.210.175:8001/image/' + appId + '/picture/' + res.data.data.id + '.jpg';
          let detail = res.data.data.other.detail.data;

          if (!detail) {
            detail = '再简单的食物都有自己的灵魂';
          } else {
            detail = detail.raw;
          }

          let goodsDetailsData = {
            // 每个商品详情的数据
            'goodsId': goodsId,
            'goodsIndex': goodsIndex,
            'price': price,
            'sortIndex': sortIndex,
            'title': title,
            'image': image,
            'detail': detail,
            'quantity': quantity,
            'tip': tip
          };
          that.showGoodsDetails= true,
          that.goodsDetailsData= goodsDetailsData
        }
      });
    },

    /**
     * 关闭商品详情
     */
    onHideGoodsDetails: function () {
      this.showGoodsDetails= false
    },

    /**
     * 去购买
     */
    onBuy: function () {
      // let purItems = this.data.purItems; 
      let isBinding = this.isBinding; // let purIndex = this.data.purIndex;
      // let purIndexArr = []; // 已购买的商品所在位置数组,初始化后的数据
      // let purGoodsList = []; // 购物车中的商品列表
      // for (let i = 0; i < purIndex.length; i++) { // 在购物车中增加已选择的商品列表
      //   let index = JSON.parse(purIndex[i]);
      //   purIndexArr[i] = index;
      //   purGoodsList[i] = this.data.goods[index[0]][index[1]];
      // }
      // this.setData({
      //   purIndexArr: purIndexArr,
      //   purGoodsList: purGoodsList
      // })
      // console.log(purGoodsList)

      if (isBinding) {
        uni.showLoading({
          title: '加载中...'
        });
        uni.navigateTo({
          url: '../shopOrder/shopOrder',
          complete: function (res) {
            uni.hideLoading();
          }
        });
      } else {
        uni.showModal({
          title: '提示',
          content: '未关联指定桌台帐单,无法下单',
          confirmText: '确定',
          showCancel: false,

          success(res) {
            if (res.confirm) {}
          }

        });
      }
    },

    /**
     * 清空购物车
     */
    clearCart: function () {
      let that = this;
      let sort = this.sort;
      let goods = this.goods;
      let goodsNum = [];
      let sortGoodsNum = [];

      for (let i = 0; i < sort.length; i++) {
        sortGoodsNum[i] = 0;
      } // 初始化分类数组


      for (let i = 0; i < goods.length; i++) {
        goodsNum[i] = [];

        for (let j = 0; j < goods[i].length; j++) {
          goodsNum[i][j] = 0;
        }
      } // 初始化商品数组


      uni.showModal({
        content: '确认要清空购物车吗?',
        confirmColor: '#2C91FD',

        success(res) {
          if (res.confirm) {
            let order = [];
            let goodsInfo = null;
            uni.setStorageSync('order', order);
            uni.setStorageSync('goodsInfo', goodsInfo);
            that.totalGoodsNum= 0
            that.totalPrice= 0
            that.diffSellPrice= 0
              // 差多少起售
            that.showCart= true
              // 显示购物车
            that.purItems= [];
              // 已购买的商品id数组
            that.purIndex= [];
              // 已购买的商品所在位置数组
            that.purGoodsList= [];
              // 购物车中的商品列表
            that.purIndexArr= [];
              // 已购买的商品所在位置数组,初始化后的数据
            that.goodsNum= goodsNum;
              // 商品数量
            that.sortGoodsNum= sortGoodsNum // 分类的商品总数
          }
        }

      });
    },

    /**
     * 启动搜索
     */
    onSearch: function () {
      this.isSearch= true // showHistory: true, // 是否显示历史搜索字段
        // showSearchGoods: false, // 是否显示搜索商品的列表
    },

    /**
     * 取消搜索
     */
    cancelSearch: function () {
      this.isSearch= false
    },
    // 是否已关联指定桌台帐单绑定
    isBindingBill: function (appId, openId, point, scene) {
      // this.data.point = point;
      // wx.setStorageSync('point', point);
      let that = this;
      let firstBinding = this.firstBinding;
      uni.request({
        url: prefix + 'MCC/IsBindingBill',
        data: {
		  clienttype:1,
		  openid:openId,
          id: openId,
          appid: appId,
          point: point,
        },
        method: 'post',
        success: function (res) {
          // console.log(res)
          //-----------------------------------------------
          // 2020-05-27 23:30:00 IsBindingBill的逻辑已被修改
          if (res.data.errCode == 0) {
            //that.getItemGroupAboutClient();
            //that.getBanner();
            //that.accountAbout();
            that.getTransact();
            that.isBinding=true,
            that.tableName= res.data.data
          } else {
            uni.showModal({
              content: res.data.errmsg,
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#C7A86D'
            });
          } //-----------------------------------------------

          /*
          if (res.data.status == 0) {
            let binding = res.data.data.binding;
            if (!binding) {//未绑定
              that.binding(openId, account, appId, scene);
            }else{
              that.getItemGroupAboutClient();
              that.getBanner();
              that.accountAbout();
              that.getTransact();
              that.setData({
                isBinding:true
              })
            }
          }
          */

        },
        fail: function (res) {},
        complete: function (res) {}
      });
    },

    // 绑定对应桌台账单
    binding(appId, openid, point, account) {
      //console.log(openid)
      //console.log(account)
      //console.log(appId)
      //console.log(point)
      let that = this;
      uni.request({
        url: prefix + 'MCC/Binding',
        data: {
          id: openid,
          account: account,
          appid: appId,
          point: point,
		  openid:openid,
		  clienttype:1
        },
        method: 'post',
        success: function (res) {
          //console.log(res)
          if (res.data.errcode == 0) {
            // 说明绑定成功
            that.isBindingBill(appId, openid, point, account);
          } else {
            uni.showModal({
              content: res.data.errmsg,
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#C7A86D'
            });
          }
        },
        fail: function (res) {},
        complete: function (res) {}
      });
    },

    //获取菜单------20200509
    getItemGroupAboutClient() {
      let openid = this.openid;
      let appId = this.appId;
      let that = this;
      let sortActive = 0; //wx.setStorageSync('sort',null);
      //console.log('getItemGroupAboutClient');
      //console.log(wx.getStorageSync('order') && wx.getStorageSync('sort') && wx.getStorageSync('order').length>0);

      if (uni.getStorageSync('order') && uni.getStorageSync('sort') && uni.getStorageSync('order').length > 0) {
        let sort = uni.getStorageSync('sort');
        let goodsList = [];
		console.log(sort);
        for (let i = 0; i < sort.length; i++) {
          let list = sort[i].list;
		  list=JSON.parse(list);
          if (i == 0) {
            sortActive = sort[i].id;
            this.sortActive=sortActive
          }
          for (let j = 0; j < list.length; j++) {
            let label = list[j].label;
            let labelArray = []; // let pic = 'http://www.theheavens.com.cn/HotelService/Image/' + appId + '/icon/1112.jpg';

            if (label) {
              labelArray = label.split(',');
            }

            let discount = null;

            if (list[j].original_price != list[j].current_price) {
              discount = (list[j].current_price / list[j].original_price * 10).toFixed(2);
            }

            list[j].labelArray = labelArray;
            list[j].discount = discount;
          }

          goodsList.push(list); // console.log(goodsList);

          if (i == sort.length - 1) {
            let goodsNum = [];
            let sortGoodsNum = [];
            let scrollArr = [];

            for (let j = 0; j < sort.length; j++) {
              sortGoodsNum[j] = 0;
            } // 初始化分类数组


            uni.getSystemInfo({
              success: function (res) {
                let rpx = 750 / res.windowWidth; // 转成rpx使用的数字

                let px = res.windowWidth / 750; // 转成rpx使用的数字

                let orderHeight = (res.windowHeight - 466 * px) * rpx;

                that.orderHeight= orderHeight
                for (let k = 0; k < goodsList.length; k++) {
                  goodsNum[k] = [];

                  if (k == 0) {
                    scrollArr[k] = 0; // 每个分类的高度
                  } else {
                    scrollArr[k] = Math.floor(scrollArr[k - 1] + goodsList[k - 1].length * 235 * px + 94 * px); // 每个分类的高度
                  }
				  console.log(k);
                  for (let j = 0; j < goodsList[k].length; j++) {
                    // 初始化商品数组
                    goodsNum[k][j] = 0;
                    if ( j == goodsList[k].length - 1) {
						console.log(sort);
                        that.sort= sort,
                        that.goods= goodsList,
                        that.sortGoodsNum= sortGoodsNum,
                        that.goodsNum= goodsNum,
                        that.scrollArr= scrollArr,
                        that.sortName= sort[0].name
                    }
                  }
                }
              }
            });

            if (uni.getStorageSync('goodsInfo')) {
              let goodsInfo = uni.getStorageSync('goodsInfo'); // console.log(goodsInfo);

                this.totalGoodsNum= goodsInfo.totalGoodsNum;
                this.totalPrice= goodsInfo.totalPrice;
                this.diffSellPrice= 0;
                // 差多少起售
                this.showCart= true;
                // 显示购物车
                this.purItems= goodsInfo.purItems;
                // 已购买的商品id数组
                this.purIndex= goodsInfo.purIndex;
                // 已购买的商品所在位置数组
                // purGoodsList: [], // 购物车中的商品列表
                // purIndexArr: [], // 已购买的商品所在位置数组,初始化后的数据
                this.goodsNum= goodsInfo.goodsNum;
                // 商品数量
               this.sortGoodsNum= goodsInfo.sortGoodsNum; // 分类的商品总数

            }

            uni.hideLoading();
            this.pageLoad1= true
          }
        }
      } else {
        uni.showLoading({
          title: '加载中...'
        });
        uni.request({
          url: prefix + 'MCC/GetItemGroupAboutClient',
          data: {
			openid:openid,
			appid:appId,
            id: openid,
			clienttype:1
          },
          dataType: 'json',
          method: 'post',
          success: function (res) {
            console.log('food.js->getItemGroupAboutClient GetItemGroupAboutClient result:', res);
            if (res.data.errCode == 0) {
              let sort = res.data.data;
			  let reg=/[^\u4E00-\u9FA5]/g;
			  sort.forEach(item=>{
				  if(item.name.match(reg)){
					 item.name=item.name.replace(reg,'');
				  }
			  })
			  console.log(sort);
              uni.setStorageSync('sort', sort);
              let goodsList = [];
			  that.sort=sort;
              for (let i = 0; i < sort.length; i++) {
                let list = sort[i].list;
                if (i == 0) {
                  sortActive = sort[i].id;
                  that.sortActive= sortActive
                }
				
				list=JSON.parse(list);
                for (let j = 0; j < list.length; j++) {
                  let label = list[j].label;
                  let labelArray = []; // let pic = 'http://www.theheavens.com.cn/HotelService/Image/' + appId + '/icon/1112.jpg';


                  if (label) {
                    labelArray = label.split(',');
                  }

                  let discount = null;

                  if (list[j].original_price != list[j].current_price) {
                    discount = (list[j].current_price / list[j].original_price * 10).toFixed(2);
                  }

                  list[j].labelArray = labelArray;
                  list[j].discount = discount;
                }

                goodsList.push(list); // console.log(goodsList);
                if (i == (sort.length) - 1) {
                  let goodsNum = [];
                  let sortGoodsNum = [];
                  let scrollArr = [];

                  for (let j = 0; j < sort.length; j++) {
                    sortGoodsNum[j] = 0;
                  } // 初始化分类数组
				  /////////////////////////////
				  that.sortGoodsNum= sortGoodsNum;
                  uni.getSystemInfo({
                    success: function (res) {
                      let rpx = 750 / res.windowWidth; // 转成rpx使用的数字

                      let px = res.windowWidth / 750; // 转成rpx使用的数字
                      let orderHeight = (res.windowHeight - 466 * px) * rpx;
                      that.orderHeight= orderHeight
                      for (let k = 0; k < goodsList.length; k++) {
                        goodsNum[k] = [];
                        if (k == 0) {
                          scrollArr[k] = 0; // 每个分类的高度
                        } else {
                          scrollArr[k] = Math.floor(scrollArr[k - 1] + goodsList[k - 1].length * 235 * px + 94 * px); // 每个分类的高度
                        }
                        for (let j = 0; j < goodsList[k].length; j++) {
                          // 初始化商品数组
                          goodsNum[k][j] = 0;
						  /* console.log(k);
						  console.log(j); */
                          if ( j == (goodsList[k].length - 1)) {
							that.sort= sort;
                            that.goods= goodsList;
                            that.sortGoodsNum= sortGoodsNum;
                            that.goodsNum= goodsNum;
                            that.scrollArr= scrollArr;
                            that.sortName= sort[0].name;
                          }
                        }
                      }
                    }
                  });
                  if (uni.getStorageSync('goodsInfo')) {
                    let goodsInfo = uni.getStorageSync('goodsInfo'); // console.log(goodsInfo);

                    this.totalGoodsNum= goodsInfo.totalGoodsNum;
                    this.totalPrice= goodsInfo.totalPrice;
                    this.diffSellPrice= 0;
                      // 差多少起售
                    this.showCart= true;
                      // 显示购物车
                    this.purItems= goodsInfo.purItems;
                      // 已购买的商品id数组
                    this.purIndex= goodsInfo.purIndex;
                      // 已购买的商品所在位置数组
                      // purGoodsList: [], // 购物车中的商品列表
                      // purIndexArr: [], // 已购买的商品所在位置数组,初始化后的数据
                    this.goodsNum= goodsInfo.goodsNum;
                      // 商品数量
                    this.sortGoodsNum= goodsInfo.sortGoodsNum; // 分类的商品总数
                  }
                  uni.hideLoading();
                  that.pageLoad1= true
                }
              }
            }
          },
          complete(res) {}

        });
      }
    },

    /**
     * 监听用户滑动页面事件--返回页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll(e) {
      // console.log(e.scrollTop)
      if (e.scrollTop >= 135) {
        this.fixedPlate= true
      } else {
        this.fixedPlate= false
      }
    },

    // 获取帐单的交易明细
    getTransact() {
      let point = this.point;
      let openid = this.openid;
      let appId = this.appId;
      let that = this;
      uni.showLoading({
        title: '加载中...'
      });
      console.log(appId);
      console.log(openid);
      console.log(point);
      uni.request({
        url: prefix + 'MCC/GetTransact',
        data: {
          appid: appId,
          id: openid,
          point: point,
		  openid:openid,
		  clienttype:1
        },
        header: {},
        method: 'post',
        success: function (res) {
          // console.log(res)
		  console.log(res);
          if (res.data.errCode == 0) {
            let other = res.data.data.other;
            let submitted = res.data.data.submitted;
            let totalMyself = 0;
            let totalOthers = 0;

            for (let i = 0; i < submitted.length; i++) {
              let price = submitted[i].current_price;
              let count = submitted[i].count;
              totalMyself += price * 1;
            }

            for (let i = 0; i < other.length; i++) {
              let price = other[i].current_price;
              let count = other[i].count;
              totalOthers += price * 1;
            }

            this.other= other;
            this.submitted= submitted;
            this.totalMyself= totalMyself;
            this.totalOthers= totalOthers;
          }
        },
        fail: function (res) {
          console.log('ddd');
        },

        complete(res) {
          uni.hideLoading();
        }

      });
    },

    //获取banner图
    getBanner() {
      let that = this;
      let openid = this.openid;
      let appId = this.appId;
      uni.request({
        url: prefix + 'MCC/GetBanner',
        data: {
		  appid:appId,
          id: openid,
		  openid:openid,
		  clienttype:1
        },
        method: 'post',
        success: function (res) {
			console.log(res);
          if (res.data.status == 0) {
			  let imgUrls = res.data.data;
            /* let imgUrls = res.data.data; */
            /* for (let i = 0; i < imgUrls.length; i++) {
              //imgUrls[i].name = 'http://www.theheavens.com.cn/HotelService/Image/' + appId + '/' + imgUrls[i].name ;
              imgUrls[i].name = 'http://121.37.210.175:8001/image/' + appId + '/' + imgUrls[i].name;
            }
            that.imgUrls= imgUrls;
			console.log(that.imgUrls); */
            that.currentSwiper= 0;
			that.imgUrls= imgUrls;
            that.pageLoad2= true;
          }
        }
      });
    },

    //获取获取与公司相关信息
    accountAbout() {
      let that = this;
      let openid = this.openid;
      let appId = this.appId;
      uni.request({
        url: prefix + 'MCC/About',
        data: {
          id: openid,
		  openid:openid,
		  clienttype:1
        },
        method: 'post',
        dataType: 'json',
        success: function (res) {
          //console.log(res);
		  console.log(res);
          if (res.data.errcode == 0) {
            let name = res.data.data.name; //let logo = 'http://www.theheavens.com.cn/HotelService/Image/' + appId + '/' + res.data.data.logo;

            let logo = 'http://121.37.210.175:8001/image/' + appId + '/' + res.data.data.logo;
            let address = res.data.data.address;
            let tel = res.data.data.tel;
            let time = res.data.data.time;
            let info = {
              address: address,
              logo: logo,
              name: name,
              tel: tel,
              time: time
            };
            that.info= info;
            that.pageLoad3= true
            // wx.setNavigationBarTitle({
            //   title: name
            // })
          }
        }
      });
    }
  }
};
</script>
<style>
/* pages/food/food.wxss */
.container {
  width: 100%;
  height: 100%;
  /* background-color: #f6f6f6; */
}
#scan {
  position: absolute;
  left: 30rpx;
  top: 30rpx;
  z-index: 1;
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAJ9QTFRFAAAAJyY2OTdIuLe/RENQJyc2Kyo6JyY3MS8/Kys5LCo6Ly4/KCY3LCo6pKOry8rSUU9ZTEpUKSc4Kig5amlyMC8/Ly49MzJALCs7LSw8LCs6REJRz8/Pg4ODUVBYKik5LS08sbCzU1JaSUhUWFZgrKuyNDRCzczTUE9cMzJBWFdfPj1LT05YMTA/LCo5MjBAWFZgLy4+Liw7rKuxzczSAh7VewAAADV0Uk5TAP+PCG/////vv+/P//EXF0dH/f878dLL/P/CTwIUQ/fqA2FvNhPeE3jbQo9H7L/PPObvFxYAJUDoAAAAw0lEQVR4nO2WyRKCMBBEZ1xAMYkRQcB933f9/28T8BCIWsVcxCp51+53SVWmGnqebyTZg0YzSMbBcg0ewxStF6WdLhzAR2TcUgx15X5VIbcRTUC0pxO99hGHI4aK289sAHRjpUYwoF4of65IuaUocykp9YKYChmokgEkAyUyUCaT9+vnjRA3Sn0hBDBG+shHxn73whTKVxSXojyngu1kNwbjUDEQR52G4qy3VqdEakUXZhPdGVPxZlypMOpymF1oe4zvHthuDxqlN2hbAAAAAElFTkSuQmCC) center no-repeat;
  background-size: 70%;
}
.top-bg {
  width: 100%;
  height: 422rpx;
  /* background-color: grey; */
}
.wrap {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 210rpx;
  background-color: #fff;
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;
  margin-top: -16rpx;
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.wrap > view:nth-of-type(2) {
  width: 100%;
  height: 86rpx;
  display: flex;
  justify-content: space-between;
  /* margin-top: -50px; */
}
.wrap > view:nth-of-type(2).fixed {
  position: fixed;
  left: 0;
  top: 0;
  padding: 0 20rpx;
  z-index: 1;
  background-color: #fff;
}
.wrap .position,.wrap .phone{
  font-size: 22rpx;
  display: flex;
  align-items: center;
  padding-top: 10rpx;
}
.wrap .phone{
  padding-left: 33rpx;
}
.wrap .position image {
  width: 35rpx;
  height: 35rpx;
}
.wrap .shop-logo {
  width: 152rpx;
  height: 152rpx;
  /* background-color: #f6f6f6; */
  position: absolute;
  right: 20rpx;
  top: -76rpx;
  border-radius: 10rpx;
}
.wrap .shop-logo image{
  width: 152rpx;
  height: 152rpx;
}
.wrap .plate {
  height: 100%;
  display: flex;
  color: #727272;
}
.wrap .plate > view {
  font-size: 30rpx;
  font-weight: 600;
  width: 110rpx;
  line-height: 72rpx;
  /* height: 64rpx; */
  text-align: center;
  white-space: nowrap;
}
.wrap .plate > view > text {
  font-size: 20rpx;
  margin-left: 20rpx;
  font-weight: 400;
}
.wrap .plate > view.active {
  color: #C7A86D;
  border-bottom: 6rpx solid #C7A86D;
  border-radius: 3rpx;
}
.wrap .plate > view:nth-of-type(2) {
  margin: 0 80rpx;
}
.wrap .search {
  width: 192rpx;
  height: 50rpx;
  line-height: 48rpx;
  border: 1px solid #e6e6e6;
  color: #d6d6d6;
  font-size: 20rpx;
  text-align: center;
  border-radius: 40rpx;
  margin-top: 12rpx;
}
.details .order {
  display: flex;
  /* flex-direction: column; */
  /* height: 736rpx; */
  /* height: 100vh; */

}

.details .order.fixed {
  position: absolute;
  background-color: #f6f6f6;
}

.details .order > view:last-child {
  display: flex;
}

.order .order-left {
  /* width: 164rpx; */
  /* background-color:  #f6f6f6; */
}

.order .order-left .sort-item {
  position: relative;
  width: 164rpx;
  height: 92rpx;
  line-height: 92rpx;
  text-align: center;
  color: #6f6f6f;
  font-size: 24rpx;
  background-color: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.order .order-left .sort-item text{
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}

.order .order-left .sort-item.active {
  background-color: #fff;
  font-weight: 700;
}
.order .order-left .sort-item .num {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  width: 34rpx;
  height: 34rpx;
  line-height: 34rpx;
  border-radius: 50%;
  color: #fff;
  background-color: red;
  font-size: 20rpx;
}

.order .order-right {
  width: 586rpx;
}
.order .order-right.pt {
  padding-top: 92rpx;
}
.order .order-right .product {
  padding: 0 20rpx 0 16rpx;
  background: white;
}
.product .product-sort,
.order-right .product-sort-fixed {
  width: 586rpx; 
  height: 92rpx;
  line-height: 92rpx;
  color: #6f6f6f;
  font-size: 24rpx;
  /* background-color: #f6f6f6; */
  font-weight: 700;
}
.order-right .product-sort-fixed {
  position: fixed;
  right: 0;
  top: 355rpx;
  padding-left: 16rpx; 
}
.product .product-item {
  width: 544rpx; 
  height: 184rpx;
  display: flex;
  margin-bottom: 20rpx;
  background-color: white;
  padding: 20rpx 10rpx;
  box-sizing: content-box;
}
.product .product-item:hover{
  background-color: #F6F6F6;
}
.product-item .product-left image {
  width: 182rpx;
  height: 182rpx;/*121.03*/
  /* background-color: grey; */
  border-radius: 16rpx;
}
.product-left{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.product-item .product-right {
  width: 342rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20rpx;
}
.product-item .product-right .title {
  font-size: 28rpx;
  font-weight: bold;
}
.product-item .product-right > view {
  display: flex;
  justify-content: space-between;
}
.product-item .product-right > view .price {
  color: red;
}
.product-item .product-right > view .price > text:first-child {
  font-size: 24rpx;
}
.product-item .product-right > view .price > text:last-child {
  font-size: 20rpx;
  color: #d6d6d6;
}
.product-item .product-right > view .price > .old-price{
  font-size: 24rpx;
  color: #c6c6c6;
  text-decoration: line-through;
}
.product-item .product-right > view .red-add,
.goods-details .red-add{
  display: flex;
}
.product-item .product-right > view .red-add .red,
.product-item .product-right > view .red-add .add,
.goods-details .red-add .red,
.goods-details .red-add .add {
  width: 55rpx;
  height: 55rpx;
  line-height: 55rpx;
  border: 1px solid #C7A86D;
  border-radius: 50%;
  text-align: center;
}
.product-item .product-right > view .red-add .red,
.goods-details .red-add .red {
  color: #C7A86D;
}
.product-item .product-right > view .red-add .add,
.goods-details .red-add .add {
  color: #fff;
  background: #C7A86D;
}
.product-item .product-right > view .red-add .num,
.goods-details .red-add .num {
  height: 55rpx;
  line-height: 55rpx;
  font-size: 20rpx;
  margin: 0 28rpx;
}

.goods-details {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
}
.goods-details .close {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  z-index: 2;
  width: 56rpx;
  height: 56rpx;
  line-height: 48rpx;
  /* background-color: rgba(0, 0, 0, .3); */
  font-size: 34rpx;
  text-align: center;
  color: #fff;
  border-radius: 50%;
}
.goods-details > image {
  width: 100%;
  /*height: 422rpx;*/
  /* background: #808080; */
}
.goods-details > view:nth-of-type(2) {
  width: 100%;
  height: 168rpx;
  background-color: #fff;
  padding: 30rpx 40rpx;
}
.goods-details .goods-title {
  font-weight: bold;
}
.goods-details .price {
  color: #C7A86D;
}
.goods-details .buttom {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.goods-details > view:nth-of-type(3) {
  margin-top: 20rpx;
  width: 100%;
  background-color: #fff;
  padding: 30rpx 40rpx;
}
.goods-details .dishes-details {
  font-size: 26rpx;
  font-weight: bold;
}
.goods-details .info {
  font-size: 26rpx;
  color: #6B6B6B;
  margin-top: 20rpx;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
  height: 102rpx;
  background-color: #69a6d2;
  display: flex;
  align-items: center;
}
.footer image {
  width: 120rpx;
  height: 104rpx;
  /* background-color: grey; */
  margin: 0 0 60rpx 22rpx;
}
.footer .num {
  position: absolute;
  left: 130rpx;
  top: -40rpx;
  width: 34rpx;
  height: 34rpx;
  line-height: 34rpx;
  border-radius: 50%;
  color: #fff;
  background-color: red;
  font-size: 20rpx;
  text-align: center;
}
.footer .price-count {
  width: 320rpx;
  color: #333;
  font-size: 24rpx;
  margin-left: 44rpx;
}
.footer .price-count > text {
  font-size: 40rpx;
}
.footer .buy {
  width: 224rpx;
  height: 76rpx;
  line-height: 76rpx;
  color: #f6f6f6;
  font-size: 28rpx;
  text-align: center;
  background-color: #FF6100;  
  border-radius: 40rpx;
}
.shop-cart-details {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .3);
}
.shop-cart-details .goods {
  position: absolute;
  left: 0;
  bottom: 102rpx;
  width: 100%;
  background: #fff;
}
.shop-cart-details .goods .goods-title {
  width: 100%;
  height: 82rpx;
  line-height: 82rpx;
  color: #6B6B6B;
  display: flex;
  justify-content: space-between;
  padding: 0 30rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #ccc;
}
.shop-cart-details .goods .goods-title > view {
  display: flex;
  justify-content: center;
  align-items: center;
}
.shop-cart-details .goods .goods-title icon {
  width: 30rpx;
  height: 30rpx;
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576069322746&di=b7a90063664ef88be70ce789892f61c1&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F00%2F92%2F64%2F2756f22d1a2dc11.jpg") no-repeat;
  background-size: cover;
  margin-right: 10rpx;
}
.shop-cart-details .goods .goods-list {
  max-height: 682rpx;
  margin-top: 40rpx;
  padding: 0 30rpx;
}
.shop-cart-details .goods .goods-list .product-item{
  width: 544rpx; 
  height: 184rpx;
  display: flex;
  margin-bottom: 40rpx;
}
.shop-cart-details .goods-list .product-item .product-right > view {
  width: 500rpx;
}
.details{
  margin-bottom: 110rpx;
}
.details .business {
  width: 100%;
  height: 310rpx;
  background-color: #fff;
  margin-top: 20rpx;
  padding: 30rpx 40rpx;
}
.details .business .title {
  font-size: 34rpx;
  font-weight: 500;
}
.details .business .position-phone,
.details .business .business-time,
.details .business .delivery-time {
  font-size: 24rpx;
  color: #6D6D6D;
  margin: 34rpx 0;
}
.details .business .position-phone {
  display: flex;
  justify-content: space-between;
}
.details .business .position-phone .calling {
  display: block;
  width: 40rpx;
  height: 40rpx;
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576064828462&di=26c3cd85565de626ead18d037e1d3958&imgtype=0&src=http%3A%2F%2Fpic198.nipic.com%2Ffile%2F20181218%2F24206642_170543603036_2.jpg") no-repeat;
  background-size: cover;
}
.search-plate {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100vh;
  background-color: #F6F6F6
}
.search-plate .search-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 114rpx;
  background-color: #fff;
  padding: 0 30rpx;
}
.search-plate .search-box {
  display: flex;
  align-items: center;
  width: 602rpx;
  height: 60rpx;
  border: 1px solid #ccc;
  border-radius: 40rpx;
}
.search-plate .search-box icon {
  width: 30rpx;
  height: 30rpx;
  background: url("https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3867653909,4250733493&fm=26&gp=0.jpg") no-repeat;
  background-size: cover;
  margin: 4rpx 0 0 20rpx;
}
.search-plate .search-box input {
  width: 100%;
  padding: 0 20rpx;
  font-size: 24rpx;
}
.search-plate .search-box .placeholder-class {
  font-size: 24rpx;
}
.search-plate .search-top .cancel {
  font-size: 26rpx;
}
.search-plate .history-search,
.search-plate .goods-list {
  padding: 0 30rpx;
}
.search-plate .history-search {
  margin-top: 20rpx;
}
.search-plate .history-search > text {
  font-size: 26rpx;
  font-weight: 700;
}
.search-plate .history-search > .history-item {
  margin-top: 20rpx;
}
.search-plate .history-search > .history-item > text {
  display: inline-block;
  font-size: 26rpx;
  height: 56rpx;
  line-height: 56rpx;
  background-color: #fff;
  padding: 0 30rpx;
  border-radius: 30rpx;
  margin: 0 20rpx 20rpx 0;
}
.search-plate .goods-list {
  height: 1000rpx;
}
.search-plate .goods-list .product-item {
  width: 630rpx; 
  height: 184rpx;
  display: flex;
  margin: 40rpx 0;
}
.search-plate .goods-list .product-item .product-right {
  width: 430rpx;
}

/*隐藏滚动条*/
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.order-detail{
  background-color: #F6F6F6;
  width: 100%;
  min-height: 66vh;
  padding: 30rpx;
  overflow-y: scroll;
}
.order-box{
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-size: 32rpx;
  margin-bottom: 25rpx;
}

.order-title{
  display: flex;
  align-items: center;
  padding-left: 25rpx;
  height: auto;
  border-left: 2px solid #E35952;
  color: #E35952;
  box-sizing: border-box;
  margin-bottom: 10rpx;
  font-size: 28rpx;
}
.order-menu{
  display: flex;
  flex-direction: column;
  /* max-height: 54vh; */
  overflow-y: scroll;
}
.order-list{
  width: 100%;
  display: flex;
  padding: 20rpx 20rpx;
  justify-content: space-between;
  font-size: 26rpx;
}
.order-food-name{
  width: 60%;
}
.order-unit{
  font-size: 22rpx;
  color: #A0A0A0;
}

.total{
  padding: 10rpx 20rpx;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  border-bottom: 1px solid #F3F3F3;
  border-top: 1px solid #F3F3F3;
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

.label{
  display: inline-block;
  font-size: 20rpx;
  color: #333;
  padding: 5rpx;
  background-color: #F3F3F3;
  margin-right: 10rpx;
}
.appraise,.label-box{
  display: flex;
  justify-content: flex-start !important;
  word-wrap:break-word;
}
.appraise text,.selected-count{
  display: inline-block;
  font-size: 20rpx;
}
.appraise text:nth-child(1){
  margin-right: 10rpx;
}

.sort-icon{
  width: 50rpx;
  height: 50rpx;
}
.sort-icon-box{
  display: flex;
  align-items: center;
}
.discount{
  position: relative;
  /* top: -5rpx; */
  font-size: 20rpx;
  padding-left: 25rpx;
  color: red;
  letter-spacing: 5rpx;
  display: block !important;
}
.discount image{
  width: 20rpx;
  height: 20rpx;
}
/* 轮播图 */
.lb{
  width: 100%;
  height: 241rpx;
  text-align: center;
}
.lb image{
  /* border-radius:16rpx; */
  width: 750rpx;
  height: 422rpx;
}

#close-model{
  width: 75rpx;
  height: 75rpx;
  background-color: white;
  position: fixed;
  bottom: 150rpx;
  right: 40rpx;
  border-radius: 37.5rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
#close-model image{
  width: 50rpx;
  height: 50rpx;
}
</style>
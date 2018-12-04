var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabbar: {},
    imgUrls: [],
    tabs: ["图文详情", "商品参数"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 33,
    showModalStatus_alone: false,
    showModalStatus: false,
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    id: 0,
    page: [],
    specifiction: [], //商品规格
    nowspecifiction: [],
    payprice: 0,
    _num: 0,
    seller: [] ,//店铺信息
    Model:""
  },
  //加入购物车
  addToCart:function(){
    var that = this
    wx.showModal({
      title: '您确定要加入购物车吗？',
      content: wx.getStorageSync("cakename") + "(" + that.data.nowspecifiction.name + "*" + that.data.num + ")",
      success(res){
        if(res.confirm){
          var item = {
            goods_name: wx.getStorageSync("cakename"),
            goods_image: that.data.imgUrls[0],
            num: that.data.num,
            goods_price: that.data.nowspecifiction.discount / 100.0,
            goods_id: that.data.id,
            specification_id: that.data.nowspecifiction.id,
            specification_name: that.data.nowspecifiction.name,
            selected: true
          };
          var cart = wx.getStorageSync("cart");
          if(cart == ""){
            cart = [];
            cart.push(item)
            wx.setStorageSync('cart', cart)
          }else{
            cart.push(item)
            wx.setStorageSync('cart', cart)
          }
          that.setData({
            showModalStatus_alone:false
          })
          wx.showToast({
            title: '添加成功',
          })
          console.log(cart)
        }
      }
    })

  },
  zhongchou:function(){
    var that = this
    wx.setStorageSync('payprice', that.data.payprice)
    wx.setStorageSync('nowspecifiction', that.data.nowspecifiction)
    wx.setStorageSync('num', that.data.num)
    wx.setStorageSync('goods_id', that.data.id)
    wx.navigateTo({
      url: '../cf/addOrderInfo/addOrderInfo',
    })
  },
  //显示单独付款
  showModal_alone: function (e) {
    // 显示遮罩层
    var that = this
    that.setData({
      Model: e.currentTarget.id
    })
    console.log(e)
    wx.setStorageSync('pay_type', e.currentTarget.id)
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus_alone: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  selectsize: function (e) {
    var that = this
    console.log(e)
    this.setData({
      num: 1,
      _num: e.target.dataset.num,
      payprice: that.data.specifiction[e.target.dataset.num].discount / 100,
      nowspecifiction: that.data.specifiction[e.target.dataset.num]
    })
  },
  /* 点击减号 */
  bindMinus: function () {
    var that = this
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }

    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      payprice: (that.data.nowspecifiction.discount * num) / 100
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var that = this
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    console.log(num, "数量值")
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      payprice: (that.data.nowspecifiction.discount * num) / 100
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {

  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  opensize: function () {

  },
  pur_firstTo: function () {
    var that = this
    wx.setStorageSync('payprice', that.data.payprice)
    wx.setStorageSync('nowspecifiction', that.data.nowspecifiction)
    wx.setStorageSync('num', that.data.num)
    wx.setStorageSync('goods_id', that.data.id)
    wx.navigateTo({
      url: '../addOrderInfo/addOrderInfo',
    })
  },
  pur_secondTo: function () {
    wx.navigateTo({
      url: '../raise_money/raise_money',
    })
  },
  onLoad: function (options) { 
    // app.editTabBar();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });
  },
  
  //显示众筹对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        showModalStatus_alone: false,
      })
    }.bind(this), 200)
  },

  getcakeinfo: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + '/api/getGood/' + that.data.id,
      success: function (res) {
        //console.log(res.data)
        var result = res.data
        //console.log(result, "result")
        WxParse.wxParse('article', 'html', result.introduce, that, 5)
        WxParse.wxParse('article1', 'html', result.detail, that, 5)
        wx.setStorageSync('cakename', result.name)
        wx.setStorageSync("startTime", result.seller.startTime)
        wx.setStorageSync("endTime", result.seller.endTime)
        that.setData({
          page: result,
          imgUrls: result.image,
          specifiction: result.specifiction,
          seller:result.seller,
          nowspecifiction: result.specifiction[0],
          payprice: result.specifiction[0].discount / 100
        })
        wx.hideLoading()
      }
    })
  },
  toShop:function(e){
    var seller_id = e.currentTarget.dataset.seller_id
    wx.setStorageSync('seller_id', seller_id)
    wx.navigateTo({
      url: '../business_info/business_info',
    })
  },
  onLoad: function (options) {
    console.log(options.id)
    var that = this
    this.setData({
      id: options.id
    })
    this.getcakeinfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
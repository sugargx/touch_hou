var app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payprice: 99999,
    cakename: '',
    leave_message: "",
    address: "",

    distribution: '',
    city: "",
    nowspecifiction: '',
    num: '',
    friend_nick_name: "",
    friend_phone: "",
    // showModal: false,

    //下拉框
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['8月10日 9:00', '14:00-16:00', '17:00-21:00', ], //下拉列表的数据
    index: 0, //选择的下拉列表下标,

    order_id:0,     //分享用
    pay_type:""
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  distributionChange: function(e) {
    this.setData({
      distribution: e.detail.value
    })
    console.log(e, '派送时间')
  },
  buyTo: function() {
    var that = this
    if(that.data.distribution==''){
      wx.showModal({
        title: '错误提示',
        content: '请选择配送时间！',
      })
      return;
    }
    var goods = wx.getStorageSync('goods')
    if(goods == ""){
      var goods = [{
        'goods_id': wx.getStorageSync("goods_id"),
        "num": that.data.num,
        "specification_id": that.data.nowspecifiction.id,
      }];
    }
    
    wx.request({
      url: app.globalData.url + '/api/WxPay',
      data: {
        money: that.data.payprice,
        openid: app.globalData.userInfo.openid,
        "leave_message": that.data.leave_message,
        "address": that.data.address,
        "distribution": that.data.distribution,
        "city": that.data.city,
        "purchaser_id": app.globalData.userInfo.id,
        "friend_nick_name": that.data.friend_nick_name,
        "friend_phone": that.data.friend_phone,
        "notice":wx.getStorageSync("notice"),
        "goods":goods
      },
      success: function(res) {
        console.log(res.data)
        if(res.data.error==1){
          wx.showModal({
            title: '小派提醒您',
            content: res.data.msg,
          })
          return;
        }
        console.log(res.data.data.jsapi);
        var order_num = res.data.data.order;
        wx.setStorageSync("order_id", res.data.order_id)
        var jsapi = res.data.data.jsapi
        wx.requestPayment({
          'timeStamp': jsapi.timeStamp,
          'nonceStr': jsapi.nonceStr,
          'package': jsapi.package,
          'signType': 'MD5',
          'paySign': jsapi.paySign,
          'success': function(res) {
            console.log(res)
            wx.request({
              url: app.globalData.url + "/api/searchWxPayStatus",
              method: "POST",
              data: {
                "order_num": order_num,
              },
              success: function(res) {
                console.log(res)
                if (res.data.code == 1) {
                  // that.setData({
                  //   showModal: true
                  // })
                  if (wx.getStorageSync("pay_type") == 'gwc'){
                    wx.navigateTo({
                      url: '../cart_pay_success/cart_pay_success',
                    })
                    wx.setStorageSync("cart", "")
                    return ;
                  }
                  wx.navigateTo({
                    url: '../pay_success/pay_success',
                  })
                } else {
                  wx.showToast({
                    title: '未支付!',
                  })
                }
              },
              fail: function() {
                wx.showToast({
                  title: '未支付!',
                })
              }
            })
          },
          'fail': function(res) {

          }
        })
      }
    })

  },
  gocamera: function() {
    this.setData({
      showModal: false
    })
    wx.navigateTo({
      url: '../camera/camera',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var pay_type = wx.getStorageSync("pay_type")
    that.setData({
      
      nowspecifiction: wx.getStorageSync('nowspecifiction'),
      num: wx.getStorageSync('num'),
      cakename: wx.getStorageSync('cakename'),
      address: wx.getStorageSync("friend_address"),
      friend_nick_name: wx.getStorageSync('friend_nick_name'),
      friend_phone: wx.getStorageSync("friend_phone"),
      distribution: wx.getStorageSync("distribution"),
      leave_message: wx.getStorageSync("leave_message"),
      city:wx.getStorageSync("city"),
      pay_type:wx.getStorageSync("pay_type"),
      carts:wx.getStorageSync("cart")
    })
    if (pay_type == "gwc") {
      this.setData({
        payprice: wx.getStorageSync('totalPrice'),
      })
    } else {
      this.setData({
        payprice: wx.getStorageSync('payprice')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this
    var title = wx.getStorageSync("friend_nick_name") + "生日祝福"
    var path = "pages/share_after/share_after?order_id=" + wx.getStorageSync("order_id")
    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})
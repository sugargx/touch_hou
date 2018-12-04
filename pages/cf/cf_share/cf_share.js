// pages/video_play/video_play.js
var tools = require('../../../utils/myTools.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: getApp(),
    cf_id: 1,
    each_money:9999,
    goodFriends:[],
    receiver_name:"",
    people_num:100
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    this.setData({
      cf_id:options.cf_id
    })
    var that = this
    tools.getAppInfo().then((res) => {
      that.setData({
        "app.globalData.appInfo": res.data
      })
    })

    tools.ifILogin().then(res => {
      console.log(res, "then")
    }).catch((res) => {
      console.log(res, "catch")
    })
    this.getCfByid()
  },
  getCfByid: function() {
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getCfById",
      data: {
        cf_id: that.data.cf_id
      },
      success: function(res) {
        if(res.data.error == 0){
          that.setData({
            each_money:res.data.data.each_money,
            goodFriends: res.data.data.goodFriends,
            receiver_name: res.data.data.receiver_name,
            people_num: res.data.data.people_num,
          })
        } 
      }
    })
  },
  bindGetUserInfo: function(e) {
    var that = this
    if (app.globalData.userInfo) {
      wx.request({
        url: app.globalData.url + "/api/zcPayMoney",
        data:{
          'cf_id':that.data.cf_id,
          'openid':app.globalData.userInfo.openid,
          'money': that.data.each_money,
          'user_id':app.globalData.userInfo.id
        },
        success:function(res){
          console.log(res)
          if(res.data.error == 0){
            var jsapi = res.data.data.jsapi
              wx.requestPayment({
                timeStamp: jsapi.timeStamp,
                nonceStr: jsapi.nonceStr,
                package: jsapi.package,
                signType: jsapi.signType,
                paySign: jsapi.paySign,
                success:function(res){
                  console.log(res)
                  that.onLoad()
                }
              })
          } else if (res.data.error == 1) {
            wx.showModal({
              title: '小派提醒',
              content: res.data.msg,
            })
          }
        }
      })
    } else {
      tools.login().then((res) => {
        wx.request({
          url: app.globalData.url + "/api/zcPayMoney",
          data: {
            'cf_id': that.data.cf_id,
            'openid': app.globalData.userInfo.openid,
            'money': that.data.each_money,
            'user_id': app.globalData.userInfo.id
          },
          success: function (res) {
            console.log(res)
            if (res.data.error == 0) {
              var jsapi = res.data.data.jsapi
              wx.requestPayment({
                timeStamp: jsapi.timeStamp,
                nonceStr: jsapi.nonceStr,
                package: jsapi.package,
                signType: jsapi.signType,
                paySign: jsapi.paySign,
                success: function (res) {
                  console.log(res)
                  that.onLoad()
                }
              })
            } else if (res.data.error == 1) {
              wx.showModal({
                title: '小派提醒',
                content: res.data.msg,
              })
            }
          }
        })
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
  onShow: function() {},

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
    this.onLoad()
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
    var title = that.data.receiver_name + "生日礼物众筹"
    var path = "pages/cf/cf_share/cf_share?cf_id=" + this.data.cf_id
    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})
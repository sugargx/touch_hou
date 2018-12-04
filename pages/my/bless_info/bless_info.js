// pages/getinfo/getinfo.js
var tools = require('../../../utils/myTools.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friend_nick_name: "",
    friend_phone: "",
    app: getApp()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      friend_nick_name: wx.getStorageSync("friend_nick_name"),
      friend_phone: wx.getStorageSync("friend_phone"),
    })
    tools.ifILogin().then(res => {
      console.log(res, "then")
    }).catch((res) => {
      console.log(res, "catch")
    })
  },

  bindGetUserInfo: function (e) {

    var that = this
    if(app.globalData.login == 0){
      tools.login().then((res) => {
        that.create_new_bless()
      })
    }else if(app.globalData.login == 1){
      that.create_new_bless()
    }
  },
  create_new_bless:function(){
    var that = this
    var phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var phone = that.data.friend_phone
    var name = that.data.friend_nick_name

    if (!phonereg.test(phone)) {
      wx.showModal({
        title: '错误提示',
        content: '手机号无效！',
      })
      return;
    }
    if (name == 0) {
      wx.showModal({
        title: '错误提示',
        content: '好友姓名无效！',
      })
      return;
    }
    wx.setStorageSync("order_id", "")
    wx.showModal({
      title: '小派提醒',
      content: '您确定要发起新的祝福吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + "/api/bless/create",
            method: "POST",
            data: {
              user_id: app.globalData.userInfo.id,
              receiver_phone: phone,
              receiver_name: name
            },
            success: function (res) {
              if (res.data.error == 0) {
                wx.setStorageSync("bless_id", res.data.bless.id)
                wx.navigateTo({
                  url: '../../camera/camera',
                })
              }
            }
          })
        }
      }
    })
  },
  friend_nick_name_change: function (e) {
    //console.log(e.detail.value)
    this.setData({
      friend_nick_name: e.detail.value
    })
    wx.setStorageSync('friend_nick_name', e.detail.value)
  },
  friend_phone_input: function (e) {
    //console.log(e.detail.value)
    wx.setStorageSync("friend_phone", e.detail.value)
    this.setData({
      friend_phone: e.detail.value
    })
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
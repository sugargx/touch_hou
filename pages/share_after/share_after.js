var app = getApp()
var tools = require('../../utils/myTools.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    icon: '../../images/icon-person.png',
    blessFriends: [],
    order: [],
    purchaser: [],
    order_id: 0,
    bless:[],
    app: getApp()
  },

  /**
   * 生命周期函数--监听页面加载
   */

  getOrderShareInfo: function() {
    var that = this
    var bless_id = that.data.bless_id
    wx.request({
      url: app.globalData.url + "/api/getBlessShareInfo",
      method: "POST",
      data: {
        'bless_id': bless_id
      },
      success: function(res) {
        console.log(res.data, 'order_info')
        that.setData({
          purchaser: res.data.purchaser,
          bless: res.data.bless,
          blessFriends: res.data.blessFriends
        })
        wx.setStorageSync('purchaser_id', res.data.purchaser.id)
      }
    })
  },
  onLoad: function(options) {
    tools.getAppInfo().then((res) => {
      that.setData({
        "app.globalData.appInfo": res.data
      })
    })
    var that = this
    console.log(options)
    if (options.bless_id) {
      this.setData({
        bless_id: options.bless_id
      })
      wx.setStorageSync("bless_id", options.bless_id)
    } else {
      this.setData({
        bless_id: wx.getStorageSync("bless_id")
      })
    }
    this.getOrderShareInfo()
    if (!app.globalData.userInfo || !app.globalData.userInfo.id){
      tools.ifILogin().then(res => {
        console.log(res, "then")
      }).catch((res) => {
        console.log(res, "catch")
      })
    }
  },

  bindGetUserInfo: function(e) {
    wx.setStorageSync("order_id", "")
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      console.log(e.detail.userInfo)
      if (e.detail.userInfo) {
        tools.login().then((res)=>{
          wx.navigateTo({
            url: '../video_list/video_list',
          })
        })
      }
    }
    if (app.globalData.userInfo && app.globalData.userInfo.id) {
      wx.navigateTo({
        url: '../video_list/video_list',
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
    var title = that.data.bless.receiver_name + "生日祝福"
    var path = "pages/share_after/share_after?bless_id=" + that.data.bless_id
    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})
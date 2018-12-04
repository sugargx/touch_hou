var app = getApp()
var tools = require('../../utils/myTools.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    app: getApp(),
    friend_name: "",
    friend_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toIndex:function(){
    wx.switchTab({
      url: '../guide/guide',
    })
  },
  onLoad: function (options) {
    tools.getAppInfo().then((res) => {
      that.setData({
        "app.globalData.appInfo": res.data
      })
    })
    var that = this
    console.log(options)
    if (options.user_id) {
      this.setData({
        friend_id: options.user_id
      })
    }
    this.getUserByid()
    if (!app.globalData.userInfo || !app.globalData.userInfo.id) {
      tools.ifILogin().then(res => {
        console.log(res, "then")
      }).catch((res) => {
        console.log(res, "catch")
      })
    }
  },
  getUserByid: function () {
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getUserById",
      method: "post",
      data: {
        "user_id": that.data.friend_id
      },
      success: function (res) {
        console.log(res, "身份信息")
        that.setData({
          friend_name: res.data.name ? res.data.name : res.data.nick_name
        })
      }
    })
  },
  bindGetUserInfo: function (e) {
    var that = this
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      console.log(e.detail.userInfo)
      if (e.detail.userInfo) {
        tools.login().then((res) => {
          that.agree().then((res) => {
            if (res.data.error == 0) {
              wx.navigateTo({
                url: '../addfriend_success/addfriend_success',
              })
            }else{
              wx.showModal({
                title: '小派提醒',
                content: that.data.friend_name + '已是您的好友了',
              })
            }
          })

        })
      }
    }
    if (app.globalData.userInfo && app.globalData.userInfo.id) {
      that.agree().then((res) => {
        if (res.data.error == 0) {
          wx.navigateTo({
            url: '../addfriend_success/addfriend_success',
          })
        } else {
          wx.showModal({
            title: '小派提醒',
            content: that.data.friend_name + '已是您的好友了',
          })
        }
      })
    }

  },
  agree: function () {
    var that = this
    if (app.globalData.userInfo.id == parseInt(that.data.friend_id)){
      wx.showModal({
        title: '小派提醒',
        content: '不能添加自己为好友',
      })
      return ;
    }
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + "/api/invitation",
        method: "post",
        data: {
          'user_id': app.globalData.userInfo.id,
          'friend_id': that.data.friend_id
        },
        success: function (res) {
          console.log(res.data)
          resolve(res)
        }
      })
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
})
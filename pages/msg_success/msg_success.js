// pages/msg_success/msg_success.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiver:""
  },
  myGoto:function(){
     wx.navigateTo({
       url: '../video_list/video_list',
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var bless_id = wx.getStorageSync("bless_id")
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + "/api/getBlessById?bless_id=" + bless_id,
      success:function(res){
        console.log(res.data)
        if(res.data.error == 0){
          var receiver = res.data.bless.receiver_name
          that.setData({
            receiver: receiver
          })
        }
        wx.hideLoading()
      }
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
    var that = this
    var title = that.data.receiver + "生日祝福"
    var path = "pages/share_after/share_after?bless_id=" + wx.getStorageSync("bless_id")
    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})
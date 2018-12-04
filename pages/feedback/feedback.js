// pages/feedback/feedback.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordCount:0,
    app:getApp()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  contentChange:function(e){
    this.setData({
      wordCount:e.detail.value.length
    })
  },
  submit:function(e){
    console.log(e)
    var phone = e.detail.value.phone
    var content = e.detail.value.content
    if (content.length<20){
      wx.showModal({
        title: '提示',
        content: '反馈内容不得少于20个字符！',
      })
      return ;
    }
    var phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phonereg.test(phone)) {
      wx.showModal({
        title: '错误提示',
        content: '手机号无效！',
      })
      return;
    }
    wx.request({
      url: app.globalData.url + '/api/feedback',
      method:'POST',
      data:{
        "content": content,
        "phone": phone,
      },
      success:function(res){
        console.log(res.data.errorcode)
        if (res.data.errorcode==0){
          wx.showToast({
            title: '反馈成功！',
          })
        }
      }
    })
  },
  onLoad: function (options) {
  
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
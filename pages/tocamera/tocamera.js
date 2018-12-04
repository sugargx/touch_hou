// pages/tocamera/tocamera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '亲人', value: '亲人' },
      { name: '朋友', value: '朋友', checked: 'true' },
      { name: '同学', value: '同学' },
      { name: '同事', value: '同事' },
      { name: '其他', value: '其他' },
    ],
    relation:"朋友"
  },
  radioChange: function (e) {
    this.setData({
      relation: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  tocamera: function(){
    wx.setStorageSync("relation", this.data.relation)
    wx.navigateTo({
      url: '../camera/camera',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
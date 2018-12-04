// pages/tocamera/tocamera.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
    ],
    relationship_id:0
  },
  radioChange: function(e) {
    this.setData({
      relationship_id: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  yidongStatus: function() {
    var that = this
    if (this.data.relationship_id==0){
      wx.showModal({
        title: '错误提示',
        content: '请选择一个好友分类',
      })
      return ;
    }
    wx.request({
      url: app.globalData.url + "/api/editRelationship",
      method:"POST",
      data:{
        'user_id':app.globalData.userInfo.id,
        'friend_id': wx.getStorageSync('friend_id'),
        'relationship_id': that.data.relationship_id
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==0){
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
    
  },
  getRelationship:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getRelationship",
      success:function(res){
        var relations = res.data
        console.log(relations)
        that.setData({
          items:relations
        })
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRelationship()
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

  }
})
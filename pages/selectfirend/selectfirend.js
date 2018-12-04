var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    firends:[],
    flag: false
  },
  toAddFriend:function(){
    wx.navigateTo({
      url: '/pages/addfriends/addfriends',
    })
  },
  choose:function(e){
    var friend_nick_name = e.currentTarget.dataset.friend_nick_name;
    var friend_id = e.currentTarget.dataset.friend_id;
    wx.setStorageSync("friend_nick_name", friend_nick_name);
    wx.setStorageSync("friend_id", friend_id)
    wx.navigateBack({})
  },
  getfriends: function () {
    var that = this
    wx.request({
      method: "POST",
      url: app.globalData.url + '/api/showAllFriend',
      data: {
        id: app.globalData.userInfo.id
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code!=0){
          var result = res.data.data
          that.setData({
            firends: result
          })
          console.log(that.data.itemData)
        }
        else{
          that.setData({
            flag: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getfriends()
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
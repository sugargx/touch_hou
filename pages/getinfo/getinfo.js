// pages/getinfo/getinfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friend_nick_name: "",
    friend_phone: "",
    friend_address: "",
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
      friend_address: wx.getStorageSync("friend_address")
    })
  },

  toGoods: function () {
    var that = this
    var phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;

    if (!phonereg.test(that.data.friend_phone)) {
      wx.showModal({
        title: '错误提示',
        content: '手机号无效！',
      })
      return;
    }
    if (that.data.friend_nick_name == 0) {
      wx.showModal({
        title: '错误提示',
        content: '好友姓名无效！',
      })
      return;
    }

    if (that.data.friend_address == "") {
      wx.showModal({
        title: '小派提醒',
        content: '请您输入地址',
      })
      return;
    }
    that.checkAddress().then((res) => {
      console.log(res.data.result, "success")
      if(res.data.status == 0){
        var result = res.data.result
        var reliability = result.reliability
        if (reliability >= 7) {
          var city = result.address_components.city
          var lng = result.location.lng
          var lat = result.location.lat
          wx.setStorageSync("city", city)
          wx.setStorageSync("lng", lng)
          wx.setStorageSync("lat", lat)

          var goods = wx.getStorageSync('goods')
          if(goods == ""){
            wx.navigateTo({
              url: '../all/all',
            })
          }else{
            wx.navigateTo({
              url: '../addOrderInfo/addOrderInfo',
            })
          }
          
        } else {
          wx.showModal({
            title: '小派提醒',
            content: '请输入有效的地址，例如山东省淄博市张店区山东理工大学西校区六号楼***房间。',
          })
          return;
        }
      }
      else{
        wx.showModal({
          title: '小派提醒',
          content: '请输入有效的地址，例如山东省淄博市张店区山东理工大学西校区六号楼***房间。',
        })
        return;
      }
    }).catch((res) => {
      console.log(res)
      wx.showModal({
        title: '小派提醒',
        content: '系统故障！请联系开发人员解决！',
      })
      return;
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
  friend_address_input: function (e) {
    //console.log(e)
    this.setData({
      friend_address: e.detail.value
    })
    wx.setStorageSync('friend_address', e.detail.value)
  },
  checkAddress: function () {
    var that = this
    var address = that.data.friend_address
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.url + "/api/convertAddressToLocation",
        data: {
          address: address
        },
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/friendmap/friendmap.js
// 引入腾讯地图SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    hint: [],
    mapapi: null,
    longitude: 118.001747,
    latitude: 36.810384,
    markers: [],

    provice:"",
    city:"",
    district:"",
    detail:"",
    placeName:""
  },
  toInfo:function(e){
    var that = this;
    console.log(that.data.provice, "跳转函数的参数——省")
    if (!that.data.inputVal){
      wx.showToast({
        title: '请输入地址！',
      })
      return ;
    }
    wx.navigateTo({
      url: `../getinfo/getinfo?provice=${that.data.provice}city=${that.data.city}district=${that.data.district}detail=${that.data.detail}`,
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  showInput: function() {
    var that = this
    this.setData({
      inputShowed: true
    });
    that.data.mapapi.getSuggestion({
      keyword: that.data.inputVal,
      success: function (res) {
        console.log(res.data);
        that.setData({
          hint: res.data
        })
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    var that = this

    // 调用接口
    that.data.mapapi.getSuggestion({
      keyword: e.detail.value,
      success: function(res) {
        console.log(res.data);
        that.setData({
          hint: res.data
        })
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    });

    console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value
    });
  },
  chooseAddress: function(e) {
    var that = this
    var title = e.currentTarget.dataset.title;
    var address = e.currentTarget.dataset.address;
    wx.setStorageSync('title', title)
    wx.setStorageSync('address', address)
    that.setData({
      hint: []
    })
    console.log(e.currentTarget.dataset.title)
    var palceName = e.currentTarget.dataset.title
    that.data.mapapi.geocoder({
      address: address,
      success: function(res) {
        if (res.status == 0) {
          var location = res.result.location
          var address_components = res.result.address_components
          console.log(location)
          console.log(address_components,"地址信息")
          var markers = [{
            iconPath: "/images/marker.png",
            id: 0,
            latitude: location.lat,
            longitude: location.lng,
            width: 50,
            height: 50
          }]
          that.setData({
            latitude: location.lat,
            longitude: location.lng,
            markers:markers,

            provice: address_components.province,
            city: address_components.city,
            district: address_components.district,
            detail: address_components.street + address_components.street_number,
            placeName: palceName,
            inputVal: palceName
          })
          wx.setStorageSync("lng", location.lng)
          wx.setStorageSync("lat", location.lat)
          wx.setStorageSync("provice", that.data.provice)
          wx.setStorageSync("city", that.data.city)
          wx.setStorageSync("district", that.data.district)
          wx.setStorageSync("detail", that.data.detail)
          wx.setStorageSync("placeName", palceName)

          console.log(that.data.provice, "省")
          console.log(that.data.city, "市")
          console.log(that.data.district, "区")
          console.log(that.data.detail, "街道信息")
        } else {
          wx.showToast({
            title: 'mapapi！！',
          })
        }
        console.log(res);
      }

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    this.setData({
      mapapi: new QQMapWX({
        key: 'BKUBZ-WXCCW-JUVRV-OQ7SK-COJZF-BABKA' // 必填
      })
    })
    this.setData({
      'inputVal':wx.getStorageSync("placeName")
    })
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
    this.setData({
      'inputVal': wx.getStorageSync("placeName")
    })
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
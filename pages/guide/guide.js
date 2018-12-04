var tools = require('../../utils/myTools.js')
var app = getApp()
Page({
  data: {
    showModalStatus: false,
    region: ['山东省', '淄博市', '张店区'],
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    friend_nick_name: "",
    btnVal:"挑礼物"
  },
  onShow: function () {
    this.setData({
      friend_nick_name: wx.getStorageSync("friend_nick_name")
    })

    wx.setStorageSync("goods", "")
    wx.setStorageSync("pay_type", "")
  },
  onLoad: function (options) {
    console.log(options,'options')
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //console.log(,"哈哈")
    tools.ifILogin().then(res=>{
      console.log(res,"then")
    }).catch((res)=>{
      console.log(res,"catch")
      wx.showLoading({
        title: '请登录',
      })
      that.setData({
        btnVal: "登录"
      })
    })
  },
  nameChange:function(e){
    wx.setStorageSync('friend_nick_name', e.detail.value)
  },
  bindGetUserInfo: function (e) {
    var that = this
    console.log(e,'bindGetUserInfo')
    app.globalData.encryptedData = e.detail.encryptedData
    if (app.globalData.userInfo && app.globalData.userInfo.phone){
      return ;
    }
    app.globalData.userInfo = e.detail.userInfo
    tools.login()
    that.setData({
      btnVal: "挑礼物"
    })
  },
  tochoose: function (e) {
    if (app.globalData.userInfo && ( app.globalData.userInfo.phone == "" || app.globalData.userInfo.phone == null)) {
      wx.showModal({
        title: '小派提醒您',
        content: '请完善个人信息',
        success: function (res) {
          if (res.confirm) {
            if(app.globalData.login == 0){
              tools.login().then(res => {
                wx.navigateTo({
                  url: '/pages/myinformation/myinformation',
                })
              })
            }else{
              wx.navigateTo({
                url: '/pages/myinformation/myinformation',
              })
            }
          }
        }
      })
      return;
    }
    if (app.globalData.userInfo && app.globalData.userInfo.phone != null){
      wx.navigateTo({
        url: '../getinfo/getinfo',
      })
    }
  },
  
})
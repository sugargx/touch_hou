//index.js
//获取应用实例
const app = getApp()
var tools = require("../../utils/myTools.js")
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [
      {
        typeId: 0,
        name: '全部订单',
        imageurl: '../../images/order.png',
      },
      {
        typeId: 1,
        name: '待付款',
        imageurl: '../../images/daifukuan.png',
      },
      {
        typeId: 2,
        name: '待收货',
        imageurl: '../../images/daishouhuo.png'
      },
      // {
      //   typeId: 3,
      //   name: '众筹中',
      //   imageurl: '../../images/order.png'
      // }
    ],
  },
  //事件处理函数
  toOrder: function (e) {
    var type = e.currentTarget.dataset.name
    console.log("-------------------------",type)
    if (type == "全部订单") {
      wx.setStorageSync('activeIndex', 0)

    }
    else if (type =="待付款"){
      wx.setStorageSync('activeIndex', 1)
      
    } else if (type == "待收货") {
      wx.setStorageSync('activeIndex', 2)

    } else if (type == "众筹中") {
      wx.setStorageSync('activeIndex', 3)
    }
    wx.navigateTo({
      url: '../myorder/myorder'
    })
  },
  tomyscore:function(){
    wx.navigateTo({
      url: '../money/money',
    })
  },
  scanning:function(){
    wx.scanCode({
      scanType: "barCode",
      success: function (res) {
        var videoUrl = res.result
        console.log(videoUrl)
        wx.request({
          url: app.globalData.url + "/api/getFinishVideoByOrderID",
          data:{
            'url': videoUrl,
            'user_id':app.globalData.userInfo.id
          },
          method:"POST",
          success:function(res){
            if(res.data.code==0){
              var really_url = res.data.video_url
              wx.setStorageSync("videoUrl", really_url)
              wx.navigateTo({
                url: '../scanning/scanning',
              })
            }else{
              wx.showModal({
                title: '友情提示',
                content: '你观看的视频正在合成中请稍后！',
              })
            }
            console.log(res)
          }
        })
      }
    })

  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow:function(){
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  }
})

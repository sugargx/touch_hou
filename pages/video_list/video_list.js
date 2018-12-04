var app = getApp()
var tools = require('../../utils/myTools.js')
Page({
  data: {
    // text:"这是一个页面"
    videos: [],
    id: 0,
    purchaser_id: 0,
    finishVideo: [],
    isConcatVideo: false,
    isUploadVideo: false,
    app: getApp(),
    self_bless:0
  },
  concatVideos: function () {
    var that = this
    console.log(this.data.finishVideo.length)
    wx.showModal({
      title: '请您再次确认',
      content: '您确认要合成视频吗？合成后其他好友不能再上传祝福视频！',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + "/api/concatVideos/" + wx.getStorageSync("order_id"),
            success: function (res) {
              console.log(res)
              if (res.data.error == 0) {
                wx.showToast({
                  title: "视频合成中！",
                })
                that.setData({
                  isConcatVideo: false,
                })
              } else {
                wx.showToast({
                  title: "视频合成失败！",
                })
              }
            }
          })

        } else if (res.cancel) {

        }
      }
    })
    return;
  },
  pullvideo: function (e) {
    console.log(e, 'e')
    if (e.currentTarget.dataset.video && e.currentTarget.dataset.video != "") {
      wx.setStorageSync('video', e.currentTarget.dataset.video)
      wx.navigateTo({
        url: '../pullvideo/pullvideo',
      })
    } else {
      wx.showToast({
        title: '视频合成中',
      })
    }

  },
  gocamera: function () {
    var that = this
    wx.navigateTo({
      url: '../camera/camera',
    })
  },
  getVideoByBlessId: function () {
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getVideoByBlessId",
      method: "POST",
      data: {
        "user_id": app.globalData.userInfo.id,
        "bless_id": wx.getStorageSync("bless_id"),
      },
      success: function (res) {
        var videos = res.data.videos
        var finishVideo = res.data.finishVideo
        console.log(res.data)
      
        if (videos) {
          that.setData({
            "videos": videos,
          })
        }
        if (finishVideo) {
          that.setData({
            'finishVideo': finishVideo
          })
        }

        //判断用户是否上传过视频
        var flag = 1
        if (videos) {
          videos.forEach(function (value, index, videos) {
            if (value.user_id == app.globalData.userInfo.id) {
              flag = 0
            }
          })
          if (flag && finishVideo.length == 0) {
            that.setData({
              isUploadVideo: true
            })
          }
        } else if (finishVideo.length == 0) {
          that.setData({
            isUploadVideo: true
          })
        }
        //判断是否可以合成视频
        if (finishVideo.length == 0 && videos.length >= 2 && res.data.purchaser_id == app.globalData.userInfo.id) {
          that.setData({
            isConcatVideo: true
          })
        }
        wx.hideLoading()
      }
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    console.log("video_list onload")
    this.setData({
      id: app.globalData.userInfo.id,
      purchaser_id: wx.getStorageSync("purchaser_id"),
      isConcatVideo: false,
      isUploadVideo: false,
    })
    this.getVideoByBlessId()

  },
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    this.setData({
      videos: [],
      id: 0,
      purchaser_id: 0,
      finishVideo: [],
      isConcatVideo: false,
      isUploadVideo: false,
    })
    this.onLoad()
    setTimeout(function () {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onReachBottom: function () {

  },
  onShow: function () {
    this.onLoad()
  },
  gotomy:function(){
    wx.switchTab({
      url: '../my/my',
    })
  }
})
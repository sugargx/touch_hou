// pages/video_play/video_play.js
var tools = require('../../utils/myTools.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videos: [],
    finishVideo: [],
    app: getApp(),
    purchaser_name: "",
    receiver_name: "",
    hiddenmodalput: true,
    checkCode: 0,
    yijinglook: 0,
    countDownNum: '60',
    timer: '',//定时器名字
    cancel_text :'获取验证码',
    canGetCode:false,
    title:"",
    stdtime:'60'
  },
  
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    var that = this
    tools.getAppInfo().then((res) => {
      that.setData({
        "app.globalData.appInfo": res.data
      })
    })
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    if (scene != "undefined") {
      var bless_id = scene;
      this.setData({
        bless_id: bless_id
      })
      this.getVideoByBlessId(bless_id)
    }
    tools.ifILogin().then(res => {
      console.log(res, "then")
    }).catch((res) => {
      console.log(res, "catch")
    })
  },
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum,
          cancel_text: countDownNum + "秒再次获取"
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
          that.setData({
            cancel_text: "获取验证码",
            canGetCode: true,
            countDownNum: that.data.stdtime
          })
        }
      }, 1000)
    })
  },
  bindGetUserInfo: function(e) {
    var that = this
    if (app.globalData.userInfo) {
      if (that.data.finishVideo.length <= 0 && that.data.videos.length <= 0) {
        wx.showModal({
          title: '小派提醒',
          content: '您的视频尚未合成！请稍后！',
        })
        return;
      }
      wx.setStorageSync("order_id", that.data.order_id)
      if (that.data.yijinglook == 0) {
        that.setData({
          hiddenmodalput: false,
          canGetCode: true,
        })
      } else {
        wx.navigateTo({
          url: '../video_list/video_list',
        })
      }

    } else {
      tools.login().then((res) => {
        if (that.data.finishVideo.length <= 0 && that.data.videos.length <= 0) {
          wx.showModal({
            title: '小派提醒',
            content: '您的视频尚未合成！请稍后！',
          })
          return;
        }
        if (that.data.yijinglook == 0) {
          that.setData({
            hiddenmodalput: false,
            canGetCode: true,
          })
        } else {
          wx.navigateTo({
            url: '../video_list/video_list',
          })
        }
      })
      wx.setStorageSync("order_id", that.data.order_id)
    }
  },
  codeChange: function(e) {
    this.setData({
      checkCode: e.detail.value
    })
    console.log(e.detail.value)
  },
  getReceiveCheckCode: function() {
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getReceiveCheckCode",
      data: {
        bless_id: that.data.bless_id,
        id: app.globalData.userInfo.id
      },
      success:function(res){
        if(res.data.error == 1){
          wx.showModal({
            title: '小派提醒',
            content: '您的获取次数过多',
          })
          return ;
        }
      }
    })
  },

  confirmModel: function(e) {
    var that = this
    that.setData({
      hiddenmodalput: true
    })
    wx.request({
      url: app.globalData.url + "/api/confirmCheckCode",
      data: {
        'user_id': app.globalData.userInfo.id,
        code: that.data.checkCode,
        'bless_id': that.data.bless_id
      },
      success: function(res) {
        if (res.data.error == 0) {
          wx.navigateTo({
            url: '../video_list/video_list',
          })
        } else {
          wx.showModal({
            title: '小派提醒',
            content: '验证码错误',
          })
          return;
        }
      }
    })
    console.log(e)
  },
  cancelModel:function(){
    if (this.data.canGetCode){
      this.setData({
        canGetCode:false,
        title:"验证码已发送，请注意查收。"
      })
      this.getReceiveCheckCode()
      this.countDown()
    }
  },
  getVideoByBlessId: function(bless_id) {
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getVideoByBlessId",
      method: "POST",
      data: {
        "user_id": 0,
        "bless_id": bless_id,
      },
      success: function(res) {
        var videos = res.data.videos
        var finishVideo = res.data.finishVideo
        console.log(res.data)
        that.setData({
          receiver_name: res.data.receiver_name,
          purchaser_name: res.data.purchaser_name,
          yijinglook: res.data.checkCode
        })
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
      }
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
    this.getVideoByBlessId(this.data.bless_id)
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
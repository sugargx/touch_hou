var sliderWidth = 65; // 需要设置slider的宽度，用于计算中间位置
var app = getApp() //订单状态，0待付款，1众筹中，2待接单，3待发货，4待收货，5已收货
Page({
  data: {
    tabs: ["发送的祝福", "收到的祝福"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    fbless:[],
    sbless:[],
    app:getApp(),
    fpage:1,
    spage:1,
    app:getApp()
  },
  handleEdit:function(e){
    console.log(e)
    wx.showActionSheet({
      itemList: ['绑定订单','获取二维码'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0){
            var bless_id = e.currentTarget.dataset.bless_id
            wx.navigateTo({
              url: '/pages/myorder/myorder?type=bindBless&bindBlessID=' + bless_id,
            })
          } else if (res.tapIndex == 1){
            wx.request({
              url: app.globalData.url + "/api/getBlessQrcode",
              success:function(res){
                if(res.data.error == 0){
                  wx.previewImage({
                    urls: [res.data.url],
                  })
                }
              }
            })
          }
        }
      }
    });
  },
  toShare_after:function(e){
    var bless_id = e.currentTarget.dataset.bless_id
    var purchaser_id = e.currentTarget.dataset.purchaser_id
    console.log(e)
    wx.setStorageSync("bless_id", bless_id)
    wx.setStorageSync("purchaser_id", purchaser_id)
    wx.navigateTo({
      url: '../../share_after/share_after'
    })
  },
  getMyFBless:function(){
    var that = this
    wx.showToast({
      title: '加载中',
      icon:"loading"
    })
    wx.request({
      url: app.globalData.url + "/api/myFBless?page=" + that.data.fpage,
      data:{
        user_id:app.globalData.userInfo.id
      },
      success:function(res){
        //console.log(res)
        if (res.data.data.length>0){
          that.setData({
            fbless: that.data.fbless.concat(res.data.data)
          })
        }else{
          wx.showToast({
            title: '没有更多了',
            icon:"loading"
          })
        }
      }
    })
  },
  toPullVideo:function(e){
    console.log(e.currentTarget.dataset.video)
    wx.setStorageSync("video", e.currentTarget.dataset.video)
    wx.navigateTo({
      url: '../pullvideo/pullvideo',
    })
  },
  getMySBless: function () {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: "loading"
    })
    wx.request({
      url: app.globalData.url + "/api/mySBless?page=" + that.data.spage,
      data: {
        user_id: app.globalData.userInfo.id
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.data && res.data.data.length>0){
          that.setData({
            sbless: that.data.sbless.concat(res.data.data)
          })
        }else{
          wx.showToast({
            title: '没有更多了',
            icon: "loading"
          })
        }
      }
    })
  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.getMyFBless()
    this.getMySBless()
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onReachBottom:function(){
    console.log(this.data.activeIndex)
    if (this.data.activeIndex==0){
      this.setData({
        fpage: this.data.fpage + 1
      })
      this.getMyFBless()
    } else if (this.data.activeIndex == 1){
      this.setData({
        spage: this.data.spage + 1
      })
      this.getMySBless()
    }
  },
  addBless : function(){
    wx.navigateTo({
      url: '../bless_info/bless_info',
    })
  }
});
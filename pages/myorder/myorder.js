var sliderWidth = 65; // 需要设置slider的宽度，用于计算中间位置
var app = getApp() //订单状态，0待付款，1众筹中，2待接单，3待发货，4待收货，5已收货
Page({
  data: {
    tabs: ["全部", "待付款", "待收货"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    getAllOrder: [],
    getOrder_0: [], // 代付款
    //getOrder_3: [], 
    getOrder_4: [], //待收货
    //getOrder_1: []
    bindBless:false,
    bindBlessID:0
  },
  onLoad: function (options) {
    var type = options.type
    var bless_id = options.bindBlessID
    if (type == "bindBless") {
      this.setData({
        bindBless: true,
        bindBlessID: bless_id
      })
    }
    wx.showLoading({
      title: '加载中！',
    })
    this.setData({
      'activeIndex': wx.getStorageSync('activeIndex')
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    var id = app.globalData.userInfo.id
    this.getAllOrder(app.globalData.url + '/api/getAllOrder/' + id);
    //this.getOrder_2();
    //this.getOrder_3();
    this.getOrder_4(app.globalData.url + '/api/getOrder/' + id + '/4');
    //this.getOrder_1();
    this.getOrder_0(app.globalData.url + '/api/getOrder/' + id + '/0');
  },
  bindBless:function(e){
    console.log(e)
    var order_id = e.currentTarget.dataset.order_id
    var bless_id = this.data.bindBlessID
    wx.showModal({
      title: '小派提醒',
      content: '您确定要绑定祝福此订单吗？',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.url + "/api/bless/bindOrder",
            method:"POST",
            data:{
              "order_id":order_id,
              "bless_id":bless_id
            },
            success:function(res){
              console.log(res.data)
              if(res.data.error == 0){
                wx.showToast({
                  title: '绑定成功',
                })
              }
            }
          })
        }
      }
    })
  },
  toCf:function(e){
    console.log(e.currentTarget.dataset.cf_id)
    wx.navigateTo({
      url: '../cf/cf_share/cf_share?cf_id=' + e.currentTarget.dataset.cf_id,
    })
  },
  toPay:function(e){
    console.log(e)
    var that = this
    wx.request({
      url: app.globalData.url + "/api/wechatRePay",
      method:"POST",
      data:{
        order_id:e.currentTarget.dataset.order_id,
        openid: app.globalData.userInfo.openid
      },
      success:function(res){
        console.log(res.data)
        var jsapi = res.data.data.jsapi
        //console.log(res)
        console.log(jsapi,"jsapi")
        wx.requestPayment({
          timeStamp: jsapi.timeStamp,
          nonceStr: jsapi.nonceStr,
          package: jsapi.package,
          signType: jsapi.signType,
          paySign: jsapi.paySign,
          success:function(payres){
            console.log(payres)
            wx.request({
              url: app.globalData.url + "/api/searchWxPayStatus",
              method: "POST",
              data: {
                "order_num": res.data.data.order,
              },
              success: function (res) {
                console.log(res)
                if (res.data.code == 1) {
                  wx.showToast({
                    title: '支付成功!',
                  })
                  that.setData({
                    getAllOrder: [],
                    getOrder_0: [], 
                    getOrder_4: [],
                  })
                  that.onLoad()
                } else {
                  
                }
              },
              fail: function () {
                wx.showToast({
                  title: '未支付!',
                })
              }
            })
          }
        })
      }
    })
  },
  confirmReceive:function(e){
    var that = this
    console.log(e.currentTarget.dataset.order_id)
    var order_id = e.currentTarget.dataset.order_id
    wx.request({
      url: app.globalData.url + "/api/confirmReceive/" + order_id,
      success:function(res){
        if(res.data.code==1){
          wx.showToast({
            title: '收货成功',
          })
          that.onLoad()
        }
      }
    })
  },
  toBless:function(e){
    var purchaser_id = e.currentTarget.dataset.purchaser_id
    var order_id = e.currentTarget.dataset.order_id
    var bless_id = e.currentTarget.dataset.bless_id
    console.log(e)
    wx.setStorageSync("order_id", order_id)
    wx.setStorageSync("bless_id", bless_id)
    wx.setStorageSync("purchaser_id", purchaser_id)
    // wx.navigateTo({
    //   url: '../video_list/video_list'
    // })
    wx.navigateTo({
      url: '../share_after/share_after',
    })
  },
  talkTo: function() {
    wx.navigateTo({
      url: '../talk/talk',
    })
  },
  
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  allOrderPage: function() {
    wx.navigateTo({
      url: '../seller_allOrder/seller_allOrder'
    })
  },
  toOrderDetail: function() {
    wx.navigateTo({
      url: '../order_detail/order_details'
    })
  },
  // 全部订单
  getAllOrder: function(url) {
    var that = this
    wx.request({
      url: url,
      success: function(res) {
        console.log(res.data, '后台数据getAllOrder')
        var result = res.data.data
        that.setData({
          getAllOrder: that.data.getAllOrder.concat(result),
          allOrderNextpPageUrl: res.data.next_page_url
        })
        wx.hideLoading()
      }
    })
  },
  //待付款
  getOrder_0: function(url) {
    var that = this
    var id = app.globalData.userInfo.id
    wx.request({
      url: url,
      success: function(res) {
        console.log(res.data, '后台数据--待付款')
        var result = res.data.data
        that.setData({
          getOrder_0: that.data.getOrder_0.concat(result),
          daifukuanNextPageUrl: res.data.next_page_url
        })
      }
    })
  },
  // 待接单
  getOrder_2: function() {
    var that = this
    var id = app.globalData.userInfo.id
    wx.request({
      url: app.globalData.url + '/api/getOrder/' + id + '/2',
      success: function(res) {
        console.log(res.data, '后台数据')
        var result = res.data.data
        that.setData({
          getOrder_2: result
        })
        console.log(that.data.getAllOrder, 'getOrder_0')
      }

    })
  },
  // 待派送
  getOrder_3: function() {
    var that = this
    var id = app.globalData.userInfo.id
    wx.request({
      url: app.globalData.url + '/api/getOrder/' + id + '/3',
      success: function(res) {
        console.log(res.data, '后台数据')
        var result = res.data.data
        that.setData({
          getOrder_3: result
        })
        console.log(that.data.getAllOrder, 'getOrder_3')
      }

    })
  },
  // 待收货
  getOrder_4: function(url) {
    var that = this
    var id = app.globalData.userInfo.id
    wx.request({
      url: url,
      success: function(res) {
        console.log(res.data, '后台数据--待收货')
        var result = res.data.data
        that.setData({
          getOrder_4: that.data.getOrder_4.concat(result),
          daishouhuoNextPageUrl: res.data.next_page_url
        })
        console.log(that.data.getAllOrder, 'getOrder_4')
      }
    })
  },
  // 众筹中
  getOrder_1: function() {
    var that = this
    var id = app.globalData.userInfo.id
    wx.request({
      url: app.globalData.url + '/api/getOrder/' + id + '/1',
      success: function(res) {
        console.log(res.data, '后台数据')
        var result = res.data.data
        that.setData({
          getOrder_1: result
        })
        console.log(that.data.getAllOrder, 'getOrder_1')
      }
    })
  },
  onReachBottom:function(){
    console.log('碰到了底部')
    var that = this
    if (that.data.activeIndex == 0){
      if (that.data.allOrderNextpPageUrl)
        that.getAllOrder(that.data.allOrderNextpPageUrl)
    }else if(that.data.activeIndex == 1){
      console.log('待付款')
      if (that.data.daifukuanNextPageUrl){
        that.getOrder_0(that.data.daifukuanNextPageUrl)
      }
    } else if (that.data.activeIndex == 2) {
      console.log('待收货')
      if (that.data.daishouhuoNextPageUrl){
        that.getOrder_4(that.data.daishouhuoNextPageUrl)
      }
    }
  }
});
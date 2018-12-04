var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["销量", "附近", "价格↓"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,

    pictures:[],
    picture: "../../images/cake1.png",
    goodslistbynumber:[],
    goodslistbyprice: [],
    goodslistbydistance:[],
    number_next_page_url:"",
    price_next_page_url:"",
    distance_next_page_url:"",
    lat:0,
    lng:0,
    city:'',
    num_info:false,
    distance_info:false,
    price_info:false
  },
  goodOrderByNumber: function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.number_next_page_url ? that.data.number_next_page_url : app.globalData.url + '/api/goodOrderByNumberDesc/' + that.data.city,
      success:function(res){
        //console.log(res.data)
        var result = res.data
        if (result.error) {
          wx.hideLoading()
          return;
        }
        console.log(result, "result")
        that.setData({
          goodslistbynumber: that.data.goodslistbynumber.concat(result.goods.data),
          number_next_page_url: result.goods.next_page_url
        })

        console.log(that.data.goodslistbynumber, " goodslistbynumber")
        wx.hideLoading()
      }
    })
  },
  goodOrderByPrice:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.price_next_page_url ? that.data.price_next_page_url : app.globalData.url + '/api/goodOrderByPriceAsc/' + that.data.city,
      success:function(res){
        var result = res.data
        if (result.error) {
          wx.hideLoading()
          return;
        }
        that.setData({
          goodslistbyprice: that.data.goodslistbyprice.concat(result.goods.data),
          price_next_page_url:result.goods.next_page_url
        })
        
        console.log(that.data.goodslistbyprice, "goodslistbyprice")
        wx.hideLoading()
      },
    })
  },
  goodOrderByDistance: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.distance_next_page_url ? that.data.distance_next_page_url : app.globalData.url + '/api/goodOrderByDistance',
      method:"POST",
      data:{
        city: that.data.city,
        lng:that.data.lng,
        lat:that.data.lat
      },
      success: function (res) {
        console.log(res)
        var result = res.data
        if(result.error){
          wx.showModal({
            title: '小派提醒您',
            content: '该城市没有商品',
          })
          wx.hideLoading()
          return ;
        }
        that.setData({
          goodslistbydistance: that.data.goodslistbydistance.concat(result.goods.data),
          distance_next_page_url: result.goods.next_page_url
        })
        wx.hideLoading()
      },
    })
  },
  goTocakeinfo:function(e){
    console.log(e,'e')
     var id = e.currentTarget.dataset.id
     //console.log(e.currentTarget.dataset.id)
     wx.navigateTo({
       url: "../cakeinfo/cakeinfo?id=" + id
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.setData({
      lng: wx.getStorageSync('lng'),
      lat: wx.getStorageSync('lat'),
      city: wx.getStorageSync('city'),
    })
    this.goodOrderByNumber();
    this.goodOrderByPrice();
    this.goodOrderByDistance()
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  onReachBottom:function(){
    var that = this
    if (that.data.activeIndex == 0 && that.data.number_next_page_url!=null){
      that.goodOrderByNumber()
    }else if(that.data.activeIndex==0){
      that.setData({
        num_info: true
      })
    }
    if (that.data.activeIndex == 2 && that.data.price_next_page_url != null){
      that.goodOrderByPrice()
    } else if (that.data.activeIndex == 2) {
      that.setData({
        price_info:true
      })
    }
    if (that.data.activeIndex == 1 && that.data.distance_next_page_url != null) {
      that.goodOrderByDistance()
    } else if (that.data.activeIndex == 1) {
      that.setData({
        distance_info: true
      })
    }

  }
})
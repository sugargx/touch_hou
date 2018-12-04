var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["销量", "价格"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    goodsOrderByCount: [],
    goodsOrderByprice: [],
    seller:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.getShopInfo()
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getShopInfo:function(){
    wx.showLoading({
      title: '加载中。',
    })
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getShopInfoById/" + wx.getStorageSync("seller_id"),
      success:function(res){
        var result = res.data
        console.log(res.data,"店铺信息")
        that.setData({
          seller:result,
          goodsOrderByCount: result.goodsOrderByCount,
          goodsOrderByprice: result.goodsOrderByPrice
        })
      }
    })
    wx.hideLoading()
  },
  goTocakeinfo: function (e) {
    console.log(e, 'e')
    var id = e.currentTarget.dataset.id
    //console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "../cakeinfo/cakeinfo?id=" + id
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
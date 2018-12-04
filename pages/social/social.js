var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
var tools = require("../../utils/myTools.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["时刻","好友生日"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    onShow:0,
    getFriendsBirthday: [],
    essays: [],
    essay_next_page_url: "",
    essayPageFlag: 1,
    essay_info:false,
    festivals:[]
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
    this.getFriendsBirthday();
    //this.getAllEssayById();
    this.getFestivals();
  },
  addEssay: function() {
    wx.navigateTo({
      url: '../talk/talk',
    })
  },
  toFestivalContent:function(e){
    console.log(e.currentTarget.id)
    wx.setStorageSync('festival_id', e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/festival_article/festival_article',
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 好友生日
  getFriendsBirthday: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var id = app.globalData.userInfo.id
    wx.request({
      url: app.globalData.url + '/api/FriendsBirthday/' + id,
      // method: "POST",
      success: function(res) {
        console.log(res.data, '后台数据')
        var result = res.data
        if (result.code == 1) {
          console.log(result.data)
          that.setData({
            getFriendsBirthday: result.data
          })
        } else {

        }
        wx.hideLoading()
      }

    })
  },
  getAllEssayById: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: that.data.essay_next_page_url ? that.data.essay_next_page_url : app.globalData.url + "/api/getAllEssayById",
      method: "POST",
      data: {
        id: app.globalData.userInfo.id
      },
      success: function(res) {
        that.setData({
          essays: that.data.essays.concat(res.data.data),
          essay_next_page_url: res.data.next_page_url
        })
        console.log(that.data.essays)
        if (!res.data.next_page_url) {
          that.setData({
            essayPageFlag: 0
          })
        }
        wx.hideLoading()
      }
    })
  },
  //获取最近的节日
  getFestivals:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.url + "/api/getFestival",
      success:function(res){
        var result = res.data
        if(result.code){
          that.setData({
            festivals: result.data
          })
        }else{

        }
        wx.hideLoading()
      }
    })
  },
  //图片预览
  previewImage:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    console.log(e)
    this.setData({
      onShow:0
    })

    var imageUrl = e.currentTarget.dataset.src
    var imageArr = []
    that.data.essays.forEach(function(item,index){
      if (item.id == id) {
        //console.log(item.images, index)
        item.images.forEach(function (image, index) {
          console.log(image.url)
          imageArr.push(image.url)
        })
      }
    }) 
    console.log(imageArr)
    wx.previewImage({
      current: imageUrl,
      urls: imageArr,
    })
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    console.log("onshow ....")
    if(this.data.onShow){
      this.setData({
        getFriendsBirthday: [],
        essays: [],
        essay_next_page_url: "",
        essayPageFlag: 1,
        essay_info: false,
        festivals: []
      })
      this.onLoad()
    }
    if (!this.data.onShow){
      this.setData({
        onShow:1
      })
    }
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
    // this.setData({
    //   getFriendsBirthday: [],
    //   essays: [],
    //   essay_next_page_url: "",
    //   essayPageFlag: 1
    // })
    // this.onLoad()
    setTimeout(function () {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    console.log("碰到了底部", this.data.activeIndex)

    if (this.data.activeIndex == 0) {

    } else if (this.data.activeIndex == 1) {
      if (this.data.essayPageFlag) {
        this.getAllEssayById()
      }else{
        that.setData({
          essay_info:true
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
var app = getApp()
Page({
  data: {
    itemData: [],
    nextUrl: null,
    flag: 0,
    info: false
  },
  touchS: function(e) { // touchstart
    let startX = app.Touches.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  touchM: function(e) { // touchmove
    let itemData = app.Touches.touchM(e, this.data.itemData, this.data.startX)
    itemData && this.setData({
      itemData
    })

  },
  touchE: function(e) { // touchend
    const width = 300 // 定义操作列表宽度
    let itemData = app.Touches.touchE(e, this.data.itemData, this.data.startX, width)
    itemData && this.setData({
      itemData
    })
  },
  itemDelete: function(e) { // itemDelete
    var that = this
    console.log(e)
    wx.showModal({
      title: '删除提示',
      content: '您确定要删除好友' + e.currentTarget.dataset.nick_name + "吗？",
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + "/api/deleteFriend",
            method: "POST",
            data: {
              'id': app.globalData.userInfo.id, //自己的id
              'friend_id': e.currentTarget.dataset.id //好友的id
            },
            success: function(re) {
              wx.showToast({
                title: re.data.msg,
              })
            }
          })
          let itemData = app.Touches.deleteItem(e, that.data.itemData)
          itemData && that.setData({
            itemData
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  yidong: function(e){
    wx.setStorageSync('friend_id', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../select_relationship/select_relationship',
    })
  },
  getfriends: function() {
    var that = this
    wx.request({
      method: "POST",
      url: that.data.nextUrl ? that.data.nextUrl : app.globalData.url + '/api/showAllFriend',
      data: {
        id: app.globalData.userInfo.id
      },
      success: function(res) {
        var result = res.data
        console.log(res)
        if(result.code!=0){
          that.setData({
            itemData: that.data.itemData.concat(res.data.data),
            nextUrl: res.data.nextUrl,
          })
          if (that.data.nextUrl == null) {
            that.setData({
              flag: 1
            })
          }
        }
      }
    })
  },
  addfriendsTo: function() {
    wx.navigateTo({
      url: '../addfriends/addfriends',
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getfriends()
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  onReachBottom: function() {
    console.log('滑到底部了hhh！')
    if (this.data.flag == 0) {
      this.getfriends();
    } else {
      this.setData({
        info: true
      })
      console.log('没有了')
    }
  }
})
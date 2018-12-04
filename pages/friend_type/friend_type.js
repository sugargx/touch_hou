var app = getApp()
Page({
  data: {
    friends: [],
    groups: [],
    nextUrl: null,
    flag: 0,
    info: false
  },
  touchS: function (e) { // touchstart
    let startX = app.Touches.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  touchM: function (e) { // touchmove
    let friends = app.Touches.touchM(e, this.data.friends, this.data.startX)
    friends && this.setData({
      friends
    })

  },
  touchE: function (e) { // touchend
    const width = 300 // 定义操作列表宽度
    let friends = app.Touches.touchE(e, this.data.friends, this.data.startX, width)
    friends && this.setData({
      friends
    })
  },
  itemDelete: function (e) { // itemDelete
    var that = this
    console.log(e)
    wx.showModal({
      title: '删除提示',
      content: '您确定要删除好友' + e.currentTarget.dataset.nick_name + "吗？",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + "/api/deleteFriend",
            method: "POST",
            data: {
              'id': app.globalData.userInfo.id, //自己的id
              'friend_id': e.currentTarget.dataset.id //好友的id
            },
            success: function (re) {
              wx.showToast({
                title: re.data.msg,
              })
              that.onLoad()
              let friends = app.Touches.deleteItem(e, that.data.friends)
              friends && that.setData({
                friends
              })
            }
          })
          
        } else if (res.cancel) {

        }
      }
    })
  },
  yidong: function (e) {
    wx.setStorageSync('friend_id', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../select_relationship/select_relationship',
    })
  },
  addfriendsTo: function () {
    wx.navigateTo({
      url: '../addfriends/addfriends',
    })
  },
  addfriend: function(){
    wx.navigateTo({
      url: '../addfriends/addfriends',
    })
  },
  groupclick: function(e) {
    var id = e.currentTarget.id,
      groups = this.data.groups;
    for (var i = 0, len = groups.length; i < len; ++i) {
      if (groups[i].id == id) {
        groups[i].hidden = !groups[i].hidden;
      }
    }
    this.setData({
      groups: groups
    });
  },
  getFriendsByGroups: function() {
    var that = this
    wx.showLoading({
      title: '加载中。',
    })
    wx.request({
      url: app.globalData.url + "/api/getFriendsByGroups",
      method: "POST",
      data: {
        'user_id': app.globalData.userInfo.id
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          friends: res.data.friends,
          groups: res.data.groups
        })
        wx.hideLoading()
      }
    })
  },
  onLoad: function() {
    this.getFriendsByGroups()
  },
  onShow:function(){
    this.getFriendsByGroups()
  },
  onShareAppMessage: function () {
    var that = this
    var name = app.globalData.userInfo.name ? app.globalData.userInfo.name : app.globalData.userInfo.nick_name
    var title = name + "请求添加您为好友"
    var path = "pages/share_addfriend/share_addfriend?user_id=" + app.globalData.userInfo.id
    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})
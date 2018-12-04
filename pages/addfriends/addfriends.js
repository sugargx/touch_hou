var app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    findFriend:null
  },
  addFriend:function(e){
    var id = app.globalData.userInfo.id
    var friend_id = e.currentTarget.dataset.friend_id
    if(id==friend_id){
      wx.showToast({
        title: '不能加自己!',
      })
      return ;
    }
    wx.request({
      url: app.globalData.url + "/api/addFriend",
      method:"POST",
      data:{
        id:id,
        friend_id: friend_id
      },
      success:function(res){
        wx.showToast({
          title: res.data.msg,
        })
        console.log(res.data.msg)
      }
    })
    console.log(e.currentTarget.dataset.friend_id)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that = this
    that.setData({
      findFriend:null
    })
    this.setData({
      inputVal: e.detail.value
    });
    wx.request({
      url: app.globalData.url +"/api/findFriend",
      method:"POST",
      data:{
        "account": e.detail.value,
      },
      success:function(res){
        if(res.data.code==1){
          console.log(res.data.data)
          that.setData({
            findFriend:res.data.data
          })
        }
      }
    })
  },
  onLoad:function(option){
  }
});
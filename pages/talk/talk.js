var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    inputValue:""
  },
  inputing:function(e){
    console.log(e)
    this.setData({
      'inputValue':e.detail.value
    })
  },
  publish:function(){
    var that = this
    wx.request({
      url: app.globalData.url + "/api/publishEssay",
      method:"POST",
      data:{
        'user_id':app.globalData.userInfo.id,
        'content':that.data.inputValue
      },
      success:function(res){
          if(res.data.code==1){
            var essay_id = res.data.essay_id
            that.data.files.forEach(function (value, index, array){
              wx.uploadFile({
                url: app.globalData.url + "/api/publishEssayImage", 
                filePath: value,
                name: 'image',
                formData: {
                  'essay_id': essay_id
                },
                success: function (res) {
                  var data = res.data
                  console.log(data)
                }
              })
            })
            wx.showLoading({
              title: '上传中...',
            })
            setTimeout(function(){
              wx.showToast({
                title: "发表成功！",
              })
              wx.hideLoading()
              wx.switchTab({
                url: '../social/social',
              })
            }, 3000)
            
          }
      }
    })
  },
  chooseImage: function (e) {
    var that = this;
    if (that.data.files.length>=3){
      wx.showToast({
        title: '最多三张图哦！',
      })
      return ;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
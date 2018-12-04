
var app = getApp()
Page({
  data: {
    file: null,
    "order_num": 0,
    progress: 0,
    order_id: 0,
    relation: "",
    app: getApp(),
    fileName: "",
    src: "",
    firstBtn:"录制视频"
  },
  onLoad: function () {
    this.setData({
      order_id: wx.getStorageSync("order_id"),
      relation: wx.getStorageSync("relation"),
      fileName: (app.globalData.userInfo.name ? app.globalData.userInfo.name : app.globalData.userInfo.nick_name) + "来自小程序"
    })
  },
  
  /**
   * 打开本地视频
   */
  bindUpLoad: function () {
    var that = this
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.globalData.url + "/api/acceptVideo",
      filePath: that.data.src,
      name: 'video',
      formData:{
        "order_id":wx.getStorageSync("order_id"),
        bless_id: wx.getStorageSync("bless_id"),
        user_id:app.globalData.userInfo.id
      },
      success: function (res) {
        var result = JSON.parse(res.data)
        wx.hideLoading();
        if (result.error == 0){
          wx.redirectTo({
            url: '../msg_success/msg_success',
          })
          wx.setStorageSync("bless_id", result.bless_id)
        }else{
          wx.showModal({
            title: '小派提醒',
            content: '您的视频上传失败！',
          })
        }
      }
    })
    
  },
  chooseVideo: function () {
    console.log(123)
    var that = this
    //拍摄视频或从手机相册中选视频
    wx.chooseVideo({
      //album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
      sourceType: ['camera', 'album'],
      //拍摄视频最长拍摄时间，单位秒。最长支持60秒
      maxDuration: 20,
      //接口调用成功，返回视频文件的临时文件路径，详见返回参数说明
      success: function (res) {
        console.log(res.size / 1024 / 1024)
        // if (res.height < res.width) {
        //   wx.showModal({
        //     title: '小派提醒',
        //     content: '请竖屏拍摄！',
        //   })
        //   return;
        // }
        // if (res.duration > 20) {
        //   wx.showModal({
        //     title: '小派提醒',
        //     content: '选择的视频不要超过20秒哦。',
        //   })
        //   return;
        // }
        if (res.size / 1024 / 1024 > 25) {
          wx.showModal({
            title: '小派提醒',
            content: '选择的视频大小不要超过50M哦。',
          })
          return;
        }
        console.log(res)
        that.setData({
          file: res,
          src: res.tempFilePath,
          firstBtn:"重新录制"
        })
      }
    })
  },
})
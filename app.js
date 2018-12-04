//app.js

import Touches from './utils/Touches.js'

App({
  onLaunch: function () {
    // 登录
    var that = this
    that.getAppInfo()
  },
  getAppInfo:function(){
    var that = this
    wx.request({
      url: that.globalData.url + "/api/getAppInfo",
      success:function(res){
        // console.log(res.data)
        that.globalData.appInfo = res.data
      }
    })
  },
  globalData: {
    login:0,
    userInfo: null,
    appInfo:null,
    encryptedData:null,
    url:"https://www.dangaogao.com"
    //url:"http://localhost:8000"
    //url:"http://192.168.3.186"
  },
  Touches: new Touches()
})
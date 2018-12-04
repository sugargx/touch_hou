var app = getApp()
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: res => {
        console.log(res.code, 'code')
        wx.request({
          method: "POST",
          url: app.globalData.url + "/api/login",
          data: {
            'code': res.code,
            'userInfo': app.globalData.userInfo,
            'encryptedData': app.globalData.encryptedData
          },
          success: res => {
            resolve(res)
            app.globalData.userInfo = res.data
            app.globalData.login = 1
            console.log(res.data, "后台获取用户信息")
            wx.hideLoading()
          },
          fail: function (res) {
            reject(res)
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  })

}

function ifILogin() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: function (res) {
        console.log(res, "授权情况")
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo, 'userinfo')
              if(app.globalData.login == 0){
                app.globalData.userInfo = res.userInfo
                login()
              }
            }
          })
          resolve("已授权用户")
        } else {
          reject("异常")
        }
      }
    })
  })
}

function getAppInfo() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.url + "/api/getAppInfo",
      success: function (res) {
        //console.log(res.data, "获取appinfo--tools")
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

function strtotime(str) {
  var _arr = str.split(' ');
  var _day = _arr[0].split('-');
  _arr[1] = (_arr[1] == null) ? '0:0:0' : _arr[1];
  var _time = _arr[1].split(':');
  for (var i = _day.length - 1; i >= 0; i--) {
    _day[i] = isNaN(parseInt(_day[i])) ? 0 : parseInt(_day[i]);
  };
  for (var i = _time.length - 1; i >= 0; i--) {
    _time[i] = isNaN(parseInt(_time[i])) ? 0 : parseInt(_time[i]);
  };
  var _temp = new Date(_day[0], _day[1] - 1, _day[2], _time[0], _time[1], _time[2]);
  return _temp.getTime() / 1000;
}

module.exports = {
  login: login,
  ifILogin: ifILogin,
  getAppInfo: getAppInfo,
  strtotime: strtotime
}
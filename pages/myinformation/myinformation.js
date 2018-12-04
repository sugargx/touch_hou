const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    birthdayCodes: ['阳历生日', '农历生日'],
    birthdayCodeIndex: 0,
    birthday: "2000-01-01",
    sex: ['女', '男'],
    sexindex: 0,
    region: ['山东省', '淄博市', '张店区'],
    customItem: '全部',
    userInfo: [],
    name: "",
    phone: "",
    detail_address: "",
    canIgetCode: true,
    code: 0,
    codeInput: false,
    button_content: '确认修改'
  },
  bindNameChange: function(e) {
    console.log(e.detail.value)
    var name = e.detail.value
    this.setData({
      name: name,
      "userInfo.name": name
    })
  },
  bindSexChange: function(e) {
    console.log(e.detail.value)
    var sex = e.detail.value
    this.setData({
      sexindex: sex,
      "userInfo.sex": sex
    })
  },
  bindDateChange: function(e) {
    console.log(e.detail.value)
    var birthday = e.detail.value
    this.setData({
      birthday: birthday,
      "userInfo.birthday": birthday
    })
  },
  bindPhoneChange: function(e) {
    console.log(e.detail.value)
    var phone = e.detail.value
    this.setData({
      phone: phone,
      "userInfo.phone": phone,
      canIgetCode: false,
      codeInput: true
    })
  },
  bindAddressChange: function(e) {
    console.log(e.detail.value)
    var address = e.detail.value
    this.setData({
      detail_address: e.detail.value,
      "userInfo.detail_address": address
    })
  },
  bindRegionChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value,
      "userInfo.province": e.detail.value[0],
      "userInfo.city": e.detail.value[1],
      "userInfo.district": e.detail.value[2]
    })
  },
  bindCountryCodeChange: function(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindBirthdayCodeChange: function(e) {
    console.log('picker Birthday code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      birthdayCodeIndex: e.detail.value,
      "userInfo.birthday_type": e.detail.value
    })
  },
  bindCodeChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      code: e.detail.value
    })
  },
  onLoad: function() {
    var that = this
    var userInfo = app.globalData.userInfo
    this.setData({
      userInfo: app.globalData.userInfo,
      sexindex: userInfo.sex,
      name: userInfo.name,
      birthday: userInfo.birthday,
      birthdayCodeIndex: userInfo.birthday_type,
      phone: userInfo.phone,
      region: [userInfo.province, userInfo.city, userInfo.district],
      detail_address: userInfo.detail_address
    })
    if (userInfo.phone == "" || userInfo.phone == null || userInfo.name == "") {
      that.setData({
        button_content: '完善信息'
      })
    }
    if (!that.data.region[0]) {
      that.setData({
        region: ['山东省', '淄博市', '张店区']
      })
    }
  },
  getCode: function() {
    var that = this
    var phonereg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!phonereg.test(that.data.phone)) {
      wx.showModal({
        title: '错误提示',
        content: '手机号无效！',
      })
      return;
    }
    wx.request({
      url: app.globalData.url + "/api/getCode",
      method: "POST",
      data: {
        'mobile': that.data.phone,
        'id': app.globalData.userInfo.id
      },
      success: function(res) {
        console.log(res)
        if (res.data.result == 0) {
          wx.showToast({
            title: '验证码已发送！',
          })
          that.setData({
            canIgetCode: true
          })
        }
      }
    })
  },
  changeMyInfo: function() {
    var that = this
    var name = that.data.name
    var sex = that.data.sexindex
    var birthdayCodeIndex = that.data.birthdayCodeIndex
    var birthday = that.data.birthday
    var phone = that.data.phone
    var region = that.data.region
    var detail_address = that.data.detail_address
    var code = that.data.code
    wx.request({
      url: app.globalData.url + "/api/UserAddInfo",
      method: "POST",
      data: {
        name: name,
        sex: sex,
        birthday: birthday,
        birthday_type: birthdayCodeIndex,
        phone: phone,
        province: region[0],
        city: region[1],
        district: region[2],
        detail_address: detail_address,
        id: that.data.userInfo.id,
        code: code,
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code == 1) {
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function() {
            wx.switchTab({
              url: '../my/my',
            })
          }, 1000) //延迟时间 这里是1秒
        } else {
          wx.showModal({
            title: '错误警告',
            content: res.data.msg,
          })
        }
      }
    })
  },
  onShow:function(){
    console.log(app.globalData.userInfo,'app.globalData.userInfo')
    this.onLoad()
  }
})
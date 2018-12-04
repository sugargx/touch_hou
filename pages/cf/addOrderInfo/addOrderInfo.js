// pages/addOrderInfo/addOrderInfo.js
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var tools = require('../../../utils/myTools.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateTimeArray1: null,
    dateTime1: null,
    startYear: (new Date()).getFullYear(),
    endYear: (new Date()).getFullYear() + 1,
    distribution:"",
    selectFlag:false,
    notice:false,
    peopleNums:[2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    peopleNumIndex:3,
    pay_type:"",
    peopleNum: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var startTime = parseInt(wx.getStorageSync('startTime')), endTime = wx.getStorageSync('endTime') - 1
    console.log(wx.getStorageSync('startTime'), wx.getStorageSync('endTime'))
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, startTime, endTime);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      'dateTime1[3]':0
    });
    wx.setStorageSync("leave_message", "")
    wx.setStorageSync("notice", false)
    this.setData({
      pay_type: wx.getStorageSync("pay_type"),
    })
  },
  bindPeopleNumChange:function(e){
    this.setData({
      peopleNumIndex:e.detail.value,
      peopleNum: this.data.peopleNums[e.detail.value]
    })
  },
  changeDateTime1(e) {
    var dateTimeArray1 = this.data.dateTimeArray1
    var dateTime1 = this.data.dateTime1
    this.setData({
      distribution: dateTimeArray1[0][dateTime1[0]] + "-" + dateTimeArray1[1][dateTime1[1]] + "-" + dateTimeArray1[2][dateTime1[2]] + " " + dateTimeArray1[3][dateTime1[3]] + ":" + dateTimeArray1[4][dateTime1[4]],
      selectFlag: true
    });
    console.log(dateTimeArray1,"dateTimeArray1")
    console.log(dateTime1,"datetime1")
    console.log(this.data.distribution,'确定的时间')
    console.log(tools.strtotime(this.data.distribution + ":00"))
    console.log(Date.parse(new Date())/1000)
    wx.setStorageSync("distribution", this.data.distribution)

  },
  changeDateTimeColumn1(e) {
    console.log(e)
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    if(e.detail.column == 1){
      arr[2] = 0
    }

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
    });
  },
  noticeChange:function(e){
    var that = this
    console.log(e,'change')
    if(e.detail.value == true){
      wx.showModal({
        title: '小派提醒',
        content: '为了给用户更大惊喜，商家直接按时配送，收货人在配送前不会收到任何订单消息通知。请确保配送信息准确无误。',
        success:function(res){
          if(res.cancel){
            that.setData({
              notice:false
            })
            wx.setStorageSync("notice", false)
          }else{
            that.setData({
              notice: true
            })
            wx.setStorageSync("notice", true)
          }
        }
      })
    }
    
  },
  leaveMessageChange: function (e) {
    console.log(e)
    wx.setStorageSync("leave_message", e.detail.value)
  },
  boyNow:function(){
    if (this.data.distribution == ""){
      wx.showModal({
        title: '小派提醒',
        content: '请选择配送时间！',
      })
      return ;
    }
    if (tools.strtotime(this.data.distribution + ":00") < Date.parse(new Date()) / 1000){
      wx.showModal({
        title: '小派提醒',
        content: '派送时间不得早于当前时间',
      })
      return ;
    }

    wx.setStorageSync('peopleNum', this.data.peopleNum)
    wx.navigateTo({
      url: '../buy_now/buy_now',
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
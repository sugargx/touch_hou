Page({
  data: {
    // carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false,// 全选状态，默认全选
    carts: []
  },
  onLoad: function () {

  },
  onShow: function () {
    var carts = wx.getStorageSync('cart');
    this.setData({
      carts: carts
    })
    if (carts.length > 0) {
      this.setData({
        hasList: true
      })
    }
    console.log(carts)
    this.getTotalPrice()
  },
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].num * carts[i].goods_price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
    let j = 0;
    var selectAllStatus = false
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected == true) {
        j++;
        continue;
      } else {
        selectAllStatus = false;
      }
    }
    if (j == carts.length) {
      selectAllStatus = true;
    }
    this.setData({
      selectAllStatus: selectAllStatus
    })
  },

  selectList(e) {
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    let carts = this.data.carts; // 获取购物车列表
    let selectAllStatus = this.data.selectAllStatus; //获取全选状态
    const selected = carts[index].selected; // 获取当前商品的选中状态
    carts[index].selected = !selected; // 改变状态
    carts[index]['selected'] = !selected;
    //判断有一个没有选中，全选取消
    let j = 0;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected == true) {
        j++;
        continue;
      } else {
        selectAllStatus = false;
      }
    }
    if (j == carts.length) {
      selectAllStatus = true;
    }
    //如果都选中，全选也选中实现
    this.setData({
      carts: carts,
      selectAllStatus: selectAllStatus,
    });
    this.getTotalPrice(); // 重新获取总价
  },

  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
      carts[i]['selected'] = selectAllStatus; // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice(); // 重新获取总价
  },

  // 增加数量
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  // 减少数量
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  toBuy: function (e) {
    // var postId = event.currentTarget.dataset.postid;
    var that = this;
    var buyGoods = [];

    var carts = this.data.carts;

    carts.forEach(function (item, index) {
      console.log(item)
      if (item.selected == true) {
        buyGoods.push(item);
      }
    })

    if (buyGoods.length == 0) {
      wx.showModal({
        title: '请选择商品',
        // content: '未选中商品',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else {
      //付款
      wx.setStorageSync("goods", buyGoods)
      wx.setStorageSync("pay_type", 'gwc')
      wx.setStorageSync("totalPrice", that.data.totalPrice)
      wx.navigateTo({
        url: '../getinfo/getinfo',
      })
    }

  },
  toZc:function(){
    var that = this;
    var buyGoods = [];

    var carts = this.data.carts;

    carts.forEach(function (item, index) {
      console.log(item)
      if (item.selected == true) {
        buyGoods.push(item);
      }
    })

    if (buyGoods.length == 0) {
      wx.showModal({
        title: '请选择商品',
        // content: '未选中商品',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else {
      //付款
      wx.setStorageSync("goods", buyGoods)
      wx.setStorageSync("pay_type", 'gwc')
      wx.setStorageSync("totalPrice", that.data.totalPrice)
      wx.navigateTo({
        url: '../cf/addOrderInfo/addOrderInfo',
      })
    }

  },
  deleteList: function (e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你正准备从购物车中删除这个商品',
      success: function (res) {
        if (res.confirm) {
          var delId = e.currentTarget.dataset.delid;//转过来的商品id
          var goods_arr = wx.getStorageSync('cart');
          delete goods_arr[delId];//删除对象中的元素
          carts.splice(index, 1); // 删除购物车列表里这个商品
          var hasList = true;
          if (carts.length == 0) {
            hasList = false;
          }
          that.setData({
            carts: carts,
            hasList: hasList
          });
          wx.setStorageSync('cart', carts);//重新设缓存
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          });
          that.getTotalPrice()
        }
      }
    })
  },
});
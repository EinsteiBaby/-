const app = getApp();
Page({
  data: {

  },
  onLoad: function(options) {
    // 计算当前年以及上一个月
    var date = new Date();
    var year, month;
    year = date.getFullYear();
    month = date.getMonth();
    if (month < 10 && month != 0) {
      month = '0' + month
    }
    if (month == 0) {
      year = year - 1,
        month = 12
    }
    this.setData({
      date: year + '-' + month,
    })
    // 调用账单接口
    wx.request({
      url: app.data.baseUrl + 'getMyBill',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        years: this.data.date
      },
      success: (res) => {
        console.log('当前月份账单信息', res)
        if (res.data.errorcode == '0') {
          this.setData({
            billData: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 选择账单周期
  billPeriod(e) {
    console.log(e)
    this.setData({
      date: e.detail.value
    })
    // 调用账单接口
    wx.request({
      url: app.data.baseUrl + 'getMyBill',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        years: this.data.date
      },
      success: (res) => {
        console.log('当前月份账单信息', res)
        if (res.data.errorcode == '0') {
          this.setData({
            billData: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none'
          })
        }
      }
    })
  }
})
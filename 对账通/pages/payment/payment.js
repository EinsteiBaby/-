const app = getApp();
Page({
  data: {
    filtrate: false,
    payWay: [],
    checkStatus: [],
    isShow: false,
    pageIndex: 1,
    loadEnd: false,
    value: '',
    minMoney: '',
    maxMoney: '',
    payway_id: '',
    payee: '',
    checkstatus_id: '',
    begindate: '请选择开始日期',
    enddate: '请选择结束日期'
  },
  onLoad: function() {
    // 获取审核记录列表
    wx.request({
      url: getApp().data.baseUrl + 'getPayMent',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        pageindex: this.data.pageIndex,
        pagesize: 10,
        keywords: this.data.value,
        token: wx.getStorageSync('token'),
        startdate: '',
        enddate: '',
        min_amount: this.data.minMoney,
        max_amount: this.data.maxMoney,
        payment_type: '',
        receive_name: this.data.payee,
        payment_status: '',
        op_rights: wx.getStorageSync('op_rights'),
        op_code: wx.getStorageSync('username'),
        customer_id: wx.getStorageSync('customer_id')
      },
      success: (res) => {
        if (res.data.errorcode == 0) {
          this.setData({
            datasource: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none'
          })
        }
      }
    })
    // 获取筛选的付款方式以及审核状态下拉选项
    // 付款方式
    wx.request({
      url: getApp().data.baseUrl + 'getDictValue',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        dict_key: 4114
      },
      success: (res) => {
        if (res.data.errorcode == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.data.payWay.push(res.data.data[i].dict_prompt)
          }
          this.setData({
            payWay: this.data.payWay,
            // payway: this.data.payWay[0]
            payway: '所有'
          })
        }
      }
    })
    // 审核状态
    wx.request({
      url: getApp().data.baseUrl + 'getDictValue',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        dict_key: 4113
      },
      success: (res) => {
        if (res.data.errorcode == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.data.checkStatus.push(res.data.data[i].dict_prompt)
          }
          this.setData({
            checkStatus: this.data.checkStatus,
            // checkstatus: this.data.checkStatus[0]
            checkstatus: '所有'
          })
        }
      }
    })
  },
  // 关键字搜索
  bindInput(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 10,
    })
    this.setData({
      value: e.detail.value,
      pageindex: 1
    })
    wx.request({
      url: getApp().data.baseUrl + 'getPayMent',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        pageindex: '',
        pagesize: 10,
        keywords: this.data.value,
        token: wx.getStorageSync('token'),
        startdate: '',
        enddate: '',
        min_amount: this.data.minMoney,
        max_amount: this.data.maxMoney,
        payment_type: '',
        receive_name: this.data.payee,
        payment_status: '',
        op_rights: wx.getStorageSync('op_rights'),
        op_code: wx.getStorageSync('username'),
        customer_id: wx.getStorageSync('customer_id')
      },
      success: (res) => {
        if (res.data.errorcode == 0) {
          this.setData({
            datasource: res.data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.errormsg,
          })
        }
      }
    })
  },
  // 点击筛选
  filtrate() {
    this.setData({
      filtrate: !this.data.filtrate
    });
  },
  minMoney(e) {
    this.setData({
      minMoney: e.detail
    })
  },
  maxMoney(e) {
    this.setData({
      maxMoney: e.detail
    })
  },
  payee(e) {
    this.setData({
      payee: e.detail
    })
  },
  // 点击确定
  confirmBtn: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 10,
    })
    if (this.data.begindate == '请选择开始日期') {
      this.data.begindate = ''
    }
    if (this.data.enddate == '请选择结束日期') {
      this.data.enddate = ''
    }
    wx.request({
      url: getApp().data.baseUrl + 'getPayMent',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        pageindex: '',
        pagesize: 10,
        keywords: this.data.value,
        token: wx.getStorageSync('token'),
        startdate: this.data.begindate,
        enddate: this.data.enddate,
        min_amount: this.data.minMoney,
        max_amount: this.data.maxMoney,
        payment_type: this.data.payway_id,
        receive_name: this.data.payee,
        payment_status: this.data.checkstatus_id,
        op_rights: wx.getStorageSync('op_rights'),
        op_code: wx.getStorageSync('username'),
        customer_id: wx.getStorageSync('customer_id')
      },
      success: (res) => {
        console.log('接收数据:', res.data.data)
        if (res.data.errorcode == 0) {
          this.setData({
            datasource: res.data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.errormsg,
          })
        }
      }
    })
    this.setData({
      filtrate: false,
    })
  },
  // 点击取消
  cancelBtn: function() {
    this.setData({
      filtrate: false,
    })
  },
  // 选择时间
  begindate: function(e) {
    this.setData({
      begindate: e.detail.value
    })
  },
  enddate: function(e) {
    this.setData({
      enddate: e.detail.value
    })
  },
  // 付款方式
  payWay: function(e) {
    this.setData({
      payway: this.data.payWay[e.detail.value],
      payway_id: e.detail.value
    })
  },
  // 审核状态
  checkStatus: function(e) {
    console.log('筛选:', e)
    this.setData({
      checkstatus: this.data.checkStatus[e.detail.value],
      checkstatus_id: e.detail.value
    })
  },
  // 页面跳转
  info: function(e) {
    wx.showLoading({
      title: '玩命加载中...',
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../payment/paymentdetail?bill_id=' + e.currentTarget
          .dataset.id,
      }, 500)
    })
    wx.hideLoading();
  },
  onReachBottom: function() { //上拉的事件在这里写 上拉的时候就给个正在加载就好了
    //到底之后出现正在加载中
    this.setData({
      isShow: true
    })
    //下拉页码就得+1
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    let that = this;
    if (this.data.begindate == '请选择开始日期') {
      this.data.begindate = ''
    }
    if (this.data.enddate == '请选择结束日期') {
      this.data.enddate = ''
    }
    let data1 = {
      pageindex: this.data.pageIndex,
      pagesize: 10,
      keywords: this.data.value,
      token: wx.getStorageSync('token'),
      startdate: this.data.begindate,
      enddate: this.data.enddate,
      min_amount: this.data.minMoney,
      max_amount: this.data.maxMoney,
      payment_type: this.data.payway_id,
      receive_name: this.data.payee,
      payment_status: this.data.checkstatus_id
    }
    wx.request({
      url: getApp().data.baseUrl + 'getPayMent',
      data: {
        pageindex: this.data.pageIndex,
        pagesize: 10,
        keywords: this.data.value,
        token: wx.getStorageSync('token'),
        startdate: this.data.begindate,
        enddate: this.data.enddate,
        min_amount: this.data.minMoney,
        max_amount: this.data.maxMoney,
        payment_type: this.data.payway_id,
        receive_name: this.data.payee,
        payment_status: this.data.checkstatus_id,
        op_rights: wx.getStorageSync('op_rights'),
        op_code: wx.getStorageSync('username'),
        customer_id: wx.getStorageSync('customer_id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res) {
        console.log('上拉发送数据:', data1)
        console.log('上拉加载数据:', res.data.data)
        if (res.data.errorcode == '0') {
          if (res.data.data.length > 0) { //还有数据
            setTimeout(function() {
              that.setData({
                isShow: false
              })
              that.data.datasource = [...that.data.datasource, ...res.data.data];
              that.setData({
                datasource: that.data.datasource
              })
            }, 500);
            that.loadEnd = false;
          } else { //到底了
            that.setData({
              loadEnd: true
            })
          }
        } else {
          that.setData({
            isShow: false
          })
          that.setData({
            loadEnd: true
          })
        }
      }
    })
  }
});
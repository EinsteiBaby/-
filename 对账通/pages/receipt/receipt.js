const app = getApp();
Page({
  data: {
    current: 'tab1',
    dp1: 'show',
    dp2: 'none',
    dp3: 'none',
    pageIndex: 1,
    isShow1: false,
    loadEnd1: false,
    isShow2: false,
    loadEnd2: false,
    isShow3: false,
    loadEnd3: false,
    pendingDP: 'none',
    passedDP: 'none',
    refusedDP: 'none'
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
    if (detail.key == "tab1") {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
      this.setData({
        dp1: 'show',
        dp2: 'none',
        dp3: 'none',
        pageIndex: 1
      })
      // 展示待审核数据
      wx.request({
        url: app.data.baseUrl + 'getPayMent',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          pageindex: this.data.pageIndex,
          pagesize: 10,
          op_rights: wx.getStorageSync('op_rights'),
          keywords: '',
          token: wx.getStorageSync('token'),
          startdate: '',
          enddate: '',
          min_amount: '',
          max_amount: '',
          payment_type: '',
          receive_name: '',
          payment_status: 0,
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')

        },
        success: (res) => {
          console.log('待审核数据:',res)
          if (res.data.errorcode == 0) {
            this.setData({
              datasource1: res.data.data
            })
          } else {
            this.setData({
              pendingDP: 'show',
              passedDP: 'none',
              refusedDP: 'none'
            })
          }
        }
      })
    } else if (detail.key == "tab2") {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
      this.setData({
        dp1: 'none',
        dp2: 'show',
        dp3: 'none',
        pageIndex: 1
      })
      // 展示已过审数据
      wx.request({
        url: app.data.baseUrl + 'getPayMent',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          pageindex: this.data.pageIndex,
          pagesize: 10,
          op_rights: wx.getStorageSync('op_rights'),
          keywords: '',
          token: wx.getStorageSync('token'),
          startdate: '',
          enddate: '',
          min_amount: '',
          max_amount: '',
          payment_type: '',
          receive_name: '',
          payment_status: 1,
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')
        },
        success: (res) => {
          console.log(`已过审: `,res)
          if (res.data.errorcode == 0) {
            this.setData({
              datasource2: res.data.data
            })
          } else {
            this.setData({
              passedDP: 'show',
              pendingDP: 'none',
              refusedDP: 'none'
            })
          }
        }
      })
    } else if (detail.key == 'tab3') {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
      this.setData({
        dp1: 'none',
        dp2: 'none',
        dp3: 'show',
        pageIndex: 1
      })
      // 展示未过审数据
      wx.request({
        url: app.data.baseUrl + 'getPayMent',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          pageindex: this.data.pageIndex,
          pagesize: 10,
          op_rights: wx.getStorageSync('op_rights'),
          keywords: '',
          token: wx.getStorageSync('token'),
          startdate: '',
          enddate: '',
          min_amount: '',
          max_amount: '',
          payment_type: '',
          receive_name: '',
          payment_status: 2,
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')
        },
        success: (res) => {
          console.log('未过审:', res)
          if (res.data.errorcode == 0) {
            this.setData({
              datasource3: res.data.data
            })
          } else {
            this.setData({
              refusedDP: 'show',
              pendingDP: 'none',
              passedDP: 'none'
            })
          }
        }
      })
    }
  },
  onShow: function() {
    this.setData({
      pageIndex: 1
    })
    if (this.data.current == 'tab1') {
      wx.request({
        url: app.data.baseUrl + 'getPayMent',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          pageindex: this.data.pageIndex,
          pagesize: 10,
          op_rights: wx.getStorageSync('op_rights'),
          keywords: '',
          token: wx.getStorageSync('token'),
          startdate: '',
          enddate: '',
          min_amount: '',
          max_amount: '',
          payment_type: '',
          receive_name: '',
          payment_status: 0,
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')
        },
        success: (res) => {
          console.log('待审核列表', res)
          if (res.data.errorcode == 0) {
            this.setData({
              datasource1: res.data.data
            })
          } else {
            this.setData({
              pendingDP: 'show'
            })
          }
        }
      })
    }
  },
  // 去审核的界面
  toPending: function(e) {
    wx.navigateTo({
      url: '../receipt/pending?bill_id=' + e.currentTarget.dataset.id,
    })
  },
  clientdetail: function(e) {
    wx.navigateTo({
      url: '../receipt/billdetail?bill_id=' + e.currentTarget.dataset.id,
    })
  },
  // 页面上拉触发事件
  onReachBottom: function() {
    // 待审核界面上拉
    if (this.data.dp1 == 'show') {
      //待审核 上拉事件
      this.setData({
        isShow1: true
      })
      //下拉页码就得+1
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      let that = this;
      wx.request({
        url: app.data.baseUrl + 'getPayMent',
        data: {
          pageindex: this.data.pageIndex,
          pagesize: 10,
          op_rights: wx.getStorageSync('op_rights'),
          keywords: '',
          token: wx.getStorageSync('token'),
          startdate: '',
          enddate: '',
          min_amount: '',
          max_amount: '',
          payment_type: '',
          receive_name: '',
          payment_status: 0,
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          if (res.data.errorcode == '0') {
            console.log('待审核上拉数据:', res)
            if (res.data.data.length > 0) { //还有数据
              setTimeout(function() {
                that.setData({
                  isShow1: false
                })
                that.data.datasource1 = [...that.data.datasource1, ...res.data.data];
                that.setData({
                  datasource1: that.data.datasource1
                })
              }, 500);
              that.loadEnd1 = false;
            } else { //到底了
              that.setData({
                loadEnd1: true
              })
            }
          } else {
            that.setData({
              isShow1: false
            })
            that.setData({
              loadEnd1: true
            })
          }
        }
      })
    }
    // 已过审界面上拉
    if (this.data.dp2 == 'show') {
      //已过审 上拉事件
      this.setData({
        isShow2: true
      })
      //下拉页码就得+1
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      let that = this;
      wx.request({
        url: app.data.baseUrl + 'getPayMent',
        data: {
          pageindex: this.data.pageIndex,
          pagesize: 10,
          op_rights: wx.getStorageSync('op_rights'),
          keywords: '',
          token: wx.getStorageSync('token'),
          startdate: '',
          enddate: '',
          min_amount: '',
          max_amount: '',
          payment_type: '',
          receive_name: '',
          payment_status: 1,
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          console.log('已过审上拉加载数据:', res.data.data)
          if (res.data.errorcode == '0') {
            if (res.data.data.length > 0) { //还有数据
              setTimeout(function() {
                that.setData({
                  isShow2: false
                })
                that.data.datasource2 = [...that.data.datasource2, ...res.data.data];
                that.setData({
                  datasource2: that.data.datasource2
                })
              }, 500);
              that.loadEnd2 = false;
            } else { //到底了
              that.setData({
                loadEnd2: true
              })
            }
          } else {
            that.setData({
              isShow2: false
            })
            that.setData({
              loadEnd2: true
            })
          }
        }
      })
    }
    // 未过审界面上拉
    if (this.data.dp3 == 'show') {
      //未过审 上拉事件
      this.setData({
        isShow3: true
      })
      //下拉页码就得+1
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      let that = this;
      wx.request({
        url: app.data.baseUrl + 'getPayMent',
        data: {
          pageindex: this.data.pageIndex,
          pagesize: 10,
          op_rights: wx.getStorageSync('op_rights'),
          keywords: '',
          token: wx.getStorageSync('token'),
          startdate: '',
          enddate: '',
          min_amount: '',
          max_amount: '',
          payment_type: '',
          receive_name: '',
          payment_status: 2,
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          console.log('已过审上拉加载数据:', res.data.data)
          if (res.data.errorcode == '0') {
            if (res.data.data.length > 0) { //还有数据
              setTimeout(function() {
                that.setData({
                  isShow3: false
                })
                that.data.datasource3 = [...that.data.datasource3, ...res.data.data];
                that.setData({
                  datasource3: that.data.datasource3
                })
              }, 500);
              that.loadEnd3 = false;
            } else { //到底了
              that.setData({
                loadEnd3: true
              })
            }
          } else {
            that.setData({
              isShow3: false
            })
            that.setData({
              loadEnd3: true
            })
          }
        }
      })
    }
  }
});
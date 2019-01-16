const app = getApp();
Page({
  data: {
    isBoss: 'none',
    statusDP: 'none',
    visible2: false,
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    circles: []
  },
  map: function(e) {
    wx.navigateTo({
      url: '../myclient/map?client_id=' + e.target.dataset.id,
    })
  },
  onShow: function() {
    if (wx.getStorageSync('op_rights') == '1') {
      this.setData({
        isBoss: 'show',
        statusDP: 'none'
      })
    } else if (wx.getStorageSync('op_rights') == '2') {
      this.setData({
        isBoss: 'none',
        statusDP: 'show'
      })
    }
  },
  onLoad: function(options) {
    this.setData({
      client_id: options.client_id
    })
    // 获取详细信息
    wx.request({
      url: app.data.baseUrl + 'getClientInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        client_id: this.data.client_id
      },
      success: (res) => {
        console.log('用户详细信息:', res)
        if (res.data.errorcode == 0) {
          this.setData({
            datasource: res.data.data,
            long_name: res.data.data[0].long_name,
            mobile: res.data.data[0].mobile,
            use_code: res.data.data[0].use_code,
            relation_name: res.data.data[0].relation_name,
            project_name: res.data.data[0].project_name
          })
        } else {
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none'
          })
          wx.navigateBack({

          })
        }
      }
    })
    // 获取地图信息
    let that = this;
    wx.request({
      url: app.data.baseUrl + 'getMapInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        table_id: options.client_id
      },
      success: (res) => {
        console.log('定位信息:', res)
        if (res.data.errorcode == 0) {
          this.setData({
            latitude: res.data.data[0].MapXY[0].latitude,
            longitude: res.data.data[0].MapXY[0].longitude
          })
          wx.getLocation({
            type: 'wgs84',
            success: function(res) {
              that.setData({
                latitude: that.data.latitude,
                longitude: that.data.longitude,
                markers: [{
                  id: "1",
                  latitude: that.data.latitude,
                  longitude: that.data.longitude,
                  width: 30,
                  height: 30,
                  iconPath: '../../img/location.png',
                  title: "上传位置"

                }],
                circles: [{
                  latitude: that.data.latitude,
                  longitude: that.data.longitude,
                  color: '#FF0000DD',
                  fillColor: '#7cb5ec88',
                  radius: 3000,
                  strokeWidth: 1
                }]

              })
            }
          })
        }
      }
    })
  },
  //点击merkers
  // markertap(e) {
  //   console.log(e.markerId)

  //   wx.showActionSheet({
  //     itemList: ["A"],
  //     success: function(res) {
  //       console.log(res.tapIndex)
  //     },
  //     fail: function(res) {
  //       console.log(res.errMsg)
  //     }
  //   })
  // },

  //点击缩放按钮动态请求数据
  controltap(e) {
    var that = this;
    console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      that.setData({
        scale: --this.data.scale
      })
    } else {
      that.setData({
        scale: ++this.data.scale
      })
    }
  },
  // 放大照片
  biggerImg: function(url) {
    if (url.currentTarget.dataset.url) {
      wx.previewImage({
        urls: [url.currentTarget.dataset.url]
      })
    }
  },
  passing: function(e) {
    wx.request({
      url: app.data.baseUrl + 'checkClientInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        client_id: this.data.client_id,
        check_status: 1,
        use_code: this.data.use_code,
        mobile: this.data.mobile,
        long_name: this.data.long_name,
        customer_id: wx.getStorageSync('customer_id'),
        op_code: wx.getStorageSync('username'),
        relation_name: this.data.relation_name,
        project_name: this.data.project_name,
        ret_remark: ''
      },
      success: (res) => {
        console.log('审核结果:', res)
        if (res.data.errorcode == 0) {
          wx.showToast({
            title: '已通过',
            duration: 2500
          })
          setTimeout(function() {
            wx.showLoading({
              title: '玩命加载中...',
            })
          }, 2800)
          setTimeout(function() {
            wx.navigateBack({

            })
          }, 3000)
        } else {
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none',
            duration: 2500
          })
        }
      }
    })
  },
  onClose(key) {
    console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  onClose2() {
    this.onClose('visible2')
  },
  refusing: function(e) {
    wx.showModal({
      title: '提示',
      content: '您真的要拒绝这条审核吗',
      confirmColor: '#ffc900',
      confirmText: '确定',
      cancelText: '手滑了',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            visible2: true,
          })
        }
      }
    })
  },
  ret_remark(e) {
    this.setData({
      ret_remark: e.detail.detail.value
    })
  },
  sub: function() {
    let senddata = {
      token: wx.getStorageSync('token'),
      client_id: this.data.client_id,
      check_status: 2,
      use_code: this.data.use_code,
      mobile: this.data.mobile,
      long_name: this.data.long_name,
      customer_id: wx.getStorageSync('customer_id'),
      op_code: wx.getStorageSync('username'),
      relation_name: this.data.relation_name,
      project_name: this.data.project_name,
      ret_remark: this.data.ret_remark
    }
    wx.request({
      url: app.data.baseUrl + 'checkClientInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        client_id: this.data.client_id,
        check_status: 2,
        use_code: this.data.use_code,
        mobile: this.data.mobile,
        long_name: this.data.long_name,
        customer_id: wx.getStorageSync('customer_id'),
        op_code: wx.getStorageSync('username'),
        relation_name: this.data.relation_name,
        project_name: this.data.project_name,
        ret_remark: this.data.ret_remark
      },
      success: (res) => {
        console.log('发送数据:', senddata)
        if (res.data.errorcode == 0) {
          wx.showToast({
            title: '已经拒绝这条审核~',
            icon: 'none',
            duration: 2500
          })
          setTimeout(function() {
            wx.showLoading({
              title: '玩命加载中...',
            })
          }, 2800)
          setTimeout(function() {
            wx.navigateBack({

            })
          }, 3000)
        } else {
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none',
            duration: 2500
          })
        }
      }
    })
  }
})
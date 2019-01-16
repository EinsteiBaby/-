const app = getApp();
Page({
  data: {
    visible2: false,
    ret_remark: '',
    isBoss: 'none',
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    circles: []
  },
  onLoad: function(options) {
    this.setData({
      bill_id: options.bill_id
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
        table_id: options.bill_id
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
  onShow: function() {
    if (wx.getStorageSync('op_rights') == 2) {
      this.setData({
        isBoss: 'none'
      })
    } else if (wx.getStorageSync('op_rights') == 1) {
      this.setData({
        isBoss: 'show'
      })
    }
    wx.request({
      url: app.data.baseUrl + 'getPayMentInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        bill_id: this.data.bill_id
      },
      success: (res) => {
        console.log('详细信息:', res)
        if (res.data.errorcode == 0) {
          this.setData({
            datasource: res.data.data,
            imgArray: res.data.data[0].file_path
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
  // 放大照片
  biggerImg: function(url) {
    if (url.currentTarget.dataset.url) {
      wx.previewImage({
        urls: [url.currentTarget.dataset.url]
      })
    }
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
  // 点击拒绝按钮
  refusing: function() {
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
  ret_remark: function(e) {
    this.setData({
      ret_remark: e.detail.detail.value
    })
  },
})
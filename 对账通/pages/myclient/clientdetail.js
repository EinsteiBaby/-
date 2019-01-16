const app = getApp();
Page({
  data: {
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    circles: []
  },
  onLoad: function (options) {
    this.setData({
      client_id: options.client_id
    })
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
            use_code: res.data.data[0].use_code
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
            success: function (res) {
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
                  radius: 2000,
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
  //     success: function (res) {
  //       console.log(res.tapIndex)
  //     },
  //     fail: function (res) {
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
  biggerImg: function (url) {
    if (url.currentTarget.dataset.url) {
      wx.previewImage({
        urls: [url.currentTarget.dataset.url]
      })
    }
  },
})
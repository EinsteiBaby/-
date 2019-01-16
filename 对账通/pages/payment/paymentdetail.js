const app = getApp();
Page({
  data: {
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    circles: []
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      bill_id: options.bill_id
    })
    wx.request({
      url: getApp().data.baseUrl + 'getPayMentInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        bill_id: options.bill_id
      },
      success: (res) => {
        console.log('付款详情:', res)
        if (res.data.errorcode == 0) {
          this.setData({
            datasource: res.data.data,
            imgArray: res.data.data[0].file_path
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
                  title: "哪里"
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
  // 放大照片
  biggerImg: function(url) {
    if (url.currentTarget.dataset.url) {
      wx.previewImage({
        urls: [url.currentTarget.dataset.url]
      })
    }
  },
})
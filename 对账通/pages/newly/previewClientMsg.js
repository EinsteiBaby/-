const app = getApp();
Page({
  data: {
    isSub: false
  },
  onLoad: function(options) {
    console.log(options)
    // console.log(options.imgArray)
    // console.log(JSON.parse(options.imgArray))
    this.setData({
      shortName: options.shortName,
      fullName: options.fullName,
      clientkind: options.clientkind,
      relation_man: options.relation_man,
      relation_phone: options.relation_phone,
      relation_add: options.relation_add,
      remark: options.remark,
      imgArray: JSON.parse(options.imgArray),
      clientIndex: options.clientIndex,
      longitude: options.longitude,
      latitude: options.latitude,
      account: options.account,
      projectInfo: options.projectInfo
    })
    for (let i = 0; i < this.data.imgArray.length; i++) {
      wx.getImageInfo({
        src: this.data.imgArray[i],
        success: (res) => {
          // console.log('成功', res)
        },
        fail: (res) => {
          console.log('失败:', res)
        }
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
  // 点击上传按钮
  submit: function() {
    wx.showLoading({
      title: '玩命加载中...',
    })
    let otherData = {
      token: wx.getStorageSync('token'),
      action_in: 1, // 操作类型(1.增加 2.修改 3.删除);
      client_id: '', //客户id(action = 1，不用填；action = 2 / 3 / 4，必填);
      customer_id: wx.getStorageSync('customer_id'),
      client_kind: this.data.clientIndex,
      long_name: this.data.fullName,
      short_name: this.data.shortName,
      address: this.data.relation_add,
      relation_name: this.data.relation_man,
      mobile: this.data.relation_phone,
      remark: this.data.remark,
      project_name: this.data.projectInfo,
      use_code: this.data.account,
      op_code: wx.getStorageSync('username')
    }
    wx.request({
      url: getApp().data.baseUrl + 'updateClientInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: otherData,
      success: (res) => {
        console.log('给接口发送的数据:', otherData)
        console.log('其他数据接口返回数据:', res)
        // var client_id = res.data.data[0].client_id
        if (res.data.errorcode == 0) { // 数据上传成功 接下来上传照片
        this.setData({
          isSub: true
        })
          var client_id = res.data.data[0].client_id
          for (let i = 0; i < this.data.imgArray.length; i++) { // 对照片进行循环
            wx.uploadFile({
              url: app.data.baseUrl + 'uploadPhotos', // 仅为示例，非真实的接口地址
              filePath: this.data.imgArray[i],
              name: 'shphoto',
              formData: {
                location: this.data.latitude + ',' + this.data.longitude, // 纬度,经度
                table_id: client_id,
                sOpCode: wx.getStorageSync('username'),
                table_name: 'T_Jcjg_client'
              },
              success: (res) => {
                console.log('照片数量:', this.data.imgArray.length)
                console.log('照片地址:', this.data.imgArray[i])
                console.log('照片上传接口返回:', res)
                console.log('地理位置:', this.data.longitude, ',', this.data.latitude)
                if (JSON.parse(res.data).errorcode == '10001') {
                  wx.showToast({
                    // title: JSON.parse(res.data).errormsg,
                    title: '新增信息成功',
                    duration: 2500
                  })
                  setTimeout(function() {
                    wx.showLoading({
                      title: '玩命加载中...',
                    })
                  }, 2800)
                  setTimeout(function() {
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }, 3200)
                  setTimeout(function() {
                    wx.hideLoading();
                  }, 3500)
                } else {
                  wx.showToast({
                    title: JSON.parse(res.data).errormsg,
                    icon: 'none'
                  })
                }
              },
              fail: (res) => {
                console.log('失败:', res)
              }
            })
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.errormsg,
            icon: 'none'
          })
        }
      }
    })
  }
})
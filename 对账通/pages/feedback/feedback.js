const app = getApp();
Page({
  data: {
    starIndex: 5,
    starText: '满意爆棚！！',
    name: '',
    phoneNum: '',
    feedback: ''
  },
  onChange(e) {
    const index = e.detail.index;
    if (index == 1) {
      this.setData({
        starIndex: e.detail.index,
        'starText': '好像给不了０星'
      })
    }
    if (index == 2) {
      this.setData({
        starIndex: e.detail.index,
        'starText': '勉强给一颗✨'
      })
    }
    if (index == 3) {
      this.setData({
        starIndex: e.detail.index,
        'starText': '我觉得还行吧'
      })
    }
    if (index == 4) {
      this.setData({
        starIndex: e.detail.index,
        'starText': '就差那么一点了✨'
      })
    }
    if (index == 5) {
      this.setData({
        starIndex: e.detail.index,
        'starText': '满意爆棚！！'
      })
    }

  },
  // 获取姓名
  getName: function(e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  // 获取联系电话
  getPhoneNum: function(e) {
    this.setData({
      phoneNum: e.detail.detail.value
    })
  },
  // 获取反馈意见
  getFeedBack: function(e) {
    this.setData({
      feedback: e.detail.detail.value
    })
  },
  // 提交按钮
  submit: function() {
    if (!this.data.name) {
      wx.showToast({
        icon: 'none',
        title: '请输入您的姓名',
      })
      return false;
    }
    if (!this.data.phoneNum) {
      wx.showToast({
        icon: 'none',
        title: '请输入您的联系电话',
      })
      return false;
    } else if (!(/^1[34578]\d{9}$/.test(this.data.phoneNum))) {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号码的正确格式',
      })
      return false;
    }
    if (!this.data.feedback) {
      wx.showToast({
        icon: 'none',
        title: '请输入您的反馈内容哦~',
      })
      return false;
    }
    wx.request({
      url: app.data.baseUrl + 'updateFeedBack',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        action_in: 1, //操作类型(1.增加 2.修改 3.删除);
        op_code: wx.getStorageSync('username'),
        id: '', // 反馈id(action = 1，不用填；action = 2 / 3，必填);
        fb_name: this.data.name,
        telephone: this.data.phoneNum,
        fb_info: this.data.feedback,
        fb_level: this.data.starIndex
      },
      success: (res) => {
        console.log(this.data.starIndex)
        if (res.data.errorcode == 0) {
          wx.showToast({
            title: '反馈成功',
            duration: 1500
          })
          setTimeout(function() {
            wx.showLoading({
              title: '玩命加载中...'
            })
          }, 1700)
          setTimeout(function() {
            wx.switchTab({
              url: '../index/index',
            })
          }, 2200)
        }
      }
    })
  },
  onLoad: function(options) {

  }
})
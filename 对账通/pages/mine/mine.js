const app = getApp()
Page({
  data: {
    tabbar: {},
    signature: '写点什么吧...',
    isToLogin:'none'
  },
  tologin: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  // 编辑资料
  edit: function() {
    // wx.navigateTo({
    //   url: '../mine/edit',
    // })
    wx.showToast({
      title: '功能待开发',
      icon: 'none'
    })
  },
  // 意见反馈
  feedback: function() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  // 联系我们
  contact: function() {
    wx.makePhoneCall({
      phoneNumber: '0571-87310255',
    })
  },
  help: function() {
    wx.showToast({
      title: '功能待开发',
      icon: 'none'
    })
  },
  // 注销
  exit: function() {
    wx.showModal({
      title: '提示',
      content: '您真的要注销吗?',
      confirmText: '确定',
      cancelText: '我再想想',
      confirmColor: '#ffc900',
      success: (res) => {
        if (res.confirm) {
          // 清除权限缓存
          wx.clearStorageSync('op_rights');
          wx.redirectTo({
            url: '../login/login',
          })
          wx.setStorageSync('autoLogin', 0)
        } else {
          console.log('选择取消注销')
        }
      }
    })

  },
  onReady: function() {
    wx.hideTabBar();
  },
  onShow: function() {
    wx.hideTabBar();
    if (wx.getStorageSync('username')) {
      this.setData({
        isToLogin: 'none'
      })
    } else {
      this.setData({
        isToLogin: 'show'
      })
    }
  },
  onLoad: function() {
    console.log('头像:', wx.getStorageSync('op_avatar'))
    console.log('昵称:', wx.getStorageSync('op_name'))
    app.editTabbar();
    this.setData({
      headImg: wx.getStorageSync('op_avatar'),
      nickName: wx.getStorageSync('op_name')
    })
    if (wx.getStorageSync('username')) {
      console.log('用户名：', wx.getStorageSync('username'))
      this.setData({
        exitShow: 'show'
      })
    } else {
      this.setData({
        exitShow: 'none'
      })
    }
  }
})
const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    checked: true,
    username: '',
    userpassword: ''
  },
  onLoad: function(options) {
    wx.setStorageSync('autoLogin', 1)
    wx.login({
      success: (res) => {
        console.log(res)
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.data.appid + '&secret=' + app.data.secret + '&js_code=' + res.code + '&grant_type=authorization_code',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
              console.log('向服务器请求:', res)
              // openid 和 session_key 存入缓存
              wx.setStorageSync('openid', res.data.openid),
                wx.setStorageSync('session_key', res.data.session_key)
            },
            fail: (res) => {
              wx.showToast({
                title: res,
              })
            }
          })
        }
      }
    })
  },
  usernameInput(e) {
    // 账号
    this.setData({
      username: e.detail.detail.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    })
    console.log('用户名:', this.data.username)
  },
  userpasswordInput(e) {
    // 密码
    this.setData({
      userpassword: e.detail.detail.value
    })
  },
  // 是否自动登录
  isAutoLogin({
    detail = {}
  }) {
    wx.vibrateShort({});
    this.setData({
      checked: detail.current
    });
    if (this.data.checked == true) { // 勾选了自动登录 把autoLogin置1
      wx.setStorageSync('autoLogin', 1)
    } else { // 不勾选则置0
      wx.setStorageSync('autoLogin', 0)
    }
  },
  // 获取用户信息
  bindgetUserInfo: function(e) {
    wx.vibrateShort({});
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '玩命加载中...',
      })
      if (this.data.username == '') {
        wx.showToast({
          icon: 'none',
          title: '请输入您的用户名',
        })
        return false;
      }
      if (this.data.userpassword == '') {
        wx.showToast({
          icon: 'none',
          title: '请输入密码',
        })
        return false;
      }
      let logindata = {
        usercode: this.data.username,
        userpassword: util.sha1(util.sha1(this.data.userpassword)),
        deviceid: 'deviceid',
        osinfo: 'osinfo',
        timestamp: '123456',
        key: util.sha1(this.data.username + util.sha1(util.sha1(this.data.userpassword)) + 'deviceid' + '123456'),
        openid: wx.getStorageSync('openid')
      }
      wx.request({
        url: app.data.baseUrl + 'Login',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: logindata,
        method: "POST",
        success: (res) => {
          if (res.data.errorcode == 0) { // 账号密码正确
            console.log('向登录接口发送数据:', logindata)
            console.log('登录接口返回:', res)
            wx.setStorageSync('op_name', res.data.data[0].op_name)
            wx.setStorageSync('op_avatar', res.data.data[0].op_avatar)
            wx.setStorageSync('token', res.data.data[0].token)
            wx.setStorageSync('username', this.data.username)
            wx.setStorageSync('op_rights', res.data.data[0].op_rights)
            wx.setStorageSync('customer_id', res.data.data[0].customer_id)
            setTimeout(function() {
              wx.switchTab({
                url: '../index/index'
              })
            }, 500)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.errormsg,
            })
          }
        }
      })
      wx.hideLoading();
    } else {
      wx.showModal({
        title: '提示',
        content: '我们只是想获取您的头像和昵称!',
        confirmText: '我知道了',
        showCancel: false,
        confirmColor: '#ffc900'
      })
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: '对账通',
      path: '/pages/index/index',
      imageUrl: '../../img/transmitImg.png',
      success: (res) => {
        wx.showShareMenu({
          withShareTicket: true
        })
      },
      fail(res) {
        wx.showToast({
          title: '转发失败,请重新尝试',
          icon: 'none'
        })
      },
      complete() {}
    }
  },
})
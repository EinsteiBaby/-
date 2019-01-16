const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    tabbar: {},
    imgUrls: [
      'http://115.231.105.68:8777/Images/index/swiperImg1.jpg',
      'http://115.231.105.68:8777/Images/index/swiperImg2.jpg',
      'http://115.231.105.68:8777/Images/index/swiperImg3.jpg',
      'http://115.231.105.68:8777/Images/index/swiperImg4.jpg',
    ],
    isToLogin:'none'
  },
  // 跳转我的账单
  mybill: function() {
    wx.vibrateShort({});
    wx.showLoading({
      title: '玩命加载中...',
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../mybill/mybill',
      })
    }, 500)
    wx.hideLoading();
  },
  // 跳转付款记录
  payment: function() {
    wx.vibrateShort({});
    wx.showLoading({
      title: '玩命加载中...',
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../payment/payment',
      })
    }, 500)
    wx.hideLoading();
  },
  // 跳转我的客户
  myclient: function() {
    wx.vibrateShort({});
    wx.showLoading({
      title: '玩命加载中...',
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../myclient/myclient',
      })
    }, 500)
    wx.hideLoading();
  },
  // 跳转收款记录
  receipt: function() {
    wx.vibrateShort({});
    wx.showLoading({
      title: '玩命加载中...',
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../receipt/receipt',
      })
    }, 500)
    wx.hideLoading();
  },
  loginbtn: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onReady: function() {
    wx.hideTabBar();
  },
  // 页面每次加载都进行一次判断是否登录,如果登录了展示index,如果未登录则提示去登录
  onShow: function() {
    wx.hideTabBar();
    console.log('当前登录用户类型:', wx.getStorageSync('op_rights'));
    console.log('当前登录用户:', wx.getStorageSync('username'));
    if (wx.getStorageSync('username')) {
      this.setData({
        isShowIndex: 'show',
        isToLogin: 'none'
      })
    } else {
      this.setData({
        isShowIndex: 'none',
        isToLogin: 'show'
      })
    }
    console.log('自动登录状态:', wx.getStorageSync('autoLogin'))
    // 获取菜单
    wx.request({
      url: app.data.baseUrl + 'getMenu',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        usercode: wx.getStorageSync('username')
      },
      success: (res) => {
        console.log('菜单返回:', res)
        if (res.data.errorcode == 0) {
          // 获取菜单成功
          this.setData({
            menuData: res.data.data
          })
        } else {
          // 获取菜单失效 如果有勾选自动登录则弹出模态框 没有就退到登录界面
          if (wx.getStorageSync('autoLogin') == 1) { //有自动登录
            // 访问自动登录接口
            wx.request({
              url: app.data.baseUrl + 'autoLogin',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                openid: wx.getStorageSync('openid'),
                timestamp: '123456',
                key: util.sha1(wx.getStorageSync('openid') + '123456')
              },
              success: (res) => {
                console.log('自动登录接口返回:', res)
                // 自动登录接口返回了一个新的token 用来重新访问菜单接口
                wx.setStorageSync('token', res.data.data[0].token);
                if (res.data.errorcode == 0) { //自动登录成功
                  wx.showModal({
                    title: '提示',
                    content: '登录已失效,是否恢复登录状态',
                    confirmColor: '#ffc900',
                    success: (res) => {
                      if (res.confirm) {
                        // 点击确定  访问菜单接口
                        wx.request({
                          url: app.data.baseUrl + 'getMenu',
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          data: {
                            token: wx.getStorageSync('token'),
                            usercode: wx.getStorageSync('username')
                          },
                          success: (res) => {
                            console.log(res)
                            if (res.data.errorcode == 0) {
                              this.setData({
                                menuData: res.data.data
                              })
                            }
                          }
                        })
                      } else if (res.cancel) {
                        wx.navigateTo({
                          url: '../login/login',
                        })
                      }
                    }
                  })
                }
              }
            })
          } else {
            // 弹出去登陆的模态框
            wx.showModal({
              title: '提示',
              content: '登录已失效,请前往重新登录',
              confirmColor: '#ffc900',
              showCancel: false,
              success: (res) => {
                wx.redirectTo({
                  url: '../login/login',
                })
              }
            })
          }
        }
      }
    })
  },
  tologin: function() {
    wx.redirectTo({
      url: '../login/login',
    })
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: '0571-87310255'
    })
  },
  onLoad: function() {
    app.editTabbar();
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
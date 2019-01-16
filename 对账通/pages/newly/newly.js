const app = getApp();
Page({
  data: {
    wayArray: [],
    clientKind: [],
    total: '0.00',
    payIndex: 0,
    buyer: '',
    buyer_id: '',
    payer: '',
    receiver: '',
    remark: '',
    remark_new: '',
    instalment: '',
    imgArray: [],
    isToLogin: 'none',
    isClient: 'none',
    isLeader: 'none',
    isSalesman: 'none',
    relation_man: '',
    relation_phone: '',
    relation_add: '',
    clientIndex: 0,
    account: ''
  },
  tologin: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onShow: function() {
    wx.getSetting({
      success: (res) => {
        console.log(res.authSetting)
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: '我们需要获取您的地理位置来进行一些相关操作,请同意位置授权',
            confirmColor: '#ffc900',
            showCancel: false,
            success: (res) => {
              wx.openSetting({})
            }
          })
        } else {
          console.log('同意授权地理位置信息')
        }
      }
    })
    if (!wx.getStorageSync('username')) {
      this.setData({
        isToLogin: 'show'
      })
    } else {
      this.setData({
        isToLogin: 'none'
      })
    }
  },
  onLoad: function(options) {
    wx.getSetting({
      success: (res) => {
        console.log(res.authSetting)
        // 获取当前地理位置
        let that = this;
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            const latitude = res.latitude
            const longitude = res.longitude
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            // console.log('地理位置:',that.data.longitude)
          },
          fail(res) {
            wx.showModal({
              title: '提示',
              content: '我们需要获取您的地理位置来进行一些相关操作,请同意位置授权',
              confirmColor: '#ffc900',
              showCancel: false,
              success: (res) => {
                wx.openSetting({})
              }
            })
          }
        })
      }
    })
    // 是客户类型登录
    if (wx.getStorageSync('op_rights') == '3') {
      this.setData({
        isClient: 'show',
        isLeader: 'none',
        isSalesman: 'none'
      })
    } else if (wx.getStorageSync('op_rights') == '1' || wx.getStorageSync('op_rights') == '2') {
      // 拥有审核权的用户登录
      this.setData({
        isLeader: 'show',
        isClient: 'none',
        isSalesman: 'none'
      })
    }
    if (wx.getStorageSync('op_rights') == 3) {
      // 获取当前日期
      var date = new Date;
      let year, month, day;
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.setData({
        paytime: year + '-' + month + '-' + day
      })
      // 调用接口获取合同买受人
      wx.request({
        url: app.data.baseUrl + 'getCustomers',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          op_code: wx.getStorageSync('username'),
          customer_id: wx.getStorageSync('customer_id')
        },
        success: (res) => {
          console.log('合同买受人:', res)
          if (res.data.errorcode == 0) {
            this.setData({
              buyer: res.data.data[0].long_name
            })
          } else {
            this.setData({
              buyer: '暂未获取到合同买受人信息'
            })
          }
        }
      })
      // 调用接口加载付款方式下拉项
      wx.request({
        url: getApp().data.baseUrl + 'getDictValue',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          dict_key: 4114
        },
        success: (res) => {
          if (res.data.errorcode == 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.data.wayArray.push(res.data.data[i].dict_prompt)
            }
            this.setData({
              wayArray: this.data.wayArray,
              payway: this.data.wayArray[0]
            })
          }
        }
      })
    } else if (wx.getStorageSync('op_rights') == '1' || wx.getStorageSync('op_rights') == '2') {
      // 调用接口加载客户类型下拉项
      wx.request({
        url: getApp().data.baseUrl + 'getDictValue',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          dict_key: 1007
        },
        success: (res) => {
          if (res.data.errorcode == 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.data.clientKind.push(res.data.data[i].dict_prompt)
            }
            this.setData({
              clientKind: this.data.clientKind,
              clientkind: this.data.clientKind[0]
            })
            // console.log(this.data.clientkind)
            // console.log(this.data.clientKind)
          }
        }
      })
    } else {
      wx.showToast({
        title: '系统故障,请返回重试',
        icon: 'none'
      })
    }
  },
  payway: function(e) {
    this.setData({
      payIndex: e.detail.value,
      payway: this.data.wayArray[e.detail.value]
    })
    console.log('当前选择:', this.data.wayArray[e.detail.value], '索引为:', this.data.payIndex)
  },
  paytime: function(e) {
    this.setData({
      paytime: e.detail.value
    })
  },
  // 获取客户类型
  clientKind: function(e) {
    console.log(e.detail.value);
    this.setData({
      clientkind: this.data.clientKind[e.detail.value],
      clientIndex: e.detail.value
    })
    console.log(this.data.clientkind)
  },
  // 付款凭证
  takeProof(e) {
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0,
      })
      wx.showLoading()
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url,
      })
      this.data.imgArray.push(this.data.imageUrl)
      this.setData({
        imgArray: this.data.imgArray
      })
      console.log(this.data.imgArray)
    }
  },
  onRemove(e) {
    console.log('删除照片之前:', this.data.imgArray)
    console.log('删除照片:', e.detail.file.url)
    // 把对应的url从数组中删除
    for (let i = 0; i < this.data.imgArray.length; i++) {
      if (this.data.imgArray[i] == e.detail.file.url) {
        this.data.imgArray.splice(i, 1)
      }
    }
    console.log('删除该照片后:', this.data.imgArray)
  },
  onComplete(e) {
    wx.hideLoading()
  },
  onPreview(e) {
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  // 分期款
  instalment(e) {
    if (e.detail) {
      this.setData({
        instalment: e.detail,
        total: parseFloat(e.detail).toFixed(2)
      })
    } else {
      this.setData({
        total: '0.00'
      })
    }
  },
  // 合同买受人
  buyer(e) {
    this.setData({
      buyer: e.detail
    })
  },
  // 实际付款人
  payer(e) {
    this.setData({
      payer: e.detail
    })
  },
  // 款项接收人
  receiver(e) {
    this.setData({
      receiver: e.detail
    })
  },
  // 备注
  remark(e) {
    this.setData({
      remark: e.detail
    })
  },
  // 新增用户 备注
  remark_new(e) {
    this.setData({
      remark_new: e.detail.detail.value
    })
  },
  // 提交
  submit() {
    // 1.判断是否有空的数据
    if (!this.data.payer || !this.data.receiver || !this.data.remark || !this.data.instalment) {
      wx.showToast({
        title: '请完善页面信息',
        icon: 'none'
      })
      return false;
    }
    // 2.判断是否上传凭证
    if (this.data.imgArray.length == 0) {
      wx.showToast({
        title: '请上传付款凭证',
        icon: 'none'
      })
      return false;
    }
    let adddata = {
      token: wx.getStorageSync('token'),
      action_in: 1, //操作类型(1.增加 2.修改 3.删除 4.审核);
      op_code: wx.getStorageSync('username'),
      bill_id: '', //付款记录id(action = 1，不用填；action = 2 / 3 / 4，必填);
      bill_drawee_name: this.data.buyer,
      customer_id: wx.getStorageSync('customer_id'),
      payment_type: this.data.payIndex,
      payment_name: this.data.payer,
      receive_name: this.data.receiver,
      payment_date: this.data.paytime,
      payment_remark: this.data.remark,
      payment_amount: this.data.instalment
    }
    // 1. 调用增加付款记录接口
    wx.request({
      url: getApp().data.baseUrl + 'updatePayMentInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: adddata,
      success: (res) => {
        if (res.data.errorcode == 0) {
          console.log('发送数据:', adddata)
          console.log('新增接口返回数据:', res)
          var bill_id = res.data.data[0].bill_id
          // 除了照片外的数据上传成功
          for (let i = 0; i < this.data.imgArray.length; i++) { // 对照片进行循环
            wx.uploadFile({
              url: app.data.baseUrl + 'uploadPhotos', // 仅为示例，非真实的接口地址
              filePath: this.data.imgArray[i],
              name: 'shphoto',
              formData: {
                location: this.data.latitude + ',' + this.data.longitude, // 纬度,经度
                table_id: bill_id,
                sOpCode: wx.getStorageSync('username'),
                table_name: 'T_Bill'
              },
              success: (res) => {
                console.log('照片数量:', this.data.imgArray.length)
                console.log('发送数据--location:', this.data.latitude, this.data.longitude, bill_id, wx.getStorageSync('username'))
                console.log('照片上传接口返回:', res)
                if (JSON.parse(res.data).errorcode == '10001') {
                  wx.showToast({
                    title: JSON.parse(res.data).errormsg,
                    duration: 2000
                  })
                  setTimeout(function() {
                    wx.showLoading({
                      title: '玩命加载中...',
                    })
                  }, 2200)
                  setTimeout(function() {
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }, 2500)
                }
              }
            })
          }
        }
      }
    })
  },
  // 获取简称
  shortName(e) {
    this.setData({
      shortName: e.detail
    })
  },
  // 获取全称
  fullName(e) {
    this.setData({
      fullName: e.detail
    })
  },
  // 获取类型 147行 clientIndex
  // 获取联系人
  relation_man(e) {
    this.setData({
      relation_man: e.detail
    })
  },
  relation_phone(e) {
    this.setData({
      relation_phone: e.detail,
      account: e.detail
    })
  },
  // 账号
  account(e) {
    this.setData({
      account: e.detail
    })
  },
  relation_add(e) {
    this.setData({
      relation_add: e.detail
    })
  },
  // 工程信息
  projectInfo(e) {
    this.setData({
      projectInfo: e.detail
    })
  },
  // 预览信息按钮
  previewMsg: function() {
    console.log(this.data.clientIndex)
    if (!this.data.shortName) {
      wx.showToast({
        title: '请输入客户简称',
        icon: 'none'
      })
      return false;
    } else if (!this.data.fullName) {
      wx.showToast({
        title: '请输入客户全称',
        icon: 'none'
      })
      return false;
    } else if (!this.data.relation_man) {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none'
      })
      return false;
    } else if (!this.data.relation_phone) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      return false;
    } else if (!this.data.relation_add) {
      wx.showToast({
        title: '请输入联系地址',
        icon: 'none'
      })
      return false;
    }
    // 校验手机号格式是否正确
    if (this.data.relation_phone) {
      if (!(/^1[34578]\d{9}$/.test(this.data.relation_phone))) {
        wx.showToast({
          title: '请输入正确的手机号码格式',
          icon: 'none'
        })
        return false;
      }
    }
    if (!this.data.projectInfo) {
      wx.showToast({
        title: '请输入工程信息',
        icon: 'none'
      })
      return false;
    }
    if (this.data.imgArray.length == 0) {
      wx.showToast({
        title: '请上传相关照片信息',
        icon: 'none'
      })
      return false;
    }
    // console.log(JSON.stringify(this.data.imgArray))
    wx.navigateTo({
      url: '../newly/previewClientMsg?shortName=' + this.data.shortName + '&fullName=' + this.data.fullName + '&clientkind=' + this.data.clientkind + '&clientIndex=' + this.data.clientIndex + '&relation_man=' + this.data.relation_man + '&relation_phone=' + this.data.relation_phone + '&relation_add=' + this.data.relation_add + '&remark=' + this.data.remark_new + '&imgArray=' + JSON.stringify(this.data.imgArray) + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&projectInfo=' + this.data.projectInfo + '&account=' + this.data.account,
    })
  }
})
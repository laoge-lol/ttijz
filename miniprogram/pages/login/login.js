// pages/login/login.js
// 登录页面
// 1.输入手机号
// 2.获取验证码
// 3.验证验证码
// 4.暂存手机号
var md5 = require('../utils/md5');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: "",
        pwd: "",
        pleaseInputPhone: "请输入手机号",
        pleaseInputCode: "请输入验证码",
        code: "验证码"
    },
    onLoad: function (option) {

    },
    // 手机号输入监听
    nameInput(e) {
        this.setData({
            name: e.detail.value
        })
    },

    pwdInput(e) {
        this.setData({
            pwd: e.detail.value
        })
    },

    loginTap() {
        let that = this;
        if (this.data.name.length == 0 || this.data.pwd.length == 0) {
            wx.showToast({
                icon: "none",
                title: '请输入账号密码',
            })
            return
        }
        wx.showLoading({
            title: '正在登录...',
        })
        wx.cloud.callFunction({
            name: "BK_login",
            data: {
                account: this.data.name,
                pwd: this.data.pwd
            },
            success: function (res) {
                if (res.result.code == 0) {
                    wx.setStorageSync('account', that.data.name);
                    if(that.data.pwd == "bk001"){
                        wx.setStorageSync('isNeedChangePwd', true)
                    }else{
                        wx.setStorageSync('isNeedChangePwd', false)
                    }
                    let pages = getCurrentPages();
                    console.log(pages);
                    let prePage = pages[pages.length - 2];
                    prePage.setData({
                        IndexNeedRefresh: true
                    })
                    wx.navigateBack({
                        complete: (res) => {},
                    })
                }
            },
            fail: function (err) {

            },
            complete: function () {
                wx.hideLoading({
                    complete: (res) => {},
                })
            }
        })
    },

    registerTap() {

    },

    forgetTap() {
        wx.showToast({
            icon: "none",
            title: '忘记了就去注册过一个吧！我也不能确定你就是你！！！',
        })
    },

    // 验证码输入监听
    pwdInput(e) {
        let that = this;
        // 当验证码输入的位数大于4位，且手机号输入的位数11位，开始云端验证验证码是否正确
        if (e.detail.value.length == 4 && this.data.name.length == 11) {
            // 弹出加载框
            wx.showLoading({})

        }
        // 缓存验证码
        this.setData({
            pwd: e.detail.value
        })
    },
    // 登录按钮
    login() {
        // 验证码按钮如果是在倒计时的时候，直接忽略点击事件
        if (this.data.code != "Code" && this.data.code != "验证码") {
            return;
        }
        // 判断手机号的位数够不够
        if (this.data.name.length < 11) {
            wx.showToast({
                icon: "none",
                title: '请输入手机号',
            })
            return;
        }
        let that = this;
        // 弹出加载框，开始发送请求，获取验证码
        wx.showLoading({})
        wx.cloud.callFunction({
            name: 'BK_smsLogin',
            // 请求参数，手机号码
            data: {
                phoneNum: that.data.name
            },
            success: function (res) {
                console.log(res);
                if (res.result.code == 0) {
                    that.setData({
                        order: res.result.order
                    })
                    let time = 59;
                    that.setData({
                        code: time + "s"
                    })
                    // 开启验证码倒计时
                    let interval = setInterval(() => {
                        // 判断倒计时是否结束
                        if (time >= 1) {
                            time--;
                            that.setData({
                                code: time + "s"
                            })
                        } else {
                            // 修改验证码按钮文本
                            that.setData({
                                code: '验证码'
                            })
                            // 清除倒计时计时器
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            },
            fail: function (err) {
                console.error(err);
            },
            complete: function () {
                // 隐藏加载框
                wx.hideLoading({
                    complete: (res) => {},
                })
            }
        })
    },

    closeTap() {
        wx.navigateBack({
            complete: (res) => {},
        })
    }

})
// miniprogram/pages/index/index.js

//获取应用实例
var DataUtil = require('../utils/DataUtil')
const app = getApp();
var pageNum = 0;
var pageSize = 20;
var total = 0;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        //获取全局变量 导航栏的高度statusBarHeight
        statusBarHeight: app.globalData.statusBarHeight,
        abc: "ddd",
        datas: {},
        IndexNeedRefresh: false,
        year: "",
        month: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var now = new Date();
        this.setData({
            year:  now.getFullYear(),
            month: now.getMonth()+1
        })
        if (wx.getStorageSync('account').length > 0) {
            if (wx.getStorageSync('isNeedChangePwd')) {
                wx.navigateTo({
                    url: '../changePwd/changePwd?account=' + wx.getStorageSync('account') + "&pwd=bk001",
                })
                return;
            }
            this.getTotalAmount();
            this.getBills();
        } else {
            wx.showModal({
                title: '提示',
                content: '是否创建新账号',
                cancelText: "去登录",
                confirmText: "是",
                success: function (res) {
                    if (res.confirm) {
                        wx.cloud.callFunction({
                            name: "BK_isNewUser",
                            success: function (res) {
                                if (res.result.code == 0) {
                                    if (res.result.isNew) {
                                        wx.setStorageSync('account', res.result.account);
                                        wx.navigateTo({
                                            url: '../newUser/newUser?account=' + res.result.account + "&pwd=" + res.result.pwd,
                                        })
                                    } else {
                                        wx.navigateTo({
                                            url: '../login/login',
                                        })
                                    }
                                }
                            },
                            fail: function (err) {

                            },
                            complete: function () {

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
    },

    mineTap() {
        if (wx.getStorageSync('account').length > 0) {
            wx.navigateTo({
                url: '../mine/mine',
            })
        } else {
            wx.navigateTo({
                url: '../login/login',
            })
        }
    },

    // 获取收入，支出，总收入
    getTotalAmount() {
        let that = this;
        let year = new Date().getFullYear();
        let month = new Date().getMonth()+1;
        wx.cloud.callFunction({
            name: "BK_getMonthCount",
            data: {
                phone: wx.getStorageSync('account'),
                year: year,
                month: month
            },
            success: function (res) {
                console.log(res);
                if(that.data.IndexNeedRefresh){
                    that.setData({
                        IndexNeedRefresh:false
                    })
                }
                that.setData({
                    inner: res.result.inner,
                    outer: res.result.outer,
                    total: res.result.total
                })
            }
        })
    },

    getBills() {
        wx.showLoading({
            title: '加载中...',
        })
        let that = this;
        console.log(app.globalData.statusBarHeight)
        console.log(this.data.statusBarHeight)
        wx.cloud.callFunction({
            name: "BK_getBills",
            data: {
                phone: wx.getStorageSync('account'),
                pageSize: pageSize,
                pageNum: pageNum
            },
            success: function (res) {
                total = res.result.total;
                let datas;
                if (pageNum == 0) {
                    datas = {};
                } else {
                    datas = that.data.datas;
                }
                for (let i = 0; i < res.result.data.length; i++) {
                    let item = res.result.data[i];
                    let date = new Date(item.createTime);
                    let time =( date.getMonth()+1) + "月" + date.getDate() + "日";
                    item = DataUtil.setDataIcon(item);
                    if (typeof datas[time] == "undefined") {
                        datas[time] = {}
                    }
                    if (typeof datas[time]['data'] == "undefined") {
                        datas[time]['data'] = []
                    }
                    datas[time]['data'].push(item);
                }
                for (let key in datas) {
                    let count = 0;
                    for (let i = 0; i < datas[key]['data'].length; i++) {
                        count += Number(datas[key]['data'][i].amount);
                    }
                    datas[key]['count'] = count;
                }
                that.setData({
                    datas
                })
                console.log(datas);
            },
            fail: function (err) {

            },
            complete: function () {
                wx.hideLoading({
                    complete: (res) => {},
                })
                wx.stopPullDownRefresh({
                    complete: (res) => {},
                })
            }
        })
    },

    dateTap() {
        //日期选择，跳转到查看月度账单的页面
        if (wx.getStorageSync('account').length <= 0) {
            wx.navigateTo({
              url: '../login/login',
            })
            return;
        }
        wx.navigateTo({
          url: '../monthBill/monthBill',
        })
    },

    itemTap(e) {
        console.log(e);
        let index = e.currentTarget.dataset.index;
        let time = new Date(this.data.datas[index].data[0].createTime);
        console.log(time);
        let year = time.getFullYear();
        let month = time.getMonth();
        let day = time.getDate();
        wx.navigateTo({
            url: '../detail/detail?year=' + year + "&month=" + month + "&day=" + day,
        })
    },

    add() {
        if (wx.getStorageSync('account').length <= 0) {
            wx.navigateTo({
              url: '../login/login',
            })
            return;
        }
        wx.navigateTo({
            url: '../add/add',
        })
        // }
    },

    getPhoneNumber(e) {
        console.log(e);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (wx.getStorageSync('isNeedChangePwd')) {
            wx.navigateTo({
                url: '../changePwd/changePwd?account=' + wx.getStorageSync('account') + "&pwd=bk001",
            })
            return;
        }
        if (this.data.IndexNeedRefresh) {
            wx.startPullDownRefresh({
                complete: (res) => {},
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getTotalAmount();
        pageNum = 0;
        this.getBills();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log(total);
        console.log((pageNum+1) * pageSize)
        console.log("onReachBottom");
        if ((pageNum+1) * pageSize < total) {
            pageNum++;
            this.getBills();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
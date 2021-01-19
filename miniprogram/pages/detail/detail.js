// pages/detail/detail.js
var DataUtil = require('../utils/DataUtil')
var app = getApp();
var year;
var month;
var day;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        deletes: [],
        inAmount: 0,
        outAmount: 0,
        totalAmount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        year = options.year;
        month = parseInt(options.month) + 1;
        day = parseInt(options.day);
        // year = 2020;
        // month = 11;
        // day = 19;
        this.getDatas();

    },

    getDatas() {
        let that = this;
        wx.showLoading({
            title: '加载中...',
        })
        wx.cloud.callFunction({
            name: "BK_getDayBills",
            data: {
                phone: wx.getStorageSync('account'),
                year,
                month,
                day
            },
            success: function (res) {
                console.log(res);
                let datas = [];
                let inAmount = 0;
                let outAmount = 0;
                let totalAmount = 0;
                for (let i = 0; i < res.result.data.length; i++) {
                    let item = res.result.data[i];
                    if (item.type == 0) {
                        outAmount = Number(item.amount) + outAmount;
                    } else {
                        inAmount = Number(item.amount) + inAmount;
                    }
                    // 标识是否被删除，0 否 1 是
                    item['delete'] = 0;
                    item = DataUtil.setDataIcon(item);
                    datas.push(item);
                }
                totalAmount = inAmount - outAmount;
                that.setData({
                    datas: res.result.data,
                    inAmount: inAmount.toFixed(2),
                    outAmount: outAmount.toFixed(2),
                    totalAmount: totalAmount.toFixed(2)
                })
            },
            fail: function (err) {

            },
            complete: function () {
                wx.hideLoading({
                    complete: (res) => {},
                });
                wx.stopPullDownRefresh({
                    complete: (res) => {},
                })
            }
        })
    },

    // 修改类型（支出还是收入）
    typeTap(e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.datas;
        datas[index].type = datas[index].type ? 0 : 1;
        this.setData({
            datas
        });
    },

    // 删除一条记录
    deleteTap(e) {
        let index = e.currentTarget.dataset.index;
        let deletes = this.data.deletes;
        let datas = this.data.datas;
        if (datas[index].delete) {
            for (let i = 0; i < deletes.length; i++) {
                if (deletes[i] == this.data.datas[index]._id) {
                    deletes.splice(i, 1);
                }
            }
        } else {
            deletes.push(this.data.datas[index]._id);
        }
        datas[index].delete = datas[index].delete ? 0 : 1;
        this.setData({
            deletes,
            datas
        })

    },

    // 修改备注
    markInput(e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.datas;
        datas[index].userMark = e.detail.value;
        this.setData({
            datas
        });
    },

    //修改金额
    amountInput(e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.datas;
        console.log(e.detail.value);
        console.log(datas[index].amount);
        // console.log(datas[index].amount.indexOf("."));
        if (datas[index].amount < e.detail.value) {
            if (datas[index].amount.toString().indexOf(".") != -1) {
                console.log(e.detail.value.length);
                console.log(e.detail.value[e.detail.value.length - 1])
                if (e.detail.value[e.detail.value.length - 1] == ".") {
                    datas[index].amount = e.detail.value.substring(0, e.detail.value.length - 1);
                } else {
                    let a = e.detail.value.split(".");
                    if (a[1].length > 2) {
                        datas[index].amount = Number(a[0]) + Number("0." + a[1].substring(0, 2));
                        wx.showToast({
                            icon: "none",
                            title: '最多保留小数点后两位',
                        })
                    } else {
                        datas[index].amount = e.detail.value;
                    }
                }
            } else {
                datas[index].amount = e.detail.value;
            }
        } else {
            datas[index].amount = e.detail.value;
        }
        // datas[index].amount = e.detail.value;
        this.setData({
            datas
        });
    },

    submit() {
        // 检查金额是否合法
        for (let i = 0; i < this.data.datas.length; i++) {
            let amount = this.data.datas[i].amount;
            if (amount <= 0) {
                wx.showToast({
                    icon: 'none',
                    title: '请输入第' + (i + 1) + "项的金额",
                })
                return;
            }
        }
        let that = this;
        wx.showLoading({
            title: '加载中...',
        })
        wx.cloud.callFunction({
            name: "BK_updateBills",
            data: {
                deletes: that.data.deletes,
                datas: that.data.datas
            },
            success: function (res) {
                console.log(res);
                if (res.result && res.result.msg.errCode == 87014) {
                    wx.showToast({
                        icon:"none",
                        title: '请勿输入敏感内容',
                    })
                    return;
                }
                that.getDatas();
                let pages = getCurrentPages();
                console.log(pages);
                let prePage = pages[pages.length - 2];
                prePage.setData({
                    IndexNeedRefresh: true
                })
                wx.navigateBack({
                    complete: (res) => {},
                })
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
    goback() {
        wx.navigateBack({
            complete: (res) => {},
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getDatas();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
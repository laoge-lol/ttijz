// pages/monthBill/monthBill.js
var DataUtil = require('../utils/DataUtil')
var app = getApp()
var pageNum = 0;
var pageSize = 20;
var total = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        date: "",
        year: "",
        month: "",
        nowDate:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var now = new Date();
        this.setData({
            date: now.getFullYear()+"-"+(now.getMonth()+1),
            year:  now.getFullYear(),
            month: now.getMonth()+1,
            nowDate:now.getFullYear()+"-"+(now.getMonth()+1)
        })
        this.getTotalAmount();
        this.getBills();
    },

    goback() {
        wx.navigateBack({
            complete: (res) => {},
        })
    },

    getTotalAmount() {
        let that = this;
        let year = this.data.year;
        let month = this.data.month;
        wx.cloud.callFunction({
            name: "BK_getMonthCount",
            data: {
                phone: wx.getStorageSync('account'),
                year: year,
                month: month
            },
            success: function (res) {
                console.log(res);
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
                pageNum: pageNum,
                time:this.data.year+"/"+this.data.month
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
                    let time = (date.getMonth()+1) + "月" + date.getDate() + "日";
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

    refreshData(){
        pageNum = 0;
        this.getTotalAmount();
        this.getBills();
    },

    bindDateChange(e) {
        console.log(e);
        this.setData({
            date: e.detail.value,
            year: e.detail.value.split("-")[0],
            month: e.detail.value.split("-")[1],
        })
        this.refreshData();
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
        this.refreshData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("onReachBottom");
        if ((pageNum+1)  * pageSize < total) {
            pageNum++;
            this.getBills();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
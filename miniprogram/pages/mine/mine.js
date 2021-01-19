// pages/mine/mine.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        account:"",
        gender:0,//1男 2女 0未知
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let gender = wx.getStorageSync('gender')?wx.getStorageSync('gender'):0;
        this.setData({
            account:wx.getStorageSync('account'),
            gender
        })
    },

    goback(){
        wx.navigateBack({
          complete: (res) => {},
        })
    },

    loginOut(){
        wx.setStorageSync('account', "");
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

    checkedFmale(){
        this.setData({
            gender:2
        })
        wx.setStorageSync('gender', 2)
    },
    checkedMale(){
        this.setData({
            gender:1
        })
        wx.setStorageSync('gender', 1)
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
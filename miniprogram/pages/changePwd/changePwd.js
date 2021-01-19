// pages/changePwd/changePwd.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        account: "",
        pwd: "",
        newpwd: "",
        comfirmpwd: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (typeof options.account == "undefined") {

        } else {
            this.setData({
                account: options.account,
                pwd: options.pwd,
            })
        }
    },

    accountInput(e) {
        this.setData({
            account: e.detail.value
        })
    },
    pwdInput(e) {
        this.setData({
            pwd: e.detail.value
        })
    },
    newpwdInput(e) {
        this.setData({
            newpwd: e.detail.value
        })
    },
    comfirmpwdInput(e) {
        this.setData({
            comfirmpwd: e.detail.value
        })
    },

    submit() {
        wx.showLoading({
          title: '请稍后...',
        })
        if(this.data.comfirmpwd != this.data.newpwd){
            wx.showToast({
                icon:"none",
              title: '新密码和确认密码不相同',
            })
            return;
        }
        if(this.data.pwd == this.data.newpwd){
            wx.showToast({
                icon:"none",
              title: '新密码和旧密码不能相同',
            })
            return;
        }
        wx.cloud.callFunction({
            name: "BK_changePwd",
            data: {
                account: this.data.account,
                pwd: this.data.pwd,
                newpwd: this.data.newpwd
            },
            success:function(res){
                if(res.result.code == 0){
                    wx.setStorageSync('isNeedChangePwd', false)
                    wx.showToast({
                      title: '修改密码成功',
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                          complete: (res) => {},
                        })
                    }, 1000);
                }
            },
            fail:function(err){

            },
            complete:function(){
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
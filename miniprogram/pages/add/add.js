// miniprogram/pages/add/add.js
const app = getApp();
var afterIcons, afterNames;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        icons: ['../../images/hospital.png','../../images/food.png','../../images/barbecue.png','../../images/baby.png', '../../images/breakfast.png', '../../images/lunch.png', '../../images/dinner.png', '../../images/bus.png', '../../images/fruits.png', '../../images/clothes.png', '../../images/communication.png', '../../images/dayuse.png', '../../images/lottery.png', '../../images/other1.png', '../../images/pets.png', '../../images/rent.png', '../../images/snacks.png', '../../images/study.png', '../../images/travel.png', '../../images/wages.png', '../../images/express.png', '../../images/other2.png', '../../images/other3.png', ],
        names: ['医院','买菜','夜宵','娃娃', '早餐', '午餐', '晚餐', '交通', '水果', '衣服', '通讯', '日用', '彩票', '其他', '宠物', '房租', '零食', '学习', '旅游', '工资', '快递', '其他@', '其他&', ],
        inputs: [],
        inputMarks: [],
        inputAmounts: [],
        types: [],
        date: "",
        year: "",
        month: "",
        day: "",
        nowDate: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(wx.getStorageSync('icons').length);
        console.log(this.data.icons.length);
        // 本地有缓存，且本地缓存的数据长度和变量的长度相同（因为变量长度会因为后面版本更新，增加账单类型而变长），才以本地缓存的数据展示到页面
        if (wx.getStorageSync('icons').length > 0 && wx.getStorageSync('icons').length == this.data.icons.length) {
            console.log("使用缓存的类型数组"); 
            var icons = wx.getStorageSync('icons');
            var names = wx.getStorageSync('names');
            this.setData({
                icons,
                names
            })
        }
        var now = new Date();
        this.setData({
            date: now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate(),
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            nowDate: now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate()
        })
    },

    bindDateChange(e) {
        console.log(e);
        this.setData({
            date: e.detail.value,
            year: e.detail.value.split("-")[0],
            month: e.detail.value.split("-")[1],
            day: e.detail.value.split("-")[2]
        })
    },

    prevTap() {
        var reg = new RegExp('-', "g")
        let date = this.data.date.replace(reg, "/");
        console.log(date);
        let beforeDate = new Date(date);
        console.log(beforeDate);
        beforeDate.setDate(beforeDate.getDate() - 1);
        console.log(beforeDate);
        this.setData({
            date: beforeDate.getFullYear() + "/" + (beforeDate.getMonth() + 1) + "/" + beforeDate.getDate(),
            year: beforeDate.getFullYear(),
            month: beforeDate.getMonth() + 1,
            day: beforeDate.getDate(),
        })
    },

    nextTap() {
        var now = new Date();
        now.setDate(now.getDate());
        var reg = new RegExp('-', "g")
        let date = this.data.date.replace(reg, "/");
        let beforeDate = new Date(date);
        beforeDate.setDate(beforeDate.getDate() + 1);
        if (beforeDate.getTime() >= now.getTime()) {
            console.log("未来日期不可选择");
            return;
        }
        this.setData({
            date: beforeDate.getFullYear() + "/" + (beforeDate.getMonth() + 1) + "/" + beforeDate.getDate(),
            year: beforeDate.getFullYear(),
            month: beforeDate.getMonth() + 1,
            day: beforeDate.getDate(),
        })
    },

    iconTap(e) {
        let inputs = this.data.inputs;
        let inputMarks = this.data.inputMarks;
        let inputAmounts = this.data.inputAmounts;
        let types = this.data.types;
        if (inputs.length > 0) {
            for (let i = 0; i < inputs.length; i++) {
                console.log(typeof inputAmounts[i] == 'undefined');
                if (typeof inputAmounts[i] == "undefined" || inputAmounts[i] <= 0) {
                    wx.showToast({
                        icon: 'none',
                        title: '请输入第' + (i + 1) + "项的金额",
                    })
                    return;
                }
            }
        }
        let index = e.currentTarget.dataset.index;
        inputs.push(index);
        inputAmounts.push(0);
        inputMarks.push("");
        types.push(0);
        this.setData({
            inputs,
            inputAmounts,
            inputMarks,
            types
        });
        console.log(this.data.icons);
        // 这里进行两次的json格式化操作: 
        //因为不进行两次json格式化操作，那么对象的引用，引用的是对象的地址，引用对象值改变会改变原对象的值。
        //两次json格式化操作之后就是值引用，改变引用对象的值不会改变原对象值。
        var icons = JSON.parse(JSON.stringify(this.data.icons));
        console.log(icons);
        var names = JSON.parse(JSON.stringify(this.data.names));
        var clickItemName = names[index];
        names.splice(index, 1);
        names.splice(0, 0, clickItemName);
        var clickItemIcon = icons[index];
        icons.splice(index, 1);
        icons.splice(0, 0, clickItemIcon);
        wx.setStorageSync('icons', icons);
        wx.setStorageSync('names', names);
    },

    markInput(e) {
        let index = e.currentTarget.dataset.index;
        let value = e.detail.value
        console.log(e);
        let inputMarks = this.data.inputMarks;
        inputMarks.splice(index, 1, value);
        this.setData({
            inputMarks
        })
    },

    amountInput(e) {
        let index = e.currentTarget.dataset.index;
        let value = e.detail.value
        console.log(e);
        let inputAmounts = this.data.inputAmounts;
        if (inputAmounts[index] < e.detail.value) {
            if (inputAmounts[index].toString().indexOf(".") != -1) {
                console.log(e.detail.value.length);
                console.log(e.detail.value[e.detail.value.length - 1])
                if (e.detail.value[e.detail.value.length - 1] == ".") {
                    value = e.detail.value.substring(0, e.detail.value.length - 1);
                } else {
                    let a = e.detail.value.split(".");
                    if (a[1].length > 2) {
                        value = Number(a[0]) + Number("0." + a[1].substring(0, 2));
                        wx.showToast({
                            icon: "none",
                            title: '最多保留小数点后两位',
                        })
                    } else {
                        value = e.detail.value;
                    }
                }
            } else {
                value = e.detail.value;
            }
        } else {
            value = e.detail.value;
        }
        inputAmounts.splice(index, 1, value);
        this.setData({
            inputAmounts
        })
        console.log(e);
    },

    typeTap(e) {
        let index = e.currentTarget.dataset.index;
        let types = this.data.types;
        let originValue = types[index];
        types.splice(index, 1, originValue == 0 ? 1 : 0);
        this.setData({
            types
        })
    },

    deleteTap(e) {
        let index = e.currentTarget.dataset.index;
        let inputs = this.data.inputs;
        inputs.splice(index, 1);
        let inputMarks = this.data.inputMarks;
        inputMarks.splice(index, 1);
        let inputAmounts = this.data.inputAmounts;
        inputAmounts.splice(index, 1);
        let types = this.data.types;
        types.splice(index, 1);
        this.setData({
            inputs,
            inputMarks,
            inputAmounts,
            types
        });
    },

    addBill() {
        let inputs = this.data.inputs;
        let inputAmounts = this.data.inputAmounts;
        if (inputs.length <= 0) {
            return;
        }
        wx.showLoading({
            title: '加载中...',
        })
        let data = [];
        for (let i = 0; i < inputs.length; i++) {
            if (typeof inputAmounts[i] == "undefined" || inputAmounts[i] <= 0) {
                wx.showToast({
                    icon: 'none',
                    title: '请输入第' + (i + 1) + "项的金额",
                })
                return;
            }
            let item = {
                phone: wx.getStorageSync('account'),
                // 如果日期不等于今天的日期，那么就是添加之前的账单记录，设置此账单的日期为选择日期的23:59:59；
                createTime: this.data.date == this.data.nowDate ? new Date().getTime() : new Date(this.data.date + " 23:59:59").getTime(),
                mark: this.data.names[this.data.inputs[i]],
                userMark: this.data.inputMarks[i],
                amount: this.data.inputAmounts[i],
                index: inputs[i],
                type: this.data.types[i]
            };
            data.push(item);
        }
        wx.cloud.callFunction({
            name: "BK_newBill",
            data: {
                data,
                gender:wx.getStorageSync('gender')
            },
            success: function (res) {
                if (res.result &&res.result.msg.errCode == 87014) {
                    wx.hideLoading({
                        complete: (res) => {},
                    })
                    wx.showToast({
                        icon:"none",
                        title: '请勿输入敏感内容',
                    })
                    return;
                }
                console.log(res);
                if (res.result.code == 0) {
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
                console.error(err);
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
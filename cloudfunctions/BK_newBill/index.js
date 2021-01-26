// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
/**
 * 创建新的账单记录
 * 
 *  phone:手机号
 *  createTime:创建时间
 *  mark:备注
 *  userMark:用户备注
 *  amount:金额
 *  index:下标（小程序中图标数组（icons,names）的下标，用来确定展示的图标和备注）
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    console.log(wxContext);
    try {
        console.log(event);
        let data = event.data;
        let gender = event.gender == 1 ? event.gender : 0;
        console.log(gender);
        let marks = '';
        for (let i = 0; i < data.length; i++) {
            marks += data[i].userMark;
        }
        console.log(marks);
         // 没有备注时不需要调用腾讯安全检查
        if (marks.length > 0) {
            var a = await cloud.openapi.security.msgSecCheck({
                content: marks
            })
        }
        for (let i = 0; i < data.length; i++) {
            let {
                phone,
                createTime,
                mark,
                userMark,
                amount,
                index,
                type
            } = data[i];
            let result = await db.collection("BK_bill").add({
                data: {
                    openid: wxContext.OPENID,
                    gender,
                    phone,
                    createTime,
                    mark,
                    userMark,
                    amount,
                    index,
                    type
                }
            })
            console.log(result);
        }
        return {
            code: 0,
            msg: "ok"
        }
    } catch (error) {
        return {
            code: 01,
            msg: error
        }
    }
}
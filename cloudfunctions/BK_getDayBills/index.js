// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const db = cloud.database();
    const _ = db.command;

    let {
        phone,
        year,
        month,
        day
    } = event;
    console.log(event);
    let temp = new Date(year+"/"+month+"/"+day+" 00:00:00");
    let start = temp.getTime();
    temp.setDate(temp.getDate()+1);
    start = start-8*60*60*1000;
    console.log(start);
    let end = new Date(temp.getTime()).getTime();
    end = end - 8*60*60*1000;
    console.log(end);
    let result = await db.collection("BK_bill").where({
        phone,
        delete:_.neq(true),
        createTime:_.lt(end).and(_.gt(start))
    }).get();
    return{
        start,
        end,
        data:result.data
    }
}
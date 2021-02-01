// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const _ = db.command;

    let {
        phone,
        pageSize,
        pageNum,
        time,// 格式2020/11
    } = event;
    const skip = pageSize * pageNum;
    if (typeof time != 'undefined' ) {
        let temp = new Date(time+"/1 00:00:00");
        let start = temp.getTime();
        start = start-8*60*60*1000;
        console.log(start);
        temp.setMonth(temp.getMonth()+1);
        let end = new Date(temp.getTime()).getTime();
        end = end-8*60*60*1000;
        let count = await db.collection("BK_bill").where({
            phone,
            createTime:_.lt(end).and(_.gt(start))
        }).count();
        console.log(count);
        let result = await db.collection("BK_bill").where({
                phone,
                delete:_.neq(true),
                createTime:_.lt(end).and(_.gt(start))
            }).skip(skip)
            .limit(pageSize)
            .orderBy("createTime", "desc")
            .get()
        console.log(result);
        return {
            total: count.total,
            data: result.data
        }
    } else {
        let count = await db.collection("BK_bill").where({
            phone
        }).count();
        console.log(count);
        let result = await db.collection("BK_bill").where({
                phone,
                delete:_.neq(true),
            }).skip(skip)
            .limit(pageSize)
            .orderBy("createTime", "desc")
            .get()
        console.log(result);
        return {
            total: count.total,
            data: result.data
        }
    }
}
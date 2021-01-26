// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const  _ = db.command;

   try {
    let {
        deletes,
        datas
    } = event;
    let marks = '';
    for (let i = 0; i < datas.length; i++) {
        marks += datas[i].userMark;
    }
    console.log(marks);
    // 没有备注时不需要调用腾讯安全检查
    if(marks.length>0){
    var a = await cloud.openapi.security.msgSecCheck({
        content: marks
    })
}
    console.log(a);
    let result = await db.collection("BK_bill").where({
        _id:_.in(deletes)
    }).update({
        data:{
            delete:true
        }
    });
   
    for(let i=0;i<datas.length;i++){
        let update = await db.collection("BK_bill").where({
            _id:datas[i]._id
        }).update({
            data:{
                changedOpenId:wxContext.OPENID,
                amount:datas[i].amount,
                createTime:datas[i].createTime,
                index:datas[i].index,
                mark:datas[i].mark,
                phone:datas[i].phone,
                type:datas[i].type,
                userMark:datas[i].userMark
            }
        })
    }
    return {
        msg:"ok"
    }
   } catch (error) {
       return{
           msg:error
       }
   }
}
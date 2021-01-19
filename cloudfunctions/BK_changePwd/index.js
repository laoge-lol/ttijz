// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const db = cloud.database()
    try {
        let {
            account,pwd,newpwd
        }  = event;
        let result  = await db.collection("BK_user").where({
            account,pwd
        }).get();
        if(result.data.length == 0){
            return{
                code:0,
                msg:"原密码错误"
            }
        }else{
            let updateResult = await db.collection("BK_user").where({
                account
            }).update({
                data:{
                    pwd:newpwd
                }
            })
            return{
                code:0,
                msg:"修改成功"
            }
        }
    } catch (error) {
        return {
            code:01,
            msg:error
        }
    }
}
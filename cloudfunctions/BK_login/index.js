// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    try {
        let {
            account,
            pwd
        } = event;
        let result = await db.collection("BK_user").where({
            account,pwd
        }).get();
        console.log(result.data.length);
        if(result.data.length != 0){
            return {
                code:0,
                msg:"success"
            }
        }else{
            return{
                code:01,
                msg:""
            }
        }
    } catch (error) {
        return{
            code:01,
            msg:error
        }
    }
}
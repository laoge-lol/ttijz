// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();

    try {
        // 查询此用户是否存在
        let result = await db.collection("BK_user").where({
            openId:wxContext.OPENID
        }).get();
        console.log(result);
        if(result.data.length == 0){
            // 如果不存在，则查找出最后注册的账号
            let selectResult = await db.collection("BK_user").orderBy("createTime","desc").skip(0).limit(1).get();  
            console.log(selectResult);
            let account ;
            if(selectResult.data.length == 0){
                //  目前没有用户
                account = "1";
            }else{
                // 有用户，在最后注册的用户的账号后面加1
                account = (parseInt(selectResult.data[0].account)+1)+"";
            }
            // 再次检查该账号是否已经注册
            let accountResult = await db.collection("BK_user").where({
                account
            }).get();
            if(accountResult.data.length == 0){
                // 没有注册就注册，并返回账号密码
                let addResult = await db.collection("BK_user").add({
                    data:{
                        openId:wxContext.OPENID,
                        createTime:new Date().getTime(),
                        account:account,
                        pwd:'bk001'
                    }
                })
                return {
                    code:0,
                    isNew:true,
                    account:account,
                    pwd:'bk001'
                }
            }
        }
        // 其他情况就是此用户已经注册过了
        return {
            code:0,
            isNew:false
        }
    } catch (error) {
        return {
            code:01,
            error
        }
    }

}
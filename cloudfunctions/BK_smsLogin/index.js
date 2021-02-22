// 云函数入口文件
const cloud = require('wx-server-sdk')
const Core = require('@alicloud/pop-core').RPCClient;
const crypto = require('crypto');
const _ = require('lodash');
cloud.init()



var client = new Core({
    accessKeyId,
    accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

// 保存手机号和验证码的对应关系
// phone_code_list = {'18855551234':['1024']}
var phone_code_list = {};
var phone = "17512047902";
// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database();
    console.log(event.phoneNum);
    if (event.phoneNum.length <= 0) {
        return {
            code: 01,
            msg: "手机号码不能为空"
        }
    }
    phone = event.phoneNum;
    // 检查是否频繁发送验证码
    // let smsCode = await db.collection("smsCode").orderBy("order", "desc").skip(0).limit(1).get();
    // console.log(smsCode.data[0].order-new Date().getTime());
    // if(smsCode.data.length>0&&new Date().getTime()-smsCode.data[0].order<=180000){
    //     return{
    //         code:02,
    //         msg:"三分钟后重试"
    //     }
    // }
    // 生成验证码
    var code = "" + _.random(1, 9) + _.random(9) + _.random(9) + _.random(9);
    return new Promise((resolve, reject) => {
        try {
            client.request('SendSms', {
                RegionId: "cn-hangzhou",
                PhoneNumbers: phone,
                SignName,
                TemplateCode,
                TemplateParam: "{code:" + code + "}"
            }, {
                method: 'POST',
                timeout: 3000,
            }).then( async (result) =>  {
                if (result.Message && result.Message == "OK" && result.Code && result.Code == "OK") { // 短信发送成功
                    // 保存验证码
                    if (phone_code_list[phone]) {
                        phone_code_list[phone].push(code);
                    } else {
                        phone_code_list[phone] = [code];
                    }
                    // result.self="11111111";
                    let order = new Date().getTime();
                    // 验证码单号,用单号和手机号验证验证码是否正确
                    result.order = order;
                    await db.collection("smsCode").add({
                        data:{
                            code: crypto.createHash('md5').update(code + "txzn").digest("hex"),
                            order,
                            phone
                        }
                    })
                    result.code = crypto.createHash('md5').update(code + "txzn").digest("hex");
                    result.msg = "验证码发送成功";
                    console.log('11111111111111')
                    resolve(result)
                } else {
                    // result.self="2222222";
                    result.code = 01;
                    result.msg = "验证码发送失败";
                    console.log('222222222222222')
                    reject(result)
                }
            }, (ex) => {
                // ex.self="3333333";
                ex.code = 01;
                ex.msg = "验证码发送失败";
                console.log('33333333333333')
                reject(ex)
            })
        } catch (error) {
            // error.self="44444444";
            error.code = 01;
            error.msg = "验证码发送失败";
            console.log('4444444444444')
            reject(error)
        }
    })
}
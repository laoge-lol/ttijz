// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// 获取某一个月的收入，支出，总收入
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    const  _ = db.command;

    let {year,month,phone} = event;
    let temp = new Date(year+"/"+month+"/1 00:00:00");
    let start = temp.getTime();
    start = start-8*60*60*1000;
    console.log(start);
    temp.setMonth(temp.getMonth()+1);
    let end = new Date(temp.getTime()).getTime();
    end = end-8*60*60*1000;
    console.log(end);
    let result = await db.collection("BK_bill").where({
        phone,
        delete:_.neq(true),
        createTime:_.lt(end).and(_.gt(start))
    }).get();
    console.log(result);
    var inner = 0;
    var outer = 0;
    for(let i = 0;i<result.data.length;i++){
        let item = result.data[i];
        console.log("amount:"+item.amount);
        if(item.type){
            // inner = Math.pow(10, Math.max(inner, item.amount));
            inner = inner +Number(item.amount);
            console.log("inner:"+inner);
        }else{
            // outer = Math.pow(10, Math.max(outer, item.amount));
            outer = outer + Number(item.amount);
            console.log("outer:"+outer);
        }
    }
    inner = inner.toFixed(2);
    outer = outer.toFixed(2);
    let total = inner - outer;
    total = total.toFixed(2);
    console.log(inner);
    console.log(outer);
    console.log(total);
   return{
       inner,outer,total
   }
}
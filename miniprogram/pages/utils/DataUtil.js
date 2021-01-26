function setDataIcon(item){
    // 数据封装工具类方法，根据mark的字符，添加对应的图标（icon）
    if (item.mark == "娃娃"|| item.mark == "小孩") {
        item['icon'] = "../../images/baby.png"
    } else if (item.mark == "早餐") {
        item['icon'] = "../../images/breakfast.png"
    }else if (item.mark == "医院") {
        item['icon'] = "../../images/hospital.png"
    } else if (item.mark == "公交"|| item.mark == "交通") {
        item['icon'] = "../../images/bus.png"
    } else if (item.mark == "买菜") {
        item['icon'] = "../../images/food.png"
    } else if (item.mark == "夜宵") {
        item['icon'] = "../../images/barbecue.png"
    } else if (item.mark == "衣服") {
        item['icon'] = "../../images/clothes.png"
    } else if (item.mark == "通讯") {
        item['icon'] = "../../images/communication.png"
    } else if (item.mark == "日用") {
        item['icon'] = "../../images/dayuse.png"
    } else if (item.mark == "晚餐") {
        item['icon'] = "../../images/dinner.png"
    } else if (item.mark == "快递") {
        item['icon'] = "../../images/express.png"
    } else if (item.mark == "彩票") {
        item['icon'] = "../../images/lottery.png"
    } else if (item.mark == "其他") {
        item['icon'] = "../../images/other1.png"
    } else if (item.mark == "其他@") {
        item['icon'] = "../../images/other2.png"
    } else if (item.mark == "其他&") {
        item['icon'] = "../../images/other3.png"
    } else if (item.mark == "宠物") {
        item['icon'] = "../../images/pets.png"
    } else if (item.mark == "房租") {
        item['icon'] = "../../images/rent.png"
    } else if (item.mark == "零食") {
        item['icon'] = "../../images/snacks.png"
    } else if (item.mark == "学习") {
        item['icon'] = "../../images/study.png"
    } else if (item.mark == "旅游") {
        item['icon'] = "../../images/travel.png"
    } else if (item.mark == "工资") {
        item['icon'] = "../../images/wages.png"
    } else if (item.mark == "午餐") {
        item['icon'] = "../../images/lunch.png"
    }  else if (item.mark == "水果") {
        item['icon'] = "../../images/fruits.png"
    } else {
        item['icon'] = "../../images/other1.png"
    }
    return item;
}

  module.exports = {
    setDataIcon
  }
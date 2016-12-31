/**
 * describe: redis任务发布给tcp服务
 * data:     16.12.27
 * author:   zhuxiankang
 * parm:     socket
 */
const cmd_con = require('../constants/cmd.constant')
    , redis_con = require('../constants/redis.constant');

module.exports = (data) => {
    //注意data需要转化为字符串发送
    try {
        redis_pub.publish(redis_con.doorList_send,JSON.stringify(data));   //发布订阅不能使用同一个redis对象
        //Redis中的订阅发布模式, 当没有订阅者时, 消息会被直接丢弃(Redis不会持久化保存消息)
    } catch(e) {
        console.log("redis error",e);
    }


};


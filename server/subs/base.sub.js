/**
 * describe: redis订阅信息通过socket.io发送
 * data:     16.11.07
 * author:   zhuxiankang
 * parm:     none
 */
const event = require('../events')
    , redis_con = require('../constants/redis.constant');

module.exports = function(msg) {
    event.emit(redis_con.index,msg);    //发送事件让socket.io监听
};


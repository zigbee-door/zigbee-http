
/**
 * describe: index页面的socket长连接服务
 * data:     16.11.01
 * author:   zhuxiankang
 * parm:     socket
 */
const event = require('../events')
    , redis_con = require('../constants/redis.constant')
    , socket_con = require('../constants/socket.constant');




module.exports = (socket) => {
    //接收来自redis订阅的基站连接状态数据 - base.sub.js
    event.on(redis_con.base_status, (msg) => {
        // console.log(msg);
        socket.emit(socket_con.index,msg);
    });
};


/**
 * describe: index页面的socket长连接服务
 * data:     16.11.01
 * author:   zhuxiankang
 * parm:     socket
 */
const event = require('../events')
    , channel = require('../constants/redis.constant');




module.exports = (socket) => {
    //接收来自redis订阅的基站连接状态数据 - base.sub.js
    event.on(channel.base_status, (msg) => {
        // console.log(msg);
        socket.emit(channel.base_status,msg);
    });
};

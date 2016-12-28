
/**
 * describe: index页面的socket长连接服务
 * data:     16.11.01
 * author:   zhuxiankang
 * parm:     socket
 */
const redis_con = require('../constants/redis.constant')
    , socket_con = require('../constants/socket.constant');


module.exports = {
    //接收来自redis订阅的基站连接状态数据 - base.sub.js
    // event.on(redis_con.index, (socket_data) => {
    //     // console.log(msg);
    //     socket.emit(socket_con.index,socket_data);
    // });

    /*接收来自于tcp服务器redis数据，通过socket发送给网页客户端*/
    socketSendToHttpClient(socket_data) {
        global.index_socket.emit(socket_con.index,socket_data); //这里的socket使用了全局变量
    }


};

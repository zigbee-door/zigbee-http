/**
 * describe: redis订阅tcp进程消息
 * data:     16.11.06
 * author:   zhuxiankang
 * parm:     none
 */

const redis_con = require('../constants/redis.constant')
    , socket_index = require('../sockets/index.socket')
    , socket_doorList = require('../sockets/doorList.socket');


module.exports = function() {

    //订阅
    redis_sub.subscribe(redis_con.index);               //订阅基站连接状态返回数据频道
    redis_sub.subscribe(redis_con.doorList_receive);    //订阅doorList返回数据频道

    //接收
    redis_sub.on('message', (channel,redis_data) => {
        switch(channel) {
            //tcp -> http: 基站状态列表数据返回
            case redis_con.index:
                //require('./base.sub')(redis_data);
                socket_index.socketSendToHttpClient(redis_data);
                break;

            //tcp -> http: 获取关联列表命令数据返回
            case redis_con.doorList_receive:
                //console.log("接收到tcp的数据帧:",redis_data);
                //require('./doorList.sub')(redis_data);
                socket_doorList.socketSendToHttpClient(redis_data);
                break;

            default:
                break;
        }
    });



};



/**
 * describe: redis订阅tcp进程消息
 * data:     16.11.06
 * author:   zhuxiankang
 * parm:     none
 */

const redis_con = require('../constants/redis.constant');


module.exports = function() {

    //订阅
    redis_sub.subscribe(redis_con.index);   //订阅基站连接状态频道

    //接收
    redis_sub.on('message', (channel,msg) => {
        switch(channel) {
            case redis_con.index:
                require('./base.sub')(msg);
                break;

            default:
                break;
        }
    });



};



/**
 * describe: redis订阅tcp进程消息
 * data:     16.11.06
 * author:   zhuxiankang
 * parm:     none
 */

const channel = require('../constants/redis.constant');


module.exports = function() {

    //订阅
    redis.subscribe(channel.base_status);   //订阅基站连接状态频道

    //接收
    redis.on('message', (channel,msg) => {
        switch(channel) {
            case 'base_status':             //这里暂时使用魔法字符串,异步channel.base_status = undefined何解?
                require('./base.sub')(msg);
                break;

            default:
                break;
        }
    });



};



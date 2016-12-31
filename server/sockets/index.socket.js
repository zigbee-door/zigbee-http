
/**
 * describe: index页面的socket长连接服务
 * data:     16.11.01
 * author:   zhuxiankang
 * parm:     socket
 */
const redis_con = require('../constants/redis.constant')
    , socket_con = require('../constants/socket.constant')
    , moment = require('moment')
    , co = require('co')
    , mongo_con = require('../constants/mongo.constant')
    , mongoose = require('mongoose');


module.exports = {
    //接收来自redis订阅的基站连接状态数据 - base.sub.js
    // event.on(redis_con.index, (socket_data) => {
    //     // console.log(msg);
    //     socket.emit(socket_con.index,socket_data);
    // });

    //这里会报错，因为没有打开网页，基站的信息并不能主动推送到网页上！！！！

    /*接收来自于tcp服务器redis数据，通过socket发送给网页客户端*/
    socketSendToHttpClient(socket_data) {

        let Base = mongoose.model(mongo_con.Base);
        let base = JSON.parse(socket_data);

        base.time = String(moment().format('YYYY-MM-DD HH:mm:ss'));


        //这里手动填充一下
        switch(base.ip) {
            case '10.8.208.222':
                base.panId = '0xFFF1';
                break;
            case '10.8.208.111':
                base.panId = '0xFFF2';
                break;
        }

        //数据库存储
        co(function* () {                           //mongo数据库存储,此时消耗性能没关系
            let result = yield Base.findOne({ip:base.ip});

            if(result) {    //更新数据
                result.status = base.status;
                result.time = base.time;
                yield result.save();
            } else {
                yield Base.create(base);
            }
        });



        //如果网页已经打开,socket已经建立连接则主动推送
        if(global.index_socket) {
            global.index_socket.emit(socket_con.index,base); //这里的socket使用了全局变量
        }
    }


};

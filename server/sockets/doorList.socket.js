/**
 * describe: doorList页面的socket长连接服务
 * data:     16.12.27
 * author:   zhuxiankang
 * parm:     socket
 */
const socket_con = require('../constants/socket.constant')
    , co = require('co')
    , mongoose = require('mongoose')
    , mongo_con = require('../constants/mongo.constant')
    , httpStatus = require('../constants/httpStatus.constant')
    , redis_con = require('../constants/redis.constant');

module.exports =  {

    /*接收来自于网页客户端的socket通信数据*/
    socketFromHttpClient(socket) {
        socket.on(socket_con.doorList,  (data) => {     //监听doorList页面的命令请求

            let Base = mongoose.model(mongo_con.Base);

            /*判断基站是否存活*/
            co(function *(){
                //console.log(data.baseIP);
                let base = yield Base.findOne({ip:data.baseIP});

                //基站存活
                if(base && base.status === '连接') {
                    require('../pubs/doorList.pub')(data);
                    //socket.emit(socket_con.doorList, {status:httpStatus.fail});
                    //基站不存活或者基站不存在
                } else {
                    socket.emit(socket_con.doorList, {status:httpStatus.fail});
                }
            });
        });
    },

    /*接收来自于tcp服务器redis数据，通过socket发送给网页客户端*/
    socketSendToHttpClient(socket_data) {
        let data = JSON.parse(socket_data);
        data.status = httpStatus.success;
        doorList_socket.emit(socket_con.doorList,data);
    }

};


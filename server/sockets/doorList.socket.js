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
    , redis_con = require('../constants/redis.constant')
    , cmd_con =require('../constants/cmd.constant')
    , moment = require('moment');

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

    /*接收来自于tcp服务器redis数据，通过socket告诉网页客户端可以来显示数据*/
    socketSendToHttpClient(socket_data) {
        let data = JSON.parse(socket_data);
        let Base = mongoose.model(mongo_con.Base);
        let door_list = [];

        data.status = httpStatus.success;

        switch(data.cmd) {
            case cmd_con.get_door_list:

                co(function *() {
                    let base = yield Base.findOne({ip:data.baseIP});

                    if(base) {
                        for(let i=0,len=data.data.length/2; i<len; i++) {
                            // base.door_list[i] = {
                            //     shortAddr: data.data[i] | (data.data[i+1] << 8)
                            // }
                            door_list[i] = {
                                shortAddr: data.data[2*i] | (data.data[2*i + 1] << 8)
                            }
                        }
                    }
                    base.door_list = door_list;     //door_list是一个数组
                    base.time = String(moment().format('YYYY-MM-DD HH:mm:ss'));
                    yield base.save();              //数据库存储
                    doorList_socket.emit(socket_con.doorList,data);     //存储完毕以后在发送信息到客户端

                });

                break;


            default:
                break;
        }

    }

};


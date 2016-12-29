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
        let door_list = []; //如果没有关联列表，则删除所有关于door的信息，包括房间号、MAC地址和网络短地址

        data.status = httpStatus.success;


        switch(data.cmd) {
            case cmd_con.get_door_list:

                co(function *() {
                    let base = yield Base.findOne({ip:data.baseIP});

                    if(base) {
                        let currentList = base.door_list,
                            infoTime = String(moment().format('YYYY-MM-DD HH:mm:ss'));


                        // /*1.遍历数据库中的门锁*/
                        // for(let j=0,len=currentList.length;j<len;j++) {
                        //
                        //     /*1.1 遍历上传的门锁数据*/
                        //     for(let i=0,len=data.data.length/10; i<len; i++) {
                        //
                        //         let shorAddr = data.data[10*i] | (data.data[10*i + 1] << 8),
                        //             macAddr = data.data.slice(10*i+2,10*(i+1));
                        //
                        //
                        //
                        //
                        //
                        //
                        //
                        //     }
                        //
                        //
                        //
                        //
                        //
                        // }


                        //一把门锁的数据有10字节，所以除以10
                        for(let i=0,len=data.data.length/10; i<len; i++) {
                            // base.door_list[i] = {
                            //     shortAddr: data.data[i] | (data.data[i+1] << 8)
                            // }

                            //
                            let shorAddr = data.data[10*i] | (data.data[10*i + 1] << 8),
                                macAddr = data.data.slice(10*i+2,10*(i+1));

                            /*1.如果数据库中有门锁关联列表数据*/
                            if(currentList.length) {
                                /*1.1 查找MAC地址,因为网络地址可能变化*/
                                for(let j=0,len=currentList.length;j<len;j++) {
                                    /*1.1.1 判断MAC地址是否相等,如果数据库存在，则更新当前数据库中的数据*/
                                    if(currentList[j].macAddr.toString() === (macAddr.toString())) {
                                        door_list[i] = {
                                            shortAddr: shorAddr,
                                            macAddr: macAddr,   //不包含10,20等
                                            lqi: currentList[j].lqi,
                                            battery: currentList[j].battery,
                                            doorNum: currentList[j].doorNum,
                                            infoTime: infoTime
                                        };

                                        break;  //跳出循环,继续判断下一个
                                    }

                                    /*1.1.2 如果没有找到MAC地址，说明这个是新添加的门锁*/
                                    if(j == currentList.length-1) {

                                        door_list[i] = {
                                            shortAddr: shorAddr,
                                            macAddr: macAddr,   //不包含10,20等
                                            infoTime: infoTime
                                            //其他使用默认字段
                                        }
                                    }

                                }
                            }


                            /*2.如果数据库中没有门锁关联列表数据*/
                            else {

                                door_list[i] = {
                                    shortAddr: shorAddr,
                                    macAddr: macAddr,   //不包含10,20等
                                    infoTime: infoTime
                                    //其他使用默认字段
                                }
                            }



                        }
                    }

                    base.door_list = door_list;     //door_list是一个数组
                    yield base.save();              //数据库存储
                    doorList_socket.emit(socket_con.doorList,data);     //存储完毕以后在发送信息到客户端
                });

                break;

            case cmd_con.open_door:

                co(function *() {
                    let base = yield Base.findOne({ip: data.baseIP});

                    if (base) {
                        for(let i=0,len=base.door_list.length;i<len;i++) {

                            //如果门锁Id对应,则信号强度和电量百分比等
                            if(base.door_list[i].shortAddr === (data.doorId[0] | (data.doorId[1] << 8))) {
                                //lqi信号强度
                                base.door_list[i].lqi = data.data[0];
                                //电池电量百分比
                                base.door_list[i].battery = String(parseInt((data.data[1] | data.data[2] << 8) * 100 /8191)) + '%';
                                //时间
                                base.door_list[i].infoTime = String(moment().format('YYYY-MM-DD HH:mm:ss'));
                                //用于table立即显示时间
                                data.infoTime =base.door_list[i].infoTime;
                            }
                        }




                        yield base.save();
                        doorList_socket.emit(socket_con.doorList,data);     //存储完毕以后在发送信息到客户端
                    }
                });

                break;

            default:
                break;
        }
    }

};


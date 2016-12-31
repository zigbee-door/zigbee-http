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


    /**
     * describe: 接收来自于网页客户端的socket通信数据
     * data:     16.12.26
     * author:   zhuxiankang
     * parm:     socket ->　socket.io通信对象
     */
    socketFromHttpClient(socket) {
        socket.on(socket_con.doorList,  (socket_data) => {     //监听doorList页面的命令请求

            let Base = mongoose.model(mongo_con.Base);


            /*判断基站是否存活*/
            co(function *(){
                //console.log(data.baseIP);
                let base = yield Base.findOne({ip:socket_data.baseIP});

                //基站存活
                if(base && base.status === '连接') {
                    require('../pubs/doorList.pub')(socket_data);
                    //socket.emit(socket_con.doorList, {status:httpStatus.fail});
                    //基站不存活或者基站不存在
                } else {
                    socket_data.status = httpStatus.base_disconnect;
                    socket.emit(socket_con.doorList, socket_data);
                }
            });
        });
    },


    /**
     * describe: 接收来自于tcp服务器redis数据，通过socket告诉网页客户端可以来显示数据
     * data:     16.12.26
     * author:   zhuxiankang
     * parm:     socket ->　socket.io通信对象
     */
    socketSendToHttpClient(socket_data) {
        let data = JSON.parse(socket_data);
        let Base = mongoose.model(mongo_con.Base);
        //let door_list = []; //如果没有关联列表，则删除所有关于door的信息，包括房间号、MAC地址和网络短地址

        /*1.如果tcp服务的基站断开连接*/
        if((data.data[0] === 0x01) && (data.data[1] === 0xFF)) {
            baseDisconnect(data);
            data.status = httpStatus.base_disconnect;
            doorList_socket.emit(socket_con.doorList,data); //直接发送数据给客户端
        }

        /*2.如果tcp服务的基站连接*/
        else {

            data.status = httpStatus.success;
            switch(data.cmd) {
                /*获取门锁关联列表*/
                case cmd_con.get_door_list:
                    getDoorList(data);
                    break;

                /*远程开门*/
                case cmd_con.open_door:
                    openDoor(data);
                    break;

                default:
                    break;
            }
        }
    }

};



/**
 * describe: 基站断开连接
 * data:     16.12.31
 * author:   zhuxiankang
 * parm:     data -> 来自于tcp的redis数据
 */
function baseDisconnect(data) {
    let Base = mongoose.model(mongo_con.Base);
    co(function *() {
        let base = yield Base.findOne({ip: data.baseIP});

        if(base) {
            base.status = mongo_con.disconnect;
            base.time =  String(moment().format('YYYY-MM-DD HH:mm:ss'));
            base.save();
        }

    });
}



/**
 * describe: 获取门锁关联列表
 * data:     16.12.31
 * author:   zhuxiankang
 * parm:     data -> 来自于tcp的redis数据
 */

function getDoorList(data) {

    let Base = mongoose.model(mongo_con.Base);

    co(function *() {
        let base = yield Base.findOne({ip:data.baseIP});


        /*1.如果数据库中有基站数据*/
        if(base) {
            let currentList = base.door_list,                                   //当前基站的门锁列表
                infoTime = String(moment().format('YYYY-MM-DD HH:mm:ss'));      //当前时间

            /*1.1 如果有获取基站列表数据,则遍历循环*/
            for(let i=0,len=data.data.length/10; i<len; i++) {                  //一把门锁的数据有10字节，所以除以10，从基站获取

                let shorAddr = data.data[10*i] | (data.data[10*i + 1] << 8),    //门锁的网络地址,2字节
                    macAddr = data.data.slice(10*i+2,10*(i+1));                 //门锁的mac地址,8字节

                /*1.1.1 数据库中有门锁关联列表的信息*/
                if(currentList.length) {
                    /*1.1.1.1 匹配MAC地址,因为网络地址可能变化*/
                    for(let j=0,len=currentList.length;j<len;j++) {
                        /*1.1.1.1.1 判断MAC地址是否相等,如果数据库存在，则更新当前数据库中的数据*/
                        if(currentList[j].macAddr.toString() === (macAddr.toString())) {

                            base.door_list[i] = {                   //更新数据库中的当前这个列表信息
                                shortAddr: shorAddr,
                                macAddr: macAddr,
                                lqi: currentList[j].lqi,
                                battery: currentList[j].battery,
                                doorNum: currentList[j].doorNum,
                                infoTime: infoTime
                            };

                            break;                                  //跳出循环,继续判断下一个
                        }

                        /*1.1.1.1.2 如果没有找到MAC地址,说明这个是新添加的门锁*/
                        if(j == currentList.length-1) {

                            base.door_list[i] = {
                                shortAddr: shorAddr,
                                macAddr: macAddr,   //不包含10,20等
                                infoTime: infoTime
                                //其他使用默认字段
                            }
                        }

                    }
                }

                /*1.1.2 数据库中没有门锁关联列表的信息,可能是新添加的基站,则一条条新的门锁列表信息存入数据库*/
                else {
                    base.door_list[i] = {
                        shortAddr: shorAddr,
                        macAddr: macAddr,
                        infoTime: infoTime
                        //其他使用默认字段
                    }
                }
            }
        }


        /*2 如果有获取基站列表数据,更新数据库中当前基站的列表数据*/
        if(data.data.length) {
            yield base.save();

        /*3 基站列表数据为空，仍然保留之前数据库中的信息*/
        } else {

        }

        /*4 反馈命令给客户端，注意因为在co里面，所以这里等到了数据库存储操作完毕后才反馈*/
        doorList_socket.emit(socket_con.doorList,data);
    });
}



/**
 * describe: 远程快门
 * data:     16.12.31
 * author:   zhuxiankang
 * parm:     data -> 来自于tcp的redis数据
 */
function openDoor(data) {

    let Base = mongoose.model(mongo_con.Base);

    co(function *() {
        let base = yield Base.findOne({ip: data.baseIP});

        /*1.如果数据库中有基站数据和基站的门锁列表数据*/
        if (base && base.door_list) {

            for(let i=0,len=base.door_list.length;i<len;i++) {

                /*1.1 如果门锁Id对应,则信号强度和电量百分比等*/
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
}






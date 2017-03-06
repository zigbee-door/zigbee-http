
const co = require('co')
    , mongoose = require('mongoose')
    , mongo_con = require('../constants/mongo.constant');



module.exports = {
    /**
     * describe: 门锁列表页渲染
     * data:     16.12.26
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    renderDoorList(req,res,next) {
        let baseIpLists = [];
        let Base = mongoose.model(mongo_con.Base);

        co(function* () {
            let bases = yield Base.find({});
            if(bases) {
                for(let i=0,len=bases.length;i<len;i++) {
                    if(bases[i].status === '连接') {
                       baseIpLists.push(bases[i].ip);
                    }
                }
            }

            res.render('doorList', {
                username: req.session.username,
                usertype: req.session.usertype,
                baseIpLists: baseIpLists            //基站连接的设备才可以进行配置操作
            });
        });
    },


    /**
     * describe: 获取门锁关联列表
     * data:     16.12.26
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    getDoorAssociateList(req,res,next) {
        //console.log(req.params.ip);
        let arr = [];
        let macArr = [];
        let Base = mongoose.model(mongo_con.Base);

        co(function* () {
            let base = yield Base.findOne({ip:req.params.ip});
            if(base && base.door_list.length) {

                for(let i=0,len=base.door_list.length;i<len;i++) {

                    let currentList = base.door_list[i];

                    /*网络地址*/
                    let shortAddr = currentList.shortAddr.toString(16).toUpperCase();
                    shortAddr =  '0000'.substr(0,4-shortAddr.length) + shortAddr;    //十六进制前面没有的补上0

                    /*mac地址*/
                    let macAddr = '';

                    for(let j=0,len=currentList.macAddr.length;j<len;j++) {
                        macArr[j] =  currentList.macAddr[j].toString(16).toUpperCase();
                        macArr[j] = '00'.substr(0,2-macArr[j].length) + macArr[j];
                        macAddr += macArr[j];
                    }


                    // //开门后可以获取全部信息，可能没有开门获取电池、信号和MAC地址
                    // if(base.door_list[i].battery && base.door_list[i].lqi &&　base.door_list.macAddr) {
                    //     arr[i] = {
                    //         ip  : base.ip,
                    //         time: base.time,
                    //         shortAddr: shortAddr,
                    //         macAddr: macAddr,
                    //         lqi: base.door_list[i].lqi,
                    //         battery: base.door_list[i].battery,
                    //     };
                    // //第一次更新当前基站IP的门锁关联列表后获取网络地址和mac地址信息
                    // } else {
                    //     arr[i] = {
                    //         ip  : base.ip,
                    //         time: base.time,
                    //         shortAddr: shortAddr,
                    //         macAddr: macAddr
                    //     }
                    // }


                    arr[i] = {
                        //ip  : base.ip,
                        //注意，有些可能获取的是默认值，这很重要
                        infoTime: currentList.infoTime,
                        shortAddr: shortAddr,
                        macAddr: macAddr,
                        lqi: currentList.lqi,
                        battery: currentList.battery,
                        doorNum: currentList.doorNum
                    };


                }

                // //伪造数据
                // arr[0].doorNum = 503;
                // arr[0].operateResult = '正常';
                // arr[0].battery = '79%';
                //
                // arr[1].doorNum = 504;
                // arr[1].operateResult = '低电压';


                res.json(arr);

            } else {
                res.json([]);   //返回空数据
            }

        });
    },

    /**
     * describe: 设置门锁房间号
     * data:     16.12.29
     * author:   zhuxiankang
     * parm:     req,res,next
     */


};
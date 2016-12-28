
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
        let Base = mongoose.model(mongo_con.Base);

        co(function* () {
            let base = yield Base.findOne({ip:req.params.ip});
            if(base) {
                // console.log(base.door_list.length);
                for(let i=0,len=base.door_list.length;i<len;i++) {

                    let shortAddr = base.door_list[i].shortAddr.toString(16).toUpperCase();
                    shortAddr = '0x' + '0000'.substr(0,4-shortAddr.length) + shortAddr;    //十六进制前面没有的补上0


                    arr[i] = {
                        ip  : base.ip,
                        time: base.time,
                        location: base.location,
                        shortAddr: shortAddr,
                        doorNum: base.door_list[i].doorNum
                    }
                }

                res.json(arr);


            } else {
                res.json({});   //返回空数据
            }

        });

    }
};
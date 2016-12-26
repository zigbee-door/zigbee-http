
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

        let Base = mongoose.model(mongo_con.Base);
        let baseIpLists = [];

        co(function* () {
            let bases = yield Base.find({});
            if(bases) {
                for(let i=0,len=bases.length;i<len;i++) {
                    baseIpLists.push(bases[i].ip);
                }
            }

            res.render('doorList', {
                username: req.session.username,
                usertype: req.session.usertype,
                baseIpLists: baseIpLists
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

    }
};

const co = require('co')
    , mongoose = require('mongoose')
    , mongo_con = require('../constants/mongo.constant')
    , coRedis = require('co-redis')(redis_pub)
    , redis_con = require('../constants/redis.constant')
    , moment = require('moment')
    , httpStatus = require('../constants/httpStatus.constant');


module.exports = {
    /**
     * describe: 主页渲染
     * data:     16.11.03
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    renderIndex(req,res,next) {
        res.render('index', {
            username: req.session.username,
            usertype: req.session.usertype
        });
    },

    /**
     * describe: 获取基站列表(表格形式)
     * data:     16.11.07
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    baseTable(req,res,next) {
        let Base = mongoose.model(mongo_con.Base);

        co(function* () {

            let timetamp = yield coRedis.get(redis_con.timetamp);
            let bases = yield Base.find({});

            /*1.tcp进程挂了*/
            if(new Date().valueOf() - timetamp >= redis_con.timetampValue) {
                /*1.1 如果基站有数据*/
                if(bases && bases.length) {
                    for(let i=0,len=bases.length; i<len; i++) {
                        bases[i].status = mongo_con.disconnect;
                        bases[i].time = String(moment().format('YYYY-MM-DD HH:mm:ss'))
                        yield bases[i].save();
                    }
                    res.json(bases);
                /*1.2 如果基站无数据*/
                } else {
                    res.json([]);
                }
            /*2.tcp进程没挂*/
            } else {
                /*2.1 如果基站有数据*/
                if(bases && bases.length) {
                    res.json(bases);
                } else {
                    res.json({});
                }
            }
        });
    }
};
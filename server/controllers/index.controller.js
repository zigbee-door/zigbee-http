
const co = require('co')
    , mongoose = require('mongoose')
    , mongo_con = require('../constants/mongo.constant');


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
            let bases = yield Base.find({});
            if(bases) {
                res.json(bases);
            } else {
                res.json({});
            }
        });
    }
};
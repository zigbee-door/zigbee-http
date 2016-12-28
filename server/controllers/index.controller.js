
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
                // 发送示例
                // [
                //     {
                //         "_id":"584814806a3265043c184d07",
                //         "ip":"10.8.208.222",
                //         "__v":20,
                //         "door_list":
                //             [
                //                 {
                //                     "shortAddr":2904,
                //                     "_id":"58639b527420cc16e079b4bd"
                //                 },
                //                 {
                //                     "shortAddr":56075,
                //                     "_id":"58639b527420cc16e079b4bc"
                //                 }
                //             ],
                //         "time":"2016-12-28 18:54:53",
                //         "status":"连接","location":"广C504"
                //     },
                //     {
                //         "_id":"584814ccc979ce14d85f319e",
                //         "ip":"10.8.208.111",
                //         "__v":0,
                //         "door_list":[],
                //         "time":"2016-12-28 18:47:41",
                //         "status":"连接",
                //         "location":"广C504"
                //     }
                // ]

            } else {
                res.json({});
            }
        });
    }
};
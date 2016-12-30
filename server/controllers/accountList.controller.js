const mongo_con = require('../constants/mongo.constant')
    , httpStatus = require('../constants/httpStatus.constant')
    , mongoose = require('mongoose');



module.exports = {
    /**
     * describe: 账号列表页渲染
     * data:     16.12.30
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    renderAccountList(req,res,next) {
        res.render('accountList', {
            username: req.session.username,
            usertype: req.session.usertype
        });
    },

    /**
     * describe: 账号列表页table获取
     * data:     16.12.30
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    accountTable(req,res,next) {

        console.log(111);


    }

};




// const co = require('co')
//     , mongoose = require('mongoose')
//     , mongo_con = require('../constants/mongo.constant')
//     , coRedis = require('co-redis')(redis_pub)
//     , redis_con = require('../constants/redis.constant')
//     , moment = require('moment')
//     , httpStatus = require('../constants/httpStatus.constant');


module.exports = {
    /**
     * describe: 租户设置页渲染
     * data:     17.02.25
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    renderTenant(req,res,next) {
        res.render('tenant', {
            username: req.session.username,
            usertype: req.session.usertype
        });
    },


    renderTenantList(req,res,next) {
        let arr = [];
        arr[0] = {
            name: '张三',
            cardId: '13A5C60D4C6D8959',
            doorId:'504',
            startTime:'2016-12-25 15:21',
            endTime: '2017-01-25 15:21',
        };

        arr[1] = {
            name: '李四',
            cardId: '4C6D895977DA195E',
            doorId:'504',
            startTime:'2017-01-07 15:22',
            endTime: '2017-02-07 15:22',
        };

        res.json(arr);

    }


};
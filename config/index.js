/**
 * node:        index.js
 * data:        16.11.01
 * author:      zhuxiankang
 * describe:    配置初始化
 */

const config = require('./config')
    , mongoose = require('mongoose')
    , Redis = require('redis');


module.exports = () => {

    //连接mongodb
    mongoose.connect(config.mongodb['local'], (err) => {

        if(err){
            console.log(err);
            return;
        }

        //创建Model
        require('../server/models/user.model');
        require('../server/models/base.model');

        console.log(`Connect to ${process.env.NODE_ENV} mongodb success!`);
    });

    //连接redis,这里暂时给全局
    global.redis = Redis.createClient(config.redis[process.env.NODE_ENV]);

    if(redis) {
        console.log(`Connect to ${process.env.NODE_ENV} redis success!`)
    }

};



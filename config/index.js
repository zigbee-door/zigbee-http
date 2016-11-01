/**
 * node:        index.js
 * data:        16.11.01
 * author:      zhuxiankang
 * describe:    配置初始化
 */

const config = require('./config');
const mongoose = require('mongoose');

module.exports = function(){

    mongoose.connect(config.mongodb[process.env.NODE_ENV], (err) => {
        if(err){
            console.log(err);
            return;
        }

        //创建Model
        require('../server/models/user.model');
        console.log(`Connect to ${process.env.NODE_ENV} mongodb success!`);
    });
};



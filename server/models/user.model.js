let mongoose = require('mongoose');
const mongodb = require('../constants/mongodb.constant');
const common = require('../constants/common.constant');
const moment = require('moment'); //时间格式模块
const crypto = require('crypto');

//创建Schema
let UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true,
        unique:true,    //唯一索引
        index:true      //辅助索引,增加查询速度
    },
    password:{
        type:String,
        require:true,
        trim:true,
        set:function(password) {
            let md5 = crypto.createHash('md5');
            return md5.update(`${password}${common.salt}`,'utf8').digest('base64');
        }
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    createTime:{
        type:String,
        default: String(moment().format('YYYY-MM-DD HH:mm:ss'))
    }
});


//Model方法示例
/**
 * 根本_id查找唯一用户名
 * @param id
 * @param cb
 */
UserSchema.static.findById = (id,cb) => {
    this.findOne({_id:id}, (err,doc) => {
        cb(err,doc);
    });
};


//Entity方法示例
UserSchema.methods.print = () => {

};


//发布Model
let User = mongoose.model(mongodb.User,UserSchema);
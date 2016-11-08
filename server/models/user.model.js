const mongoose = require('mongoose')
    , mongo_con = require('../constants/mongo.constant')
    , common = require('../constants/common.constant')
    , moment = require('moment') //时间格式模块
    , crypto = require('crypto');

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
    usertype:{
        type:String,
        default:mongo_con.Oper,
        enum:[mongo_con.Admin,mongo_con.Oper]  //只能是操作员或者管理员
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
let User = mongoose.model(mongo_con.User,UserSchema);


//设置2个固定的管理员
let admin1 = new User({
    username:'admin1',
    usertype:mongo_con.Admin,
    password: '1111'
});

let admin2 = new User({
    username:'admin2',
    usertype:mongo_con.Admin,
    password: '1111'
});

User.findOne({username:'admin1'})
    .exec((err,user) => {
        if(!user){
            admin1.save(function(err){
                if(err){
                    //console.log('amdmin exist!');
            }});
        }
    });

User.findOne({username:'admin2'})
    .exec((err,user) => {
        if(!user){
            admin2.save(function(err){
                if(err){
                    //console.log('amdmin exist!');
                }});
        }
    });
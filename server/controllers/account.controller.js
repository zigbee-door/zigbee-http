const mongo_con = require('../constants/mongo.constant')
    , httpStatus = require('../constants/httpStatus.constant')
    , mongoose = require('mongoose');



module.exports = {
    /**
     * describe: 账号页渲染
     * data:     16.12.30
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    renderAccount(req,res,next) {
        res.render('account', {
            username: req.session.username,
            usertype: req.session.usertype
        });
    },

    /**
     * describe: 账号注册（只有管理员才可以注册）
     * data:     16.12.30
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    registerAccount(req,res,next){

        let User = mongoose.model(mongo_con.User);

        if(req.session.usertype === mongo_con.Admin){       //如果是管理员
            var user = new User(req.body);

            user.save(function(err){
                if(err){
                    res.json({status:httpStatus.fail});    //注册失败，用户名已经存在
                } else{
                    res.json({status:httpStatus.success});  //注册成功
                }
            });
        } else{
            res.json({status:httpStatus.user_authFail});         //非管理员账号权限不够
        }




    }
}

;
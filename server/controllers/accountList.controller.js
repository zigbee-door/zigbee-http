const mongo_con = require('../constants/mongo.constant')
    , httpStatus = require('../constants/httpStatus.constant')
    , mongoose = require('mongoose')
    , co = require('co')
    , common = require('../constants/common.constant')
    , crypto = require('crypto');



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

        let User = mongoose.model(mongo_con.User);

        co(function* () {
            let users = yield User.find({});
            if(users) {
                res.json(users);
            } else {
                res.json({});
            }
        });
    },

    /**
     * describe: 密码修改
     * data:     16.12.30
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    modifyAccount(req,res,next) {

        let User = mongoose.model(mongo_con.User);
        let query = req.body;
        let md5 = crypto.createHash('md5');

        co(function* () {
            let user = yield User.findOne({username:query.username});
            if(user) {
                if(user.password === md5.update(`${query.password}${common.salt}`,'utf8').digest('base64')) {
                    user.password = query.newPassword;
                    user.save();
                    res.json({status:httpStatus.success});
                } else {
                    res.json({status:httpStatus.password_err});
                }
            } else {
                res.json({status:httpStatus.mongo_err});
            }
        });
    },

    /**
     * describe: 账号删除
     * data:     16.12.30
     * author:   zhuxiankang
     * parm:     req,res,next
     */
    deleteAccount(req,res,next) {

        let query = req.body;
        let User = mongoose.model(mongo_con.User);
        let md5 = crypto.createHash('md5');

        //修改密码仍然先验证是否是当前管理员
        if((query.adminUsername === req.session.username) && req.session.usertype === mongo_con.Admin) {

            co(function* () {

                let user = yield User.findOne({username:query.adminUsername});
                if(user) {
                    if(user.password === md5.update(`${query.adminPassword}${common.salt}`,'utf8').digest('base64')) {

                        // res.json({status: httpStatus.success});
                        let delUser = yield User.findOne({username:query.deleteUserName});
                        if(delUser) {
                            delUser.remove();
                            res.json({status: httpStatus.success});
                        } else {
                            res.json({status:httpStatus.mongo_err});
                        }

                    } else {
                        res.json({status: httpStatus.password_err});
                    }
                } else {
                    res.json({status:httpStatus.mongo_err});
                }
            });

        } else {
            res.json({status:httpStatus.user_authFail});
        }
    }



};


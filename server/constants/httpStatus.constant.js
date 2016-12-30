/**
 * describe: http通信时的状态常量
 * data:     16.11.04
 * author:   zhuxiankang
 * parm:     none
 */


module.exports = {
    //common
    success:        'success',
    fail:           'fail'   ,
    mongo_err:       'mongo_err',

    //account.html account.controller.js accountList.controller.js
    user_authFail:  'user_authFail',    //非管理员账号权限不够
    user_exist:     'user_exist',        //用户已存在

    //accountList.html
    password_err:   'password_err'      //密码错误
};

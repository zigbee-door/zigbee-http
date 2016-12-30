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

    //account.html account.controller.js
    user_authFail:  'user_authFail',    //非管理员账号权限不够
    user_exist:     'user_exist'        //用户已存在
};

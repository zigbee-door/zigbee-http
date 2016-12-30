"use strict";

angular.module("webapp")
    .controller('accountListController',['$scope','$timeout','accountListService',accountListController]);


//accountList.html
var userType = {
    oper:"操作员",
    admin:"管理员"
};



function accountListController($scope,$timeout,accountListService){

    // ---------------------------doorListController函数局部变量-------------------------------//


    var httpStatus = {
        //common
        success:        'success',
        fail:           'fail',
        mongo_err:      'mongo_err',
        user_authFail:  'user_authFail',    //非管理员账号权限不够
        password_err:   'password_err'      //密码错误
    };

    var alertClass = {
        init: "alert alert-info" ,
        danger: "alert alert-danger",
        success:"alert alert-success"
    };

    var alertMsg = {
        modifyInit: "注意只能修改当前登录的用户密码!",
        mongo_err:"数据库出错,请重试！",
        password_err:"原密码错误,请重新尝试!",
        delete_password_err:"密码错误,请重新尝试!",
        networkErr: "网络错误,操作失败!",
        success:"操作成功!",
        deleteInit:"注意只有当前登录的管理员可以删除账号!",
        user_authFail:"权限错误!"
    };


    var $modifyBtn = $('#modifyBtn');
    var $deleteBtn = $('#deleteBtn');

    var $loginName = $('#loginName').text();         //nav.html导航栏上显示的登录用户名
    var $loginType = $('#loginType').text();         //nav.html导航栏上显示的登录用户类型

    var $table = $('#accountListTable');            //table

    //账号修改
    $scope.modifyForm = {};
    $scope.modifyAlertClass = alertClass.init;
    $scope.modifyAlertMsg = alertMsg.modifyInit;

    //账号删除
    $scope.deleteForm = {};
    $scope.deleteAlertClass = alertClass.init;
    $scope.deleteAlertMsg = alertMsg.deleteInit;






    // -------------------------------------angular事件---------------------------------------//
    /*账号修改提醒清除*/
    $scope.accountListModifyClear = function() {
        $scope.modifyAlertClass = alertClass.init;
        $scope.modifyAlertMsg = alertMsg.modifyInit;
    };

    /*账号修改*/
    $scope.accountListModify = function(){


        $scope.modifyForm.username  = $('#modifyUserName').val();

        accountListService.modifyAccount($scope.modifyForm).then(
            function(data) {
                if(data.status == httpStatus.success) {
                    $scope.modifyAlertClass = alertClass.success;
                    $scope.modifyAlertMsg = alertMsg.success;
                } else if(data.status = httpStatus.password_err) {
                    $scope.modifyAlertClass = alertClass.danger;
                    $scope.modifyAlertMsg = alertMsg.password_err;
                } else if(data.status = httpStatus.mongo_err) {
                    $scope.modifyAlertClass = alertClass.danger;
                    $scope.modifyAlertMsg = alertMsg.mongo_err;
                }

                $scope.modifyForm.password = "";
                $scope.modifyForm.newPassword = "";

            },
            function(err) {
                $scope.modifyAlertClass = alertClass.danger;
                $scope.modifyAlertMsg = alertMsg.networkErr;
                $scope.modifyForm.password = "";
                $scope.modifyForm.newPassword = "";
            }
         );
    };

    /*账号删除提醒清除*/
    $scope.accountListDeleteClear = function() {
        $scope.deleteAlertClass = alertClass.init;
        $scope.deleteAlertMsg = alertMsg.deleteInit;
    };

    /*账号删除*/
    $scope.accountListDelete = function(){

        $scope.deleteForm.deleteUserName  = $('#deleteUserName').text();
        $scope.deleteForm.adminUsername = $loginName;

        accountListService.deleteAccount($scope.deleteForm).then(
            function(data){
                if(data.status === httpStatus.success) {
                    $scope.deleteAlertClass = alertClass.success;
                    $scope.deleteAlertMsg = alertMsg.success;


                    //$table.bootstrapTable('remove',{field:})
                    var username = $.map($table.bootstrapTable('getSelections'), function (row) {
                        return row.username;
                    });

                    $table.bootstrapTable('remove', {
                        field: 'username',
                        values: username
                    });

                    $timeout(function(){
                        $('#accountDelete').modal('hide');
                    },200);

                } else if(data.status === httpStatus.password_err) {
                    $scope.deleteAlertClass = alertClass.danger;
                    $scope.deleteAlertMsg = alertMsg.delete_password_err;
                } else if(data.status === httpStatus.mongo_err) {
                    $scope.deleteAlertClass = alertClass.danger;
                    $scope.deleteAlertMsg = alertMsg.mongo_err;
                } else if(data.status === httpStatus.user_authFail) {
                    $scope.deleteAlertClass = alertClass.danger;
                    $scope.deleteAlertMsg = alertMsg.user_authFail;
                }


                $scope.deleteForm.adminPassword = "";


            },
            function(err) {
                $scope.deleteAlertClass = alertClass.danger;
                $scope.deleteAlertMsg = alertMsg.networkErr;
                $scope.deleteForm.adminPassword = "";
            }

        )



    };





    //----------------------------------bootstrap-table图标事件--------------------------------//

    /*密码修改事件，需要注意angular的控制器函数先执行，这个对象里$scope无效果*/
    window.modifyAccountEvents = {
        'click .edit': function (e, value, row, index) {
            var $msgClass = $('#modifyAlertMsgClass');


            $msgClass.removeClass();
            $msgClass.addClass("alert alert-info");
            $('#modifyAlertMsg').text("注意只能修改当前登录的用户密码!");

            $('#modifyPassword').val('');
            $('#modifyNewPassword').val('');
            $('#modifyUserName').val(row.username);

            //如果修改的用户和登录的用户不一致
            if($loginName !== row.username) {
                $modifyBtn.attr('disabled',"true");         //添加disabled属性
            } else {
                $modifyBtn.removeAttr('disabled',"true");   //否则移除属性
            }

            $('#accountModify').modal('show');
        }
    };

    /*账号删除事件*/
    window.deleteAccountEvents = {
        'click .edit': function (e, value, row, index) {
            var $msgClass = $('#deleteAlertMsgClass');

            $msgClass.removeClass();
            $msgClass.addClass("alert alert-info");
            $('#deleteAlertMsg').text("注意只有当前登录的管理员可以删除账号!");

            $('#deletePassword').val('');
            $('#deleteUserName').text(row.username);
            $('#deleteUserType').text(row.usertype);
            $('#deleteCreateTime').text(row.createTime);


            //如果不是管理员则无法删除账号
            if($loginType !== userType.admin) {
                $deleteBtn.attr('disabled',"true");         //添加disabled属性
            } else {
                //不能删除管理员账号
                if(row.usertype === userType.admin) {
                    $deleteBtn.attr('disabled',"true");         //添加disabled属性
                } else {
                    $deleteBtn.removeAttr('disabled',"true");   //否则移除属性
                }
            }

            $('#accountDelete').modal('show');
        }
    };







}




// -------------------------------------bootstrap-table样式--------------------------------------//

//密码修改图标样式
function modifyAccountFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="密码修改">',
        '<i class="fa fa-edit fa-fw fa-lg"></i>',
        '</a>'
    ].join('');
}

//账号删除图标样式
function deleteAccountFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="账号删除">',
        '<i class="fa fa-remove fa-fw fa-lg"></i>',
        '</a>'
    ].join('');
}



//表格条纹样式 需要在表格中添加data-row-style="doorListRowStyle" ,表格样式必须把所有的情况都列出来
function accountListRowStyle(row, index) {
    var classes = ['default','success', 'warning','danger'];

    if(row.usertype == userType.admin){
        return {
            classes: classes[1]
        };
    }
    else
    {
        return {
            classes: classes[9]
        };
    }
}

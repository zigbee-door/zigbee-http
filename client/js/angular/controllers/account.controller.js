"use strict";

angular.module("webapp")
    .controller('accountController',['$scope','accountService',accountController]);


//account.html


function accountController($scope,accountService){

    // ---------------------------doorListController函数局部变量-------------------------------//


    var httpStatus = {
        //common
        success:        'success',
        fail:           'fail',

        user_authFail:  'user_authFail'    //非管理员账号权限不够
    };

    var alertClass = {
      init: "alert alert-info" ,
      danger: "alert alert-danger",
      success:"alert alert-success"
    };

    var alertMsg = {
        init: "注册账号需谨慎!",
        networkErr: "网络错误,注册失败!",
        user_authFail: "当前登录用户不是管理员，没有注册权限，注册失败!"
    };


    //账号注册
    $scope.accountForm = {};
    $scope.accountAlertClass = alertClass.init;
    $scope.accountAlertMsg = alertMsg.init;

    // -------------------------------------angular事件---------------------------------------//
    /*账号注册-清空提醒事件*/
    $scope.accountClearAlert = function(){
        $scope.accountAlertClass =  alertClass.init;
        $scope.accountAlertMsg = alertMsg.init;
    };

    /*账号注册请求*/
    $scope.accountRegister = function(){

        accountService.register($scope.accountForm).then(
            function(data) {
                if(data.status == httpStatus.success) {
                    $scope.accountAlertClass = alertClass.success;
                    $scope.accountAlertMsg = '用户名'+$scope.accountForm.username+'注册成功!';
                    $scope.accountForm.username = '';
                } else if(data.status == httpStatus.fail) {
                    $scope.accountAlertClass = alertClass.danger;
                    $scope.accountAlertMsg = '用户名'+$scope.accountForm.username+'已存在，注册失败!';
                } else if(data.status == httpStatus.user_authFail) {    //非管理员账号权限不够
                    $scope.accountAlertClass = alertClass.danger;
                    $scope.accountAlertMsg = alertMsg.user_authFail;
                    $scope.accountForm.username = '';
                }

                $scope.accountForm.password = '';

            },
            function(err) {
                $scope.accountAlertClass = alertClass.danger;
                $scope.accountAlertMsg = alertMsg.networkErr;
                $scope.accountForm.password = '';
                $scope.accountForm.username = '';
            }

        )




    }









}
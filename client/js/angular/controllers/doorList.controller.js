"use strict";

angular.module("webapp")
    .controller('doorListController',['$scope','$timeout',doorListController]);

var httpStatus = {
    //common
    success:        'success',
    fail:           'fail'
};

function doorListController($scope,$timeout){

    var doorList = io.connect('http://localhost:3000/doorList');    //socket.io
    var $btn = $('#doorList_update');           //更新按钮
    var $table = $('#doorListTable');           //table

    $scope.updateDoorList = '更新当前基站IP的门锁关联列表';
    $scope.updateDoorListClass = "btn btn-warning";
    //$scope.disable = "true";      //可以点击按钮 ng-disable效果不行？
    $btn.attr('disabled',"true");       //添加disabled属性

    /*基站IP选择事件*/
    $scope.updateChange = function(baseIP) {
        // var $btn = $('#doorList_update');
        // $btn.removeClass();
        // $btn.addClass('btn btn-warning');
        // $btn.text('更新当前基站IP的门锁关联列表');
        // $btn.removeAttr("disabled");
        $scope.updateDoorList = '更新当前基站IP的门锁关联列表';
        $scope.updateDoorListClass = "btn btn-warning";
        //$scope.disable = "false";    //可以点击按钮
        $btn.removeAttr("disabled");    //移除disabled属性

        var url = '/doorList/' + baseIP;
        $table.bootstrapTable('refresh',{url:url});     //获取当前数据库的数据
    };



    /*门锁更新关联列表事件*/
    $scope.updateRequest = function() {
        $scope.updateDoorList = '正在更新门锁关联列表,请稍后...';
        $scope.updateDoorListClass = "btn btn-danger";
        $btn.attr('disabled',"true");           //添加disabled属性

        $timeout(function(){
            $scope.updateDoorList = '更新当前基站IP的门锁关联列表';
            $scope.updateDoorListClass = "btn btn-warning";
            $btn.removeAttr("disabled");        //移除disabled属性
        },5000);                                //5s后恢复状态或者自己回复数据后恢复状态

        //发送命令必须带cmd,data,doorId,baseIP四个属性
        doorList.emit('doorList', {
            baseIP: $('#selectBaseIP').val(),   //发送的目标基站
            cmd:    0x01,                       //获取门锁关联列表命令ID
            data:   [],                         //需要发送的数据无
            doorId: [0x00,0x00]                 //只是发送到基站的命令门锁Id设置为0x00,0x00
        });                                     //doorList是频道，频道和页面一样，发送更新基站的关联列表命令给http服务器

        doorList.on('doorList', function (data) {       //订阅来自http服务器的消息
            if(data.status === httpStatus.fail) {
                $btn.text('基站已经断开连接,请连接后尝试!');
            }
        })
    }


}
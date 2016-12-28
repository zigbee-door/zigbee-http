"use strict";

angular.module("webapp")
    .controller('doorListController',['$scope','$timeout',doorListController]);





function doorListController($scope,$timeout){
    var doorList = io.connect('http://localhost:3000/doorList');    //socket.io 全局变量是唯一的
    var $btn = $('#doorList_update');           //更新按钮
    var $table = $('#doorListTable');           //table

    var httpStatus = {
        //common
        success:        'success',
        fail:           'fail'
    };

    var cmd = {
        requestList: 0x01,           //获取门锁关联列表
        openDoor: 0x02               //远程开门
    };


    $scope.updateDoorList = '更新当前基站IP的门锁关联列表';
    $scope.updateDoorListClass = "btn btn-warning";
    //$scope.disable = "true";          //可以点击按钮 ng-disable效果不行？所以使用了JQuery代替
    $btn.attr('disabled',"true");       //添加disabled属性

    // $scope.doorOperTip = '门锁操作提示';
    // $scope.doorOperTipClass = "list-group-item list-group-item-success";



    // -------------------------------------socket.io----------------------------------------//
    //socket连接
    doorList.on('connect',function() {
        console.log('connect');
    });


    //socket接收数据
    doorList.on('doorList', function (data) {       //订阅来自http服务器的消息

        //操作成功
        if(data.status === httpStatus.success) {
            switch(data.cmd) {

                /*获取门锁关联列表*/
                case cmd.requestList:
                    if(data.data.length) {
                        $table.bootstrapTable('refresh',{url:'/doorList/getList/'+data.baseIP});     //获取当前数据库的数据
                        $btn.text('正在显示列表数据,请稍后...');

                    } else {
                        //$scope.updateDoorList = '当前基站IP的列表为空!';
                        //$scope.updateDoorListClass = "btn btn-success";
                        $btn.text('当前基站IP的列表为空!');
                    }

                    break;

                /*获取门锁开门命令反馈*/
                case cmd.openDoor:
                    break;


                default:
                    break;
            }
        }

        //操作失败
        else {
            switch(data.cmd) {
                /*获取门锁关联列表*/
                case cmd.requestList:
                    $btn.text('基站已经断开连接,请连接后尝试!');
                    break;
                default:
                    break;
            }



        }
    });

    //socket断开连接
    doorList.on('disconnect',function() {
        doorList.connect();
    });


    doorList.on('error', function(){
        doorList.connect();
    });



    // -------------------------------------angular事件---------------------------------------//

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

        $table.bootstrapTable('refresh',{url:'/doorList/getList/' + baseIP});     //获取当前数据库的数据
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
        },1000);                                //5s后恢复状态或者自己回复数据后恢复状态

        //发送命令必须带cmd,data,doorId,baseIP四个属性
        doorList.emit('doorList', {
            baseIP: $('#selectBaseIP').val(),   //发送的目标基站
            cmd:    cmd.requestList,            //获取门锁关联列表命令ID
            data:   [],                         //需要发送的数据无
            doorId: [0x00,0x00]                 //只是发送到基站的命令门锁Id设置为0x00,0x00
        });                                     //doorList是频道，频道和页面一样，发送更新基站的关联列表命令给http服务器
    };



    // -------------------------------------bootstrap-table图标事件---------------------------------------//
    window.accountEvents = {
        'click .edit': function (e, value, row, index) {
            var arr = [];
            arr[0] = parseInt(row.shortAddr.split('0x')[1],16) & 0xFF;          //将十六进制转化为十进制,获取低8位
            arr[1] = (parseInt(row.shortAddr.split('0x')[1],16) >> 8) & 0xFF;   //获取高8位

            //发送开门命令
            doorList.emit('doorList', {
                baseIP: row.ip,                     //发送的目标基站
                cmd:    cmd.openDoor,               //获取门锁关联列表命令ID
                data:   [],                         //需要发送的数据无
                doorId: arr                         //只是发送到基站的命令门锁Id设置为0x00,0x00
            });

            row.operateResult = '正在开门';

            $table.bootstrapTable('updateRow', {index: index, row: row});

            $timeout(function(){
                row.operateResult = '开门失败';
                $table.bootstrapTable('updateRow', {index: index, row: row});

                $timeout(function(){
                    row.operateResult = '-';
                    $table.bootstrapTable('updateRow', {index: index, row: row});
                },1000)

            },3000);



        },
        'click .remove': function (e, value, row, index) {
            // $(document).ready(function(){
            //     $('#d_msg').removeClass();
            //     $('#d_msg').addClass('alert alert-info');
            //     $('#d_msg_text').text('注销账号需谨慎!');
            //
            //
            //     $('#d_userPassword').val('');
            //     $('#d_userName').text(row.username);
            //     $('#d_userType').text(row.usertype);
            //     $('#d_createTime').text(row.createTime);
            //
            //     $('#delete').modal('show');
            //
            // });
            //alert(2);

            //$('#table').bootstrapTable('removeAll');
        }
    };
}



//表格图标样式
function accountFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="远程开门">',
        '<i class="fa fa-unlock-alt fa-fw fa-lg"></i>',
        '</a>',
        '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
        '<i class="fa fa-remove fa-fw fa-lg"></i>',
        '</a>'
    ].join('');
}

//表格条纹样式 需要在表格中添加data-row-style="doorListRowStyle"
function doorListRowStyle(row, index) {
    var classes = ['default','success', 'warning','danger'];

    if(row.operateResult === '正在开门'){
        return {
            classes: classes[2]
        };
    }

    else if(row.operateResult === '开门成功') {
        return {
            classes: classes[1]
        };
    }

    else if(row.operateResult === '开门失败') {
        return {
            classes: classes[3]
        };
    }

    else {
        return {
            classes: classes[0]
        };
    }
}



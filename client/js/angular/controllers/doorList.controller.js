"use strict";

angular.module("webapp")
    .controller('doorListController',['$scope','$timeout','doorListService',doorListController]);


// ---------------------doorList.html全局变量-----------------------------//

var openStatus = {
    openSuccess: '开门成功',
    opening: '正在开门',
    openFail: '开门失败',
    openNone: undefined          //无操作
};




function doorListController($scope,$timeout,doorListService){

    // ---------------------------doorListController函数局部变量-------------------------------//

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

    var btnTip = {
        init: '更新当前基站IP的门锁关联列表',
        initClass: 'btn btn-warning',
        listUpateing: '正在更新门锁关联列表,请稍后...',  //该状态是正在请求基站数据
        listUpateingClass: 'btn btn-danger',
        listShowing: '正在显示列表数据,请稍后...',
        baseListNull: '当前基站IP的列表为空!',
        baseError: '基站已经断开连接,请连接后尝试!'
    };


    $scope.updateDoorList = btnTip.init;
    $scope.updateDoorListClass = btnTip.initClass;
    //$scope.disable = "true";          //可以点击按钮 ng-disable效果不行？所以使用了JQuery代替
    $btn.attr('disabled',"true");       //添加disabled属性

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
                        $btn.text(btnTip.listShowing);

                    } else {
                        //$scope.updateDoorList = '当前基站IP的列表为空!';
                        //$scope.updateDoorListClass = "btn btn-success";
                        $btn.text(btnTip.baseListNull);
                    }

                    break;

                /*获取门锁开门命令反馈*/
                case cmd.openDoor:

                    //这里暂时给一个块级作用域
                    (function(){

                        var shortAddr = (data.doorId[0] | data.doorId[1] << 8).toString(16).toUpperCase();
                        var doorListData = $table.bootstrapTable('getData');
                        var index;
                        var row = {};

                        //查找位置
                        for(var i=0,len = doorListData.length; i<len; i++) {
                            if(doorListData[i].shortAddr === shortAddr) {
                                index = i;
                                break;
                            }
                        }

                        row.operateResult = openStatus.openSuccess;

                        $table.bootstrapTable('updateRow', {
                            index:index,
                            row: row
                        });


                    })();

                    break;

                default:
                    break;
            }
        }

        //操作失败
        else {
            $btn.text(btnTip.baseError);
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

    /*基站IP选择事件，http的GET获取表格json数据*/
    $scope.updateChange = function(baseIP) {
        // var $btn = $('#doorList_update');
        // $btn.removeClass();
        // $btn.addClass('btn btn-warning');
        // $btn.text('更新当前基站IP的门锁关联列表');
        // $btn.removeAttr("disabled");
        $scope.updateDoorList = btnTip.init;
        $scope.updateDoorListClass = btnTip.initClass;
        //$scope.disable = "false";    //可以点击按钮
        $btn.removeAttr("disabled");    //移除disabled属性

        $table.bootstrapTable('refresh',{url:'/doorList/getList/' + baseIP});     //获取当前数据库的数据
    };



    /*门锁更新关联列表事件,通过socket.io通信*/
    $scope.updateRequest = function() {
        $scope.updateDoorList = btnTip.listUpateing;
        $scope.updateDoorListClass = btnTip.listUpateingClass;
        $btn.attr('disabled',"true");           //添加disabled属性

        $timeout(function(){
            $scope.updateDoorList = btnTip.init;
            $scope.updateDoorListClass = btnTip.initClass;
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

    /*门锁更新关联列表事件，通过angular的ajax封装函数获取*/
    $scope.setDoorNum = function() {
        doorListService.setDoorNum();
    };



    // -------------------------------------bootstrap-table图标事件---------------------------------------//

    //开门按钮事件,通过socket.io通信
    window.openDoorOperEvents = {
        'click .edit': function (e, value, row, index) {
            //正在操作的时候不能继续开门操作，需要等动作结束
            if(row.operateResult === openStatus.openNone) {
                var arr = [];
                arr[0] = parseInt(row.shortAddr,16) & 0xFF;          //将十六进制转化为十进制,获取低8位
                arr[1] = (parseInt(row.shortAddr,16) >> 8) & 0xFF;   //获取高8位
                console.log(arr);

                //发送开门命令
                doorList.emit('doorList', {
                    baseIP: row.ip,                     //发送的目标基站
                    cmd:    cmd.openDoor,               //获取门锁关联列表命令ID
                    data:   [],                         //需要发送的数据无
                    doorId: arr                         //只是发送到基站的命令门锁Id设置为0x00,0x00
                });

                row.operateResult = openStatus.opening;

                $table.bootstrapTable('updateRow', {index: index, row: row});

                $timeout(function(){

                    var timeout = 1000;

                    if(row.operateResult !== openStatus.openSuccess) {
                        timeout = 3000;
                        row.operateResult = openStatus.openFail;
                        $table.bootstrapTable('updateRow', {index: index, row: row});
                    }

                    $timeout(function(){
                        row.operateResult = openStatus.openNone;
                        $table.bootstrapTable('updateRow', {index: index, row: row});
                    },timeout)

                },10000);
            }
        }
    };

    window.setDoorNumEvents = {
        'click .edit': function (e, value, row, index) {

            // $scope.doorList_baseIP = row.ip;
            // $scope.doorList_doorNum = row.doorNum;
            // $scope.doorList_shortAddr = row.shortAddr;
            $('#doorList_baseIP').text(row.ip);
            if(!row.doorNum) {
                $('#doorList_doorNum').text('无');
            } else {
                $('#doorList_doorNum').text(row.doorNum);
            }
            $('#doorList_shortAddr').text(row.shortAddr);

            $('#setDoorNum').modal('show');
        }
    };


}

// -------------------------------------bootstrap-table样式--------------------------------------//

//开门按钮图标样式
function openDoorOperFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="远程开门">',
        '<i class="fa fa-unlock-alt fa-fw fa-lg"></i>',
        '</a>'
    ].join('');
}

//表格图标样式
function setDoorNumFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="远程开门">',
        '<i class="fa fa-cog fa-fw fa-lg"></i>',
        '</a>'
    ].join('');
}



//表格条纹样式 需要在表格中添加data-row-style="doorListRowStyle"
function doorListRowStyle(row, index) {
    var classes = ['default','success', 'warning','danger'];

    if(row.operateResult === openStatus.opening){
        return {
            classes: classes[2]
        };
    }

    else if(row.operateResult === openStatus.openSuccess) {
        return {
            classes: classes[1]
        };
    }

    else if(row.operateResult === openStatus.openFail) {
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



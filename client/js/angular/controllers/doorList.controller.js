"use strict";

angular.module("webapp")
    .controller('doorListController',['$scope',doorListController]);


function doorListController($scope){

    var doorList = io.connect('http://localhost:3000/doorList');    //socket.io

    $scope.updateDoorList = '更新当前基站IP的门锁关联列表';
    $scope.updateDoorListClass = "btn btn-warning";

    $scope.updateRequest = function(target) {
        $scope.updateDoorList = '正在更新门锁关联列表,请稍后...';
        $scope.updateDoorListClass = "btn btn-danger";
        $('#doorList_update').attr('disabled',"true");       //添加disabled属性
        //$('#button').removeAttr("disabled"); 移除disabled属性

        doorList.emit('doorList_update', { msg: 'doorList_update' });  //发送更新基站的关联列表命令给http服务器

        doorList.on('doorList_update', function (data) {      //订阅来自http服务器的消息

        })


    }


}
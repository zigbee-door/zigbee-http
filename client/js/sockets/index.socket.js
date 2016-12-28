'use strict';

(function(){    //需要注意块级作用域,防止命名冲突
    var index = io.connect('http://localhost:3000/index');

    //socket连接
    index.on('connect',function() {
        console.log('connect');
    });

    index.on('index', function (data) {     //index频道，和页面一样

        var $table = $('#baseTable'),
            base = JSON.parse(data),
            data = $table.bootstrapTable('getData'),
            index = -1;

        //查找位置
        for(var i=0,len = data.length; i<len; i++) {
            if(data[i].ip === base.ip) {
                index = i;
                break;
            }
        }

        if(index !== -1) {  //基站已经存在
            $table.bootstrapTable('updateRow', {
                index:index,
                row: base
            });
        } else {            //新连接的基站
            $table.bootstrapTable('prepend', base);
        }

    });

    //socket断开连接
    index.on('disconnect',function() {
        index.connect();
    });


    index.on('error', function(){
        index.connect();
    });



})();

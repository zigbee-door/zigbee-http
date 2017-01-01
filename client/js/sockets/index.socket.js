'use strict';

(function(){    //需要注意块级作用域,防止命名冲突

    var httpStautus = {
        baseInfo_success: 'baseInfo_success',   //基站状态信息推送成功
        tcp_disconnect: 'tcp_disconnect'        //tcp进程挂了
    };



    var index = io.connect('http://localhost:3000/index');

    //socket连接
    index.on('connect',function() {
        console.log('connect');
    });

    index.on('index', function (data) {     //index频道，和页面一样

        switch (data.httpStatus) {

            /*基站数据获取成功*/
            case httpStautus.baseInfo_success:
                var $table = $('#baseTable'),
                    tableData = $table.bootstrapTable('getData'),
                    index = -1;

                //查找位置
                for(var i=0,len = tableData.length; i<len; i++) {
                    if(tableData[i].ip === data.ip) {
                        index = i;
                        break;
                    }
                }

                if(index !== -1) {  //基站已经存在
                    $table.bootstrapTable('updateRow', {
                        index:index,
                        row: data
                    });
                } else {            //新连接的基站
                    $table.bootstrapTable('prepend', data);
                }

                break;

            /*通讯进程挂了*/
            case httpStautus.tcp_disconnect:
                console.log('111');
                break;

            default:
                break;




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

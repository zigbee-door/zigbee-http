
/**
 * describe: Socket连接
 * data:     16.11.01
 * author:   zhuxiankang
 * parm:     io
 */

const socket_doorList = require('./doorList.socket');


module.exports = (io) => {
    //index.html
    io.of('/index').on('connection',(socket) => {
        global.index_socket = socket;   //先设置全局
        //global.index_socket.emit(socket_con.index,socket_data); //这里的socket使用了全局变量
        //TypeError: Cannot read property 'emit' of undefined
        //经常出现这个错误
    });

    //doorList.html
    io.of('/doorList').on('connection',(socket) => {
        global.doorList_socket = socket;       //这里老是报错，注意一下
        socket_doorList.socketFromHttpClient(socket);
        //socket_doorList.socketFromHttpClient(socket);
    });
};





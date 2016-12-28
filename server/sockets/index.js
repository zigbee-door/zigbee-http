
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
        //require('./index.socket.js')(socket);
    });

    //doorList.html
    io.of('/doorList').on('connection',(socket) => {
        global.doorList_socket = socket;
        socket_doorList.socketFromHttpClient(socket);
        //socket_doorList.socketFromHttpClient(socket);
    });
};





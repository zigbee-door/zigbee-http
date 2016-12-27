
/**
 * describe: Socket连接
 * data:     16.11.01
 * author:   zhuxiankang
 * parm:     io
 */

module.exports = (io) => {
    //index.html
    io.of('/index').on('connection',(socket) => {
        require('./index.socket.js')(socket);
    });

    //doorList.html
    io.of('/doorList').on('connection',(socket) => {
        require('./doorList.socket.js')(socket);
    });
};





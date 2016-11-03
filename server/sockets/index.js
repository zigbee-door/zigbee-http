
/**
 * describe: Socket连接
 * data:     16.11.01
 * author:   zhuxiankang
 * parm:     io
 */
module.exports = function(io) {
    //index.html
    io.of('/index').on('connection',function(socket) {
        require('./index.socket.js')(socket);
    });

    // //login.html
    // io.of('/login').on('connection',function(socket) {
    //     require('./login.socket.js')(socket);
    // });
};





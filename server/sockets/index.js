/**
 * node:        index.js
 * data:        16.11.01
 * author:      zhuxiankang
 * describe:    socket连接
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





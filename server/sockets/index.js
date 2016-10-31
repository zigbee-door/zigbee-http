
module.exports = function(io) {
    //index.html
    io.of('/index').on('connection',function(socket) {
        console.log('index connected!');
    });

    //login.html
    io.of('/login').on('connection',function(socket) {
        console.log('login connected!');
    });
};





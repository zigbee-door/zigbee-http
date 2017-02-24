const express = require('express')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , expressSession = require('express-session')
    , bodyParser = require('body-parser')
    , ejs = require('ejs')
    , path = require('path')
    , fs = require('fs')
    , http = require('http')
    , app = express()
    , server = http.createServer(app)
    , io = require('socket.io')(server);
// mongoose,redis config init
require('./config')();
//设置HTTP端口为3000, 启动views
app.set('port', process.env.PORT || 3000);
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('MAGICString'));    //开启cookie
app.use(expressSession({                 // 开启session
  secret:'12345',
  name:'testapp',
  //是指每次请求都重新设置session cookie
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'client')));
// 登录账户验证，未登录时重定向到登录页
app.use((req,res,next) => {
  if(req.session.userid || req.originalUrl === '/' || req.originalUrl === '/login') {
    next();
  } else {
    //没有权限的路由都重定向到登录页
    res.redirect('/');
  }
});
// router list
var routes = fs.readdirSync('./server/routes');
for(let i in routes){
  let name = routes[i].replace('.js','');
  let route = '/' + routes[i].split('.')[0];
  //MAC OS X系统下需要注意屏蔽.DS_Store文件
  if(name !== '.DS_Store'){
    app.use(route, require('./server/routes/'+ name));
  }
}
//主页同时也是登录页，可以同时使用/login和/路由
app.use('/', require('./server/routes/login.route'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'local') { //default development
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: "出错了",
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: "出错了",
    message: err.message,
    error: {}
  });
});
// socket.io
require("./server/sockets")(io);
// redis subscribe
require("./server/subs")();
// module.exports = app;
// start http server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});







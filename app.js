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

app.set('port', process.env.PORT || 3000);      //设置默认端口, 启动views
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('MAGICString'));    //开启cookie
app.use(expressSession({
  secret:'12345',
  name:'testapp',
  //ookie: {maxAge: 300000 },  	    //设置maxAge是300000ms，即300s后session和相应的cookie失效过期
  resave: false,					//是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  saveUninitialized: true			//是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
}));                      			//开启session
app.use(express.static(path.join(__dirname, 'client')));

// router list
var routes = fs.readdirSync('./server/routes');
for(var i in routes){
  var name = routes[i].replace('.js','');
  var route = '/' + routes[i].split('.')[0];
  if(name !== '.DS_Store'){   //MAC下需要注意屏蔽.DS_Store文件
    app.use(route, require('./server/routes/'+ name));
  }
}
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
if (app.get('env') === 'development') {
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


// module.exports = app;
// start http server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});







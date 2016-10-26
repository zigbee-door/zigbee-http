var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('MAGICString'));    //开启cookie
app.use(expressSession());
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
app.use('/', require('./server/routes/login.server.route'));

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


module.exports = app;

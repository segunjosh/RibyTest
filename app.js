var express = require('express');
var path = require('path');
var reload = require('express-reload')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require("express-validator");
var methodOverride = require('method-override');
var port = process.env.PORT || 1200;
var index = require('./routes/index');
var api = require('./routes/api');

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"secretpass123456",saveUninitialized: true,resave: true}));
// app.use(flash());
// app.use(expressValidator());
// add validation methods to request
app.use(expressValidator());
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body == 'object' && '_method' in req.body){ 
      var method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root', // your mysql user
        password : '', // your mysql password
        port : 3306, //port mysql
        database:'api_ex' // your database name
    },'pool') //or single

);

// Router
// app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var path2 = __dirname + '/app.js'
app.use(reload(path2))
module.exports = app;
app.listen(port);

console.log('API server started on: ' + port);
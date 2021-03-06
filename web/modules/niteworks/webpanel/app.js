var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twitter = require('twitter');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/niteworks", {native_parser:true});

var client = new Twitter({
  consumer_key: '66buihKNfPXGUjFqauGZ5Wd5P',
  consumer_secret: 'mvitd1XwoRM7Nl2GYm9avvtTnK8MKUfUhXsNyA7T9U8zJfSHyf',
  access_token_key: '138364610-fc9m1hS0xrQndIH8u0mURjDQaIW3gzbWI2pE9c6O',
  access_token_secret: '16WYWjdHU1BWt9P0qUCYC3QRWPMw9B2nVIKnNHxIcuQZ1'
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
  req.db = db;
  req.client = client;
  next();
});

app.use('/', routes);
app.use('/users', users);

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
    message: err.message,
    error: {}
  });
});


module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var AppState = require ('./src/server/AppState')

// define app state
let state = new AppState() 

var indexRouter = require('./routes/index')(state);
var usersRouter = require('./routes/users')(state);
var gameRouter = require('./routes/game')(state);
var characterRouter = require('./routes/character')(state);
var signOutRouter = require('./routes/sign-out')(state);
var printRouter = require('./routes/print')(state);

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/character', characterRouter);
app.use('/sign-out', signOutRouter);
app.use('/print', printRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = {app, state};

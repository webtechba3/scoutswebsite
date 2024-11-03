const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const imagesRouter = require('./routes/images');
const inschrijvenRouter = require('./routes/inschrijven'); // Dit importeert de inschrijvenRouter
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/images', imagesRouter); // Dit zorgt ervoor dat de imagesRouter wordt gebruikt wanneer de URL begint met `/images`
app.use('/inschrijven', inschrijvenRouter); // Dit zorgt ervoor dat de inschrijvenRouter wordt gebruikt wanneer de URL begint met `/inschrijven`
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

module.exports = app;

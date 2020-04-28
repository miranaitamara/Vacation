const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const usersRouter = require('./routes/users');
const vacationsRouter = require('./routes/vacations');
const adminRouter = require('./routes/admin');

const app = express();


/*Cors Config When Production*/
app.use(cors({origin: 'http://localhost:3000', credentials: true}))

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/uploads', express.static('uploads'));
app.use('/users', usersRouter);
app.use('/vacations', vacationsRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json(err.message);
});

module.exports = app;

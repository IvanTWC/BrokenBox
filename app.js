// @ts-check
// Dependencies
const createError = require('http-errors')
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const router = require('./router')
const database = require('./misc/database')
const fs = require('fs')

// Setup required directory
const dbDir = './bin/db/'
if(!fs.existsSync(dbDir)){
  fs.mkdirSync(dbDir)
}

// Create main sqlite database
database.initPrimaryDB()

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Static
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use(express.static(__dirname + '/node_modules/font-awesome'))
app.use(express.static(__dirname + '/node_modules/font-awesome'))

// Authentication
app.use(session({secret:'ultra_secret_key', name:'mainSession' ,saveUninitialized:false}))

// Setup router
router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});

module.exports = app

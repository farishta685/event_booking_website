//You might need to run npm install express-session
//and npm install --save mysql
//and npm install --save nodemailer

//For Argon2 stuff to work
//npm i argon2

//For Google stuff to work
//npm install google-auth-library --save

//for sanitizing inputs
//npm install sanitize-html

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session'); //SESSION INCLUDE
var logger = require('morgan');
var mysql = require('mysql'); //SQL INCLUDE

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventRouter = require('./routes/event');
var adminRouter = require('./routes/admin');

//SQL SET UP START
var app = express();
var dbConnectionPool = mysql.createPool({
    host: "localhost",
    database: "ProjectDatabase"
});

app.use(function(req,res,next){
    req.pool = dbConnectionPool;
    next();
});

//SQL SET UP END

//SESSION SET UP
app.use(session({                               //           //
    secret: 'super secret secret',              //           //
    resave: false,                              // THIS CODE //
    saveUninitialized: true,                    //           //
    cookie: { secure: false }                   //           //
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res, next) {
  if (req.session.userID !== undefined) {
      //app.use(express.static(path.join(__dirname, '../client/main')));
      return res.redirect('Dashboard.html');
   }else {
      //app.use(express.static(path.join(__dirname, '../client/login')));
      next();
  }
});

app.get('/LoginRegister.html', function(req, res, next) {
    if (req.session.userID !== undefined) {
        //app.use(express.static(path.join(__dirname, '../client/main')));
        return res.redirect('Dashboard.html');
     }else {
        //app.use(express.static(path.join(__dirname, '../client/login')));
        next();
    }
});

app.get('/Dashboard.html', function(req, res, next) {
    if (req.session.userID !== undefined) {
        //app.use(express.static(path.join(__dirname, '../client/main')));
        next();
     }else {
        //app.use(express.static(path.join(__dirname, '../client/login')));
        //alert("Please log in before accessing that page!");
        return res.redirect('LoginRegister.html');
    }
});

app.get('/NewEvent.html', function(req, res, next) {
    if (req.session.userID !== undefined) {
        //app.use(express.static(path.join(__dirname, '../client/main')));
        next();
     }else {
        //app.use(express.static(path.join(__dirname, '../client/login')));
        //alert("Please log in before accessing that page!");
        return res.redirect('LoginRegister.html');
    }
});



app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/event', eventRouter);
app.use('/admin', adminRouter);

module.exports = app;

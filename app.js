
//------------------------------------------
//-------------> Use Important Modules
//------------------------------------------
'use strict';
var express = require('express');
var path = require('path');
var cors = require('cors');
var expressLayouts = require('express-ejs-layouts');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/user');
var commanRouter = require('./routes/common');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var fileUpload = require('express-fileupload');
app.use(cors());
app.use(fileUpload());
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({

  secret: 'keyboard cat',

  proxy: true,
  resave: true,
  saveUninitialized: true,
  //cookie: { maxAge: 60000 }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//------------------------------------------
//-------------> Manage Routing 
//------------------------------------------
app.use('/', commanRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);


module.exports = app;

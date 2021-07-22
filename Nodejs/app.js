
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require("./Router/index");
const activity = require("./Router/activity");
const socket = require('./Router/join')
const app = express();


const db = require('./helpers/dbConnect')(); //Db connect

//secret key
const key = require('./key');
app.set('api_secret_key',key.api_secret_key);
// Views files

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const tokenAuth = require('./middleware/auth');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use((req, res, next) => {
 // console.log(req);
    res.header('Access-Control-Allow-Origin',  'x-access-token');
    next();
  });

  app.use('/api/', tokenAuth);

  app.use('/', indexRouter);
  app.use('/api/', activity);
  app.use('/location',socket);

  module.exports = app;
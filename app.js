/**
 * Created by SoRa on 2016/10/16 0016.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var ejs = require('ejs');
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = "mongodb://localhost:27017/movies";

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

//app.engine('html',ejs.__express);
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));//静态文件配置的目录
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
       url:dbUrl,
       collection : 'sessions'
    }),
    resave: false,

    saveUninitialized: true

}));

app.use(cookieParser());
app.locals.moment = require('moment');

app.set('views','./app/views/pages');
//app.set('view engine','html');
app.set('view engine','jade');
app.listen(port);
if ('development' === app.get('env')){//配置
    app.set('showStackError',true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug',true);
}

require('./config/routes')(app);
console.log('imooc started on port'+ port);


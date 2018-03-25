var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    router = require('./routes'),
    errorHandlers = require('./routes/error'),
    expressDebug = require('express-debug');

app.set('env', process.env.APPENV);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));

app.use(router);

// catch 404 and forward to error handler
app.use(errorHandlers.fourohfour);

// error handlers
if (app.get('env') === 'development') {
    app.use(errorHandlers.devError);
}

app.use(errorHandlers.prodError);

expressDebug(app, {/* settings */});

module.exports = app;

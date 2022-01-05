let express = require('express');

let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let index = require('./routes/index');
let erase = require('./routes/erase');
let trades = require('./routes/trades');
let stocks = require('./routes/stocks');

let app = express();

function ignoreFavicon(req: any, res: any, next: any) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}
class ResponseError extends Error {
  status?: number;
}

app.use(ignoreFavicon);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/trades', trades);
app.use('/erase', erase);
app.use('/stocks', stocks);

// catch 404 and forward to error handler
app.use(function(req: any, res: any, next: any) {
  var err = new ResponseError('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(req: any, res: any, err: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

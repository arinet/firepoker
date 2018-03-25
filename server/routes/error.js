module.exports.fourohfour = function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}

module.exports.devError = function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: err
  });
}

module.exports.prodError = function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
}
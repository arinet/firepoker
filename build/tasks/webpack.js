var gulp = require('gulp');
var webpack = require('webpack');

gulp.task('webpack', ['templates'], function(done) {
  var config = require('../webpack/base');
  webpack(config.base, function(err, s) {
    if (err) {
      console.log(err);
      done();
      return;
    }
    stats = s.toJson()
    if (stats.warnings.length) {
      stats.warnings.forEach(console.log)
    }
    if (stats.errors.length) {
      stats.errors.forEach(console.log)
    }
    done();
  })
});

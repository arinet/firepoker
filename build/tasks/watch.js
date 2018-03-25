var gulp = require('gulp');
var livereload      = require('gulp-livereload');

var args = global.BUILD_ARGS;

gulp.task('watch', ['build'], function() {

  gulp.watch([
    'client/app/**/*.js',
    'client/app/**/*.html',
    'client/content/**/*'
  ], ['webpack', 'content']);

  gulp.watch([
    'client/styles/**/*.scss'
  ], ['sass']);

  if (args.livereload) {
    livereload.listen({ reloadPage: '/' });
  }

});

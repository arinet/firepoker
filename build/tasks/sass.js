var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

gulp.task('sass', function() {

  gulp.src('./node_modules/bootstrap-sass/assets/fonts/bootstrap/*.*')
    .pipe(gulp.dest('dist/fonts'));

  gulp.src('client/styles/main.scss')
    .pipe(sass({
      sourcemap: true,
      sourcemapPath: '../../',
      loadPath: [
        './node_modules/bootstrap-sass/assets/stylesheets'
      ]
    }))
      .on('error', console.log)
    .pipe(gulp.dest('dist/css'))
});

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var fs = require('fs');
var yargs = require('yargs');
var env = require('node-env-file');

// TODO: Get livereload working...
var args = global.BUILD_ARGS = yargs
            .boolean('production', false)
            .boolean('livereload', false)
            .boolean('server', false)
            .default('reporter', 'spec')
            .alias('p', 'production')
            .alias('r', 'reporter')
            .alias('s', 'server')
            .alias('l', 'livereload')
            .argv;

if (args._.indexOf('deploy') >- 1){
  args.production = true;
}

if (args.production) {
  env(__dirname + '/prod.env');
} else {
  env(__dirname + '/.env');
}


gulp.task('default', ['build']);
gulp.task('dev', ['watch']);

gulp.task('build', ['webpack', 'sass', 'content'])
  .on('end', function() {
    if (args.livereload) {
      livereload.reload();
    }
  });

gulp.task('content', function () {
  return gulp.src('client/content/**')
    .pipe(gulp.dest('dist/content/'));
});


fs.readdirSync('build/tasks').forEach(function(file) {
  require('./build/tasks/' + file);
});

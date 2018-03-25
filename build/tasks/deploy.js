var gulp = require('gulp');
var Path = require('path');

gulp.task('deploy', ['build'], function() {
  var server = '\\\\server\\FirePoker_Reclusive';
  gulp.src(Path.join(process.cwd(), './client/extensions/*.crx'))
    .pipe(gulp.dest(server + '\\extensions'));

  gulp.src(Path.join(process.cwd(), './dist/**/*.{js,png,jpg,jpeg,svg,eot,ttf,woff,woff2,css,ico,html}'))
    .pipe(gulp.dest(server + '\\dist'));

  gulp.src(Path.join(process.cwd(), './client/index.html'))
    .pipe(gulp.dest(server + '\\client'));

  gulp.src(Path.join(process.cwd(), './server/**/*.{js,json,ejs}'))
    .pipe(gulp.dest(server + '\\server'));

  gulp.src(Path.join(process.cwd(), './bin/*'))
    .pipe(gulp.dest(server + '\\bin'));

  gulp.src([Path.join(process.cwd(), './package.json'),
      Path.join(process.cwd(), './Procfile'),
      Path.join(process.cwd(), './.env'),
    ])
    .pipe(gulp.dest(server));
});

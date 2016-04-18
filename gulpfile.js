var gulp = require('gulp');

var jshint = require('gulp-jshint');
var minify = require('gulp-minify');

var karma = require('gulp-karma');

/**
 * check js style
 */
gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

/**
 * minify js
 */
gulp.task('compress', function() {
  gulp.src('src/**/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.min.js'
        },
        ignoreFiles: ['.min.js']
    }))
    .pipe(gulp.dest('dist'))
});

/**
 * run tests
 */
gulp.task('test', function() {
  return gulp.src('./foobar')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    });
});

/**
 * run lint, test and compress
 */
gulp.task('build', ['lint', 'test', 'compress']);

/**
 * build is the default task
 */
gulp.task('default', ['build']);
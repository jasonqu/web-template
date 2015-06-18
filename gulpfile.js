var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    nib = require('nib');

var path = {
    stylus: 'dev/stylus/*.styl',
    css_build: './build/css'
};

gulp.task('stylus', function () {
    gulp.src(path.stylus)
        .pipe(stylus({
            use: nib()
            //compress: false
        }))
        .pipe(gulp.dest(path.css_build));
});

gulp.task('watcher', function () {
    gulp.watch(path.stylus, ['stylus']);
});

gulp.task('default', ['watcher']);
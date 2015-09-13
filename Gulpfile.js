'use strict';

var gulp = require('gulp');
var eslint= require('gulp-eslint');
var del = require('del');
var babel = require('gulp-babel');

gulp.task('clean', function(cb){
    del(['lib']).then(function(){
        cb();
    });
});

gulp.task('babel', ['clean'], function(){
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('lint', function(){
    return gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['lint']);
    gulp.watch('test/**/*.js', ['lint']);
});

gulp.task('build', ['clean', 'babel']);
gulp.task('default', ['lint', 'watch']);

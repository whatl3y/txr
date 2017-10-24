const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const insert = require('gulp-insert')
const uglify = require('gulp-uglify')
const webpack = require('webpack-stream')
const webpack_config = require('./webpack.config.js')

const clientWebpackConfig = webpack_config('client')
const serverWebpackConfig = webpack_config('server')

// Client
gulp.task('transpile-client', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(clientWebpackConfig))
    // .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./dist"))
})

gulp.task('index-client', function() {
  return gulp.src("./dist/txr-client.js")
    .pipe(insert.prepend("#!/usr/bin/env node\n\n"))
    .pipe(gulp.dest("./dist"))
})

// Server
gulp.task('transpile-server', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(serverWebpackConfig))
    // .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./dist"))
})

gulp.task('index-server', function() {
  return gulp.src("./dist/txr-server.js")
    .pipe(insert.prepend("#!/usr/bin/env node\n\n"))
    .pipe(gulp.dest("./dist"))
})


// Entry points
gulp.task('build-client', gulpSequence('transpile-client', 'index-client'))
gulp.task('build-server', gulpSequence('transpile-server', 'index-server'))
gulp.task('build', [ 'build-client', 'build-server' ])

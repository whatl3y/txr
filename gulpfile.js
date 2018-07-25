const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const insert = require('gulp-insert')
const uglify = require('gulp-uglify')
const webpack = require('webpack-stream')
const webpack_config = require('./webpack.config.js')

const libraryClientWebpackConfig  = webpack_config('library')
const cliClientWebpackConfig      = webpack_config('client')
const serverWebpackConfig         = webpack_config('server')

// Client Library
gulp.task('build-library-client', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(libraryClientWebpackConfig))
    .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./dist"))
})

// Client CLI
gulp.task('transpile-cli-client', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(cliClientWebpackConfig))
    .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./dist"))
})

gulp.task('index-cli-client', function() {
  return gulp.src("./dist/txr-client.js")
    .pipe(insert.prepend("#!/usr/bin/env node\n\n"))
    .pipe(gulp.dest("./dist"))
})

// Server CLI
gulp.task('transpile-cli-server', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(serverWebpackConfig))
    .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./dist"))
})

gulp.task('index-cli-server', function() {
  return gulp.src("./dist/txr-server.js")
    .pipe(insert.prepend("#!/usr/bin/env node\n\n"))
    .pipe(gulp.dest("./dist"))
})


// Entry points
gulp.task('build-cli-client', gulpSequence('transpile-cli-client', 'index-cli-client'))
gulp.task('build-cli-server', gulpSequence('transpile-cli-server', 'index-cli-server'))
gulp.task('build', [ 'build-library-client', 'build-cli-client', 'build-cli-server' ])

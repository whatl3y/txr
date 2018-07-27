const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const insert = require('gulp-insert')
const uglifyComposer = require('gulp-uglify/composer')
const uglifyes = require('uglify-es')
const webpack = require('webpack-stream')
const webpack_config = require('./webpack.config.js')
const uglify = uglifyComposer(uglifyes, console)

const libraryClientWebpackConfig  = webpack_config('library')
const cliClientWebpackConfig      = webpack_config('client')
const serverWebpackConfig         = webpack_config('server')

// Client Library
gulp.task('build-library-client', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(libraryClientWebpackConfig))
    .pipe(uglify())
    .pipe(gulp.dest("./dist"))
})

// Client CLI
gulp.task('transpile-cli-client', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(cliClientWebpackConfig))
    .pipe(uglify())
    .pipe(gulp.dest("./bin"))
})

gulp.task('index-cli-client', function() {
  return gulp.src("./bin/txr-client")
    .pipe(insert.prepend("#!/usr/bin/env node\n\n"))
    .pipe(gulp.dest("./bin"))
})

// Server CLI
gulp.task('transpile-cli-server', function() {
  return gulp.src("./src/client/**/*.js")
    .pipe(plumber())
    .pipe(webpack(serverWebpackConfig))
    .pipe(uglify())
    .pipe(gulp.dest("./bin"))
})

gulp.task('index-cli-server', function() {
  return gulp.src("./bin/txr-server")
    .pipe(insert.prepend("#!/usr/bin/env node\n\n"))
    .pipe(gulp.dest("./bin"))
})


// Entry points
gulp.task('build-cli-client', gulpSequence('transpile-cli-client', 'index-cli-client'))
gulp.task('build-cli-server', gulpSequence('transpile-cli-server', 'index-cli-server'))
gulp.task('build', [ 'build-library-client', 'build-cli-client', 'build-cli-server' ])

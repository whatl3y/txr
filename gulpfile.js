const gulp = require('gulp')
const plumber = require('gulp-plumber')
const insert = require('gulp-insert')
const ts = require('gulp-typescript')
const uglifyComposer = require('gulp-uglify/composer')
const uglifyes = require('uglify-es')
const webpack = require('webpack-stream')
const webpackConfig = require('./webpack.config.js')
const uglify = uglifyComposer(uglifyes, console)

const tsProject1 = ts.createProject('tsconfig.json')
const tsProject2 = ts.createProject('tsconfig.json')
const tsProject3 = ts.createProject('tsconfig.json')

const libraryClientWebpackConfig = webpackConfig('library')
const cliClientWebpackConfig = webpackConfig('client')
const serverWebpackConfig = webpackConfig('server')

// Client Library
gulp.task('build-library-client', function () {
  return (
    gulp
      .src('./src/client/**/*.{js,ts}')
      .pipe(plumber())
      .pipe(tsProject1())
      .pipe(webpack(libraryClientWebpackConfig))
      // .pipe(uglify())
      .pipe(gulp.dest('./dist'))
  )
})

// Client CLI
gulp.task('transpile-cli-client', function () {
  return (
    gulp
      .src('./src/client/**/*.{js,ts}')
      .pipe(plumber())
      .pipe(tsProject2())
      .pipe(webpack(cliClientWebpackConfig))
      // .pipe(uglify())
      .pipe(gulp.dest('./bin'))
  )
})

gulp.task('index-cli-client', function () {
  return gulp
    .src('./bin/txr-client')
    .pipe(insert.prepend('#!/usr/bin/env node\n\n'))
    .pipe(gulp.dest('./bin'))
})

// Server CLI
gulp.task('transpile-cli-server', function () {
  return (
    gulp
      .src('./src/client/**/*.{js,ts}')
      .pipe(plumber())
      .pipe(tsProject3())
      .pipe(webpack(serverWebpackConfig))
      // .pipe(uglify())
      .pipe(gulp.dest('./bin'))
  )
})

gulp.task('index-cli-server', function () {
  return gulp
    .src('./bin/txr-server')
    .pipe(insert.prepend('#!/usr/bin/env node\n\n'))
    .pipe(gulp.dest('./bin'))
})

// Entry points
gulp.task(
  'build-cli-client',
  gulp.series('transpile-cli-client', 'index-cli-client')
)
gulp.task(
  'build-cli-server',
  gulp.series('transpile-cli-server', 'index-cli-server')
)
gulp.task(
  'build',
  gulp.parallel('build-library-client', 'build-cli-client', 'build-cli-server')
)

'use strict';

const { src, dest, watch, parallel, series } = require("gulp");

// Load plugins
const autoprefixer = require('gulp-autoprefixer');
const changed = require('gulp-changed');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-dart-sass');
const clean = require('gulp-clean-css');
const flatten = require('gulp-flatten');
const themeKit = require('@shopify/themekit');

// CSS function
function css(cb) {
  const source  = './src/scss/**/**/*.scss';

  return src(source)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade : false }))
    .pipe(clean( { compatibility: 'ie11' }))
    .pipe(dest('assets'))
    cb();
}

// JS function 
function js(cb) {
  const source = './src/js/**/*.js';

  return src(source)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(dest('assets'))
    cb();
}

// Images function
function images(cb) {
  const source = './src/images/**';

  return src(source)
    .pipe(changed('assets'))
    .pipe(flatten())
    .pipe(dest('assets'))
    cb();
}

// Fonts function
function fonts(cb) {
  const source = './src/fonts/**';

  return src(source)
    .pipe(changed('assets'))
    .pipe(dest('assets'))
    cb();
}

// Watch Files
function watchFiles() {
    watch('./src/scss/**/**/*.scss', css);
    watch('./src/js/**/**/*.js', js);
    watch('./src/images/**', images);
    watch('./src/fonts/**', fonts);
    themeKit.command('watch', {
      allowLive: true,
      env: 'development'
  })
}

exports.watch = parallel(watchFiles);
exports.default = series(css, parallel(js, images, fonts));
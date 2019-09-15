const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/'));
}

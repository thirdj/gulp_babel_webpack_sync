'use strict';

import gulp from 'gulp';
import gulpUtil from 'gulp-util';

import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';

const DIR = {
  SRC: 'assets',
  DEST: 'dist'
}

const SRC = {
  JS: DIR.SRC + '/js/*.js',
  CSS: DIR.SRC + '/css/*.css',
  HTML: DIR.SRC + '/*.html',
  IMAGES: DIR.SRC + '/images/*'
}

const DEST = {
  JS: DIR.DEST + '/js',
  CSS: DIR.DEST + '/css',
  HTML: DIR.DEST + '/',
  IMAGES: DIR.DEST + '/images'
}

gulp.task('js', () => {
  return gulp.src(SRC.JS)
    .pipe(uglify())
    .pipe(gulp.dest(DEST.JS));
});

gulp.task('css', () => {
  return gulp.src(SRC.CSS)
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(DEST.CSS));
});

gulp.task('html', () => {
  return gulp.src(SRC.HTML)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(DEST.HTML));
});

gulp.task('images', () => {
  return gulp.src(SRC.IMAGES)
    .pipe(imagemin())
    .pipe(gulp.dest(DEST.IMAGES));
});

gulp.task('clean', () => {
  return del.sync([DIR.DEST]);
});


gulp.task('default', ['clean', 'js', 'css', 'html', 'images'], () => {
  return gulpUtil.log('Gulp is running');
});
/**
 * gulp.task(name [, deps, fn]) 는 gulp가 처리할 task, 즉 ‘작업‘ 을 정의합니다.
 * 인수 name 은 string 형태로서 task의 이름을 지정하며, deps와 fn 은 optional 인수로서, 생략되어도 되는 인수입니다.
 * deps 는 task name 의 배열 형태이며 이 인수가 전달 될 시, 이 배열 안에 있는 task들을 먼저 실행 한다음에,
 * 함수형태로 전달되는 fn 을 실행합니다.
 */
// gulp.task('world', ['hello'], () => {
//   console.log('world');
// });
/*
const watcher = gulp.watch('./assets/js/main.js', ['uglify', 'reload']);
watcher.on('change', (event) => {
  console.log(`File ${event.path} was ${event.type}, running tasks...`);
});
*/

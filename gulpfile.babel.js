'use strict';

import gulp from 'gulp';
import gulpUtil from 'gulp-util';
// import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import babel from 'gulp-babel';
import Cache from 'gulp-file-cache';
import nodemon from 'gulp-nodemon';
import webpack from 'gulp-webpack';
import browserSync from 'browser-sync';
import webpackConfig from './webpack.config';

import del from 'del';

const DIR = {
  SRC: 'assets',
  DEST: 'dist'
}

const SRC = {
  JS: DIR.SRC + '/js/*.js',
  CSS: DIR.SRC + '/css/*.css',
  HTML: DIR.SRC + '/*.html',
  IMAGES: DIR.SRC + '/images/*',
  SERVER: 'server/**/*.js'
}

const DEST = {
  JS: DIR.DEST + '/js',
  CSS: DIR.DEST + '/css',
  HTML: DIR.DEST + '/',
  IMAGES: DIR.DEST + '/images',
  SERVER: 'app'
}
/*
gulp.task('js', () => {
  return gulp.src(SRC.JS)
    .pipe(uglify())
    .pipe(gulp.dest(DEST.JS));
});
*/
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

// 변경된 파일만 컴파일 하도록 해 줌.
let cache = new Cache();

gulp.task('babel', () => {
  return gulp.src(SRC.SERVER)
    .pipe(cache.filter())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(cache.cache())
    .pipe(gulp.dest(DEST.SERVER));
});

gulp.task('start', ['babel'], () => {
  return nodemon({
    script: DEST.SERVER + '/main.js',
    watch: DEST.SERVER
  });
})

gulp.task('webpack', () => {
  return gulp.src('assets/js/main.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('browser-sync', () => {
  browserSync.init(null, {
    proxy: 'http://localhost:9090',
    files: ['dist/**/*.*'],
    port: 7000
  })
});

gulp.task('watch', () => {
  let watcher = {
    webpack: gulp.watch(SRC.JS, ['webpack']),
    css: gulp.watch(SRC.CSS, ['css']),
    html: gulp.watch(SRC.HTML, ['html']),
    images: gulp.watch(SRC.IMAGES, ['images']),
    babel: gulp.watch(SRC.SERVER, ['babel'])
  };

  let notify = (event) => {
    gulpUtil.log('File', gulpUtil.colors.yellow(event.path), 'was', gulpUtil.colors.magenta(event.type));
  };

  for(let key in watcher) {
    watcher[key].on('change', notify);
  }

});

gulp.task('default',
  ['clean', 'webpack', 'css', 'html', 'images', 'watch', 'start', 'browser-sync'],
  () => {
  gulpUtil.log('Gulp is running');
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

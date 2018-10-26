'use strict';

var gulp = require('gulp'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
  rimraf = require('rimraf'),
  browserSync = require("browser-sync"),
  reload = browserSync.reload;

var path = {
  dist: { // Куда складывать готовые после сборки файлы
    html: 'dist/',
    js: 'dist/js',
    css: 'dist/css',
    img: 'dist/img',
    svg: 'app/chunks',
    fonts: 'dist/fonts'
  },
  app: { // Откуда брать исходники
    html: 'app/*.html',
    js: 'app/js/main.js',
    style: 'app/style/main.scss',
    img: 'app/img/**/*.*',
    svg: 'app/icons/**/*.svg',
    fonts: 'app/fonts/**/*.*'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'app/**/*.html',
    js: 'app/js/**/*.js',
    style: 'app/style/**/*.scss',
    img: 'app/img/**/*.*',
    svg: 'app/icons/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  clean: './dist'
};

var config = {
  server: {
    baseDir: "./dist"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function() {
  gulp.src(path.app.html) //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulp.dest(path.dist.html)) //Выплюнем их в папку dist
    .pipe(reload({
      stream: true
    })); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.app.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.dist.js)) //Выплюнем готовый файл в dist
        .pipe(reload({
          stream: true
      })); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.app.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer({browsers: ['last 2 versions', 'ie 11', 'Android >= 4.1', 'Safari >= 8', 'iOS >= 8']})) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css)) //И в dist
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.app.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)) //И бросим в dist
        .pipe(reload({stream: true}));
});

gulp.task('svg:build', function () {
  gulp.src(path.app.svg) //Выберем наши картинки
    .pipe(svgmin({js2svg: {pretty: true}}))// remove all fill and style declarations in out shapes;
    .pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		})) // cheerio plugin create unnecessary string '>', so replace it.
    .pipe(replace('&gt;', '>'))// build svg sprite
    .pipe(svgSprite({
				mode: "symbols",
				preview: false,
				selector: "icon-%f",
				svg: {
					symbols: 'svg-sprite.html'
				}
			}
		))
    .pipe(gulp.dest(path.dist.svg)) //И бросим в dist
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'image:build',
    'svg:build',
    'fonts:build'
]);

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('webserver', function() {
  browserSync(config);
});

gulp.task('watch', function(){
    gulp.watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    gulp.watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    gulp.watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    gulp.watch([path.watch.svg], function(event, cb) {
        gulp.start('svg:build');
    });
    gulp.watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);

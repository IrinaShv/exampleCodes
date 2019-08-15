var buildFolder = '**/code/build';
var destFolder = '/*/code/dist';

// Подключение плагинов
var gulp = require('gulp'),
  pug = require('gulp-pug'),            
  htmlMin = require('gulp-htmlmin'),    
  htmlHint = require('gulp-htmlhint'), 

  sass = require('gulp-sass'),          
  autopref = require('gulp-autoprefixer'), 
  cleancss = require('gulp-clean-css'), 
  csslint = require('gulp-csslint'),    

  jshint = require('gulp-jshint'),      
  fixjs = require('gulp-fixmyjs'),    
  uglify = require('gulp-uglify'),      

  imagemin = require('gulp-imagemin'),  
  mozjpeg = require('imagemin-mozjpeg'),
  pngquant = require('imagemin-pngquant'),
  svgo = require('gulp-svgo'),          
  pngsprite = require('gulp.spritesmith'), 
  svgsprite = require('gulp-svg-sprite'),  

  concat = require('gulp-concat'),     
  sourcemaps = require('gulp-sourcemaps'), 
  browserSync = require('browser-sync').create();  

// =============================================================================================
//                                            Таски
// =============================================================================================

// ************************************************
//         Development
// ************************************************

// compile .pug to .html (with soursemap)
gulp.task('pug', function () {
  return gulp.src(buildFolder + '/pug/*.pug')
    .pipe(sourcemaps.init())
    .pipe(pug({ pretty: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildFolder + '/'))
    .pipe(browserSync.stream())
});

// compile .scss to .css (with soursemap)
gulp.task('sass', function () {
  return gulp.src(buildFolder + '/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildFolder + '/css/'))
    .pipe(browserSync.stream())
});

// concatenate vendor css
gulp.task('vendor-css', function () {
  return gulp.src(buildFolder + '/css/vendor/*.css')
    .pipe(concat('vendor.css'))
    .pipe(cleancss())
    .pipe(gulp.dest(buildFolder + '/css'))
});

// concatenate custom JS files (with soursemap)
gulp.task('concat-js', function () {
  return gulp.src(buildFolder + '/js/parts/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildFolder + '/js/'));
});

// concatenate vendor JS
gulp.task('vendor-js', function () {
  return gulp.src(buildFolder + '/js/vendor/*.js')
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(buildFolder + '/js'));
});

// Create PNG sprite
gulp.task('png-sprite', function () {
  return gulp.src(buildFolder + '/img/png-sprite/*.png')
    .pipe(pngsprite({
      imgName: 'png-sprite.png',
      cssName: 'png-sprite.css',
      padding: 5
    }))
    .pipe(gulp.dest(buildFolder + '/img/'));
});

// Create SVG css and symbol sprite
gulp.task('svg-sprite', function () {
  return gulp.src(buildFolder + '/img/svg-sprite/*.svg')
    .pipe(svgsprite({
      shape: {
        dimension: { 
          maxWidth: 32,
          maxHeight: 32
        },
        spacing: { 
          padding: 10
        }
      },
      mode: {
        view: {
          bust: false,
          render: {
            css: true 
          }
        },
        symbol: true 
      }
    }))
    .pipe(gulp.dest(buildFolder + '/img/'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'pug'], function () {

  browserSync.init({
    server: buildFolder
  });

  gulp.watch(buildFolder + '/pug/**/*.pug', ['pug']);
  gulp.watch(buildFolder + '/sass/**/*.scss', ['sass']);
  gulp.watch(buildFolder + '/js/*').on('change', browserSync.reload);
});

// ************************************************
//         Production
// ************************************************

// html
gulp.task('min-html', function () {
  return gulp.src(buildFolder + '/*.html')
    .pipe(htmlHint())
    .pipe(htmlHint.reporter())
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest(destFolder));
});

// css
gulp.task('copy-vendor-css', function () {
  return gulp.src(buildFolder + '/css/vendor.css')
    .pipe(gulp.dest(destFolder + '/css'))
});
gulp.task('min-css', function () {
  return gulp.src(buildFolder + '/css/main.css')
    .pipe(csslint({
      'order-alphabetical': false,
      'bulletproof-font-face': false,
      'box-sizing': false,
      'box-model': false,
      'compatible-vendor-prefixes': false
    }))
    .pipe(csslint.formatter())
    .pipe(autopref({ browsers: ['last 5 versions'] }))
    .pipe(cleancss())
    .pipe(gulp.dest(destFolder + '/css'));
});

// js
gulp.task('copy-vendor-js', function () {
  return gulp.src(buildFolder + '/js/vendor.js')
    .pipe(gulp.dest(destFolder + '/js'))
});
gulp.task('min-js', function () {
  return gulp.src(buildFolder + '/js/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(fixjs())
    .pipe(uglify())
    .pipe(gulp.dest(destFolder + '/js'));
});

// images minification
gulp.task('min-img', function () {
  return gulp.src(buildFolder + '/img/*')
    .pipe(imagemin([
      pngquant(),
      mozjpeg({ progressive: true })
    ]))
    .pipe(gulp.dest(destFolder + '/img'));
});
gulp.task('min-svg', function () {
  return gulp.src(buildFolder + '/img/*.svg')
    .pipe(svgo({
      plugins: [{ removeViewBox: false }]
    }))
    .pipe(gulp.dest(destFolder + '/img'));
});

// copy fonts
gulp.task('copy-fonts', function () {
  return gulp.src(buildFolder + '/fonts/**/*')
    .pipe(gulp.dest(destFolder + '/fonts'))
});

// ===========================
// Tasks
// ===========================
gulp.task('build', ['vendor-css', 'concat-js', 'vendor-js']);
gulp.task('dev', ['serve']);
gulp.task('prod', ['min-html', 'copy-vendor-css', 'min-css', 'copy-vendor-js', 'min-js', 'min-img', 'min-svg', 'copy-fonts']);
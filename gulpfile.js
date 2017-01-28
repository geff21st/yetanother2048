var gulp = require('gulp');

var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
// var gcmq = require('gulp-group-css-media-queries');

var scss_mask = 'scss/**/*.scss';
var js_dir = 'prog-js';
var js_src = '../../'+js_dir;
var js_mask = js_dir + '/*.js';

gulp.task('sass-full', () => {
    // знак ! - означает "исключть маску"
    // ** – директория, * – любое название
    return gulp.src(['!scss/**/_*.scss', scss_mask])

        .pipe(sourcemaps.init())

        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
        }))
        // .pipe(gcmq())

        .pipe(gulp.dest('dist/css'))

        .pipe(sourcemaps.write('.', {
            // sourceMappingURLPrefix: '../scss',
            includeContent: false,
            sourceRoot: '../../scss'
        }))

        .pipe(gulp.dest('dist/css'))
        ;
});


gulp.task('sass-min', () => {
    // знак ! - означает "исключть маску"
    // ** – директория, * – любое название
    return gulp.src(['!scss/**/_*.scss', scss_mask])

        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        // .pipe(gcmq())

        .pipe(cleanCSS())

        .pipe(rename({
            suffix: '.min'
        }))

        .pipe(sourcemaps.write('.', {
            // sourceMappingURLPrefix: '../scss',
            includeContent: false,
            sourceRoot: '../../scss'
        }))

        .pipe(gulp.dest('dist/css'))
        ;
});

gulp.task('sass', gulp.parallel('sass-full', 'sass-min'));

gulp.task('scripts', function() {
    return gulp.src(js_mask)
        // .pipe(concat('all.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.', {
            // sourceMappingURLPrefix: js_src,
            includeContent: false,
            sourceRoot: js_src
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function() {
    watch(js_mask, gulp.series('scripts'));
    watch(scss_mask, gulp.series('sass'));
});

gulp.task('default', gulp.parallel('sass', 'scripts', 'watch'));
// gulp.task('default', gulp.parallel('sass', 'watch'));
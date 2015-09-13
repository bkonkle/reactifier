import {uploadToS3} from './src/s3-utils';
import reactifier from './src/index';
import babel from 'gulp-babel';
import dotenv from 'dotenv';
import gulp from 'gulp';
import rename from 'gulp-rename';
import sass from 'gulp-sass';

dotenv.load();

gulp.task('default', ['build', 'run']);

gulp.task('build', ['build:lib', 'build:media', 'build:sass']);

gulp.task('run', function() {
  // The reactifier function returns a promise, which we can pass to gulp
  return reactifier();
});

gulp.task('build:lib', function() {
  // Transpile es6 to the lib directory
  return gulp.src('src/**/*.js?(x)')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('build:media', function() {
  return gulp.src(['media/**/*.*', '!media/sass/*'])

    // Upload the files to S3
    .pipe(uploadToS3());
});

gulp.task('build:sass', function() {
  return gulp.src('media/sass/**/*.scss', {base: '.'})

    // First compile the sass
    .pipe(sass().on('error', sass.logError))

    // Rename the file to change the directory to 'css'
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('/sass', '/css');
    }))

    // Then upload the files to S3
    .pipe(uploadToS3());
});

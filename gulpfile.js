import {getS3, callS3} from './src/s3-utils';
import babel from 'gulp-babel';
import dotenv from 'dotenv';
import gulp from 'gulp';
import path from 'path';
import through from 'through2';

dotenv.load();

gulp.task('build:lib', function() {
  return gulp.src('src/**/*.js?(x)')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('build:media', function() {
  const s3 = getS3();

  return gulp.src('media/**/*.*')

    .pipe(through.obj(function(file, enc, cb) {
      const dest = path.relative(process.cwd(), file.path);

      // Upload the file to S3
      callS3(s3, 'upload', {
        Key: dest,
        Body: file.contents,
      })

        // Hit the callback when the upload is done
        .then(function() {
          cb(null, file);
        });
    }));
});

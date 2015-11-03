'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getS3 = getS3;
exports.callS3 = callS3;
exports.uploadToS3 = uploadToS3;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _mimeTypes = require('mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

function getS3() {
  return new _awsSdk2['default'].S3({ params: { Bucket: process.env.S3_BUCKET } });
}

/**
 * Calls S3 and returns a promise for the results.
 *
 * @param {AWS.S3} s3 - the S3 instance to work with
 * @param {String} method - the S3 method to call
 * @param {Object} options - the options to pass with the call
 * @returns {Promise}
 */

function callS3(s3, method, options) {
  return new Promise(function (resolve, reject) {
    s3[method](options, function (err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function uploadToS3() {
  var s3 = getS3();

  return _through22['default'].obj(function (file, enc, cb) {
    // Find the relative path based on the current working directory
    var dest = _path2['default'].relative(process.cwd(), file.path);

    // Upload the file to S3
    callS3(s3, 'upload', {
      Key: dest,
      Body: file.contents,
      ContentType: _mimeTypes2['default'].lookup(file.path)
    })

    // Hit the callback when the upload is done
    .then(function () {
      cb(null, file);
    });
  });
}
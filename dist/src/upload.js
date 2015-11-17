'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.uploadSite = uploadSite;

var _s3Utils = require('./s3-utils');

function uploadSite(_ref) {
  var index = _ref.index;
  var feed = _ref.feed;

  var s3 = (0, _s3Utils.getS3)();

  var indexPromise = (0, _s3Utils.callS3)(s3, 'upload', {
    Key: 'index.html',
    Body: '<!doctype html>' + index,
    ContentType: 'text/html'
  });

  var feedPromise = (0, _s3Utils.callS3)(s3, 'upload', {
    Key: 'rss.xml',
    Body: feed,
    ContentType: 'application/rss+xml'
  });

  // Return a promise that resolves when both have been uploaded
  return Promise.all([indexPromise, feedPromise]);
}
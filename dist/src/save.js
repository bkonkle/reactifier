'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.saveFeed = saveFeed;
exports.getIndex = getIndex;
exports.addToIndex = addToIndex;
exports.saveIndex = saveIndex;
exports.toMarkdown = toMarkdown;
exports.savePost = savePost;
exports.removePost = removePost;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _createLogger = require('./create-logger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _s3Utils = require('./s3-utils');

var _md5 = require('md5');

var _md52 = _interopRequireDefault(_md5);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var log = (0, _createLogger2['default'])('save');

function saveFeed(feed) {
  var s3 = (0, _s3Utils.getS3)();

  return getIndex(s3).then(function (index) {
    // Pull the latest 30 items from the feed, and save the rest for cleanup
    var newPosts = feed.slice(0, 30)

    // Filter to just those that haven't already been saved to S3
    .filter(function (post) {
      return !index.hasOwnProperty(post.guid);
    });

    var oldPosts = feed.slice(30);

    // Begin the save operation for each post, resulting in a promise array
    var promises = newPosts.map(function (post) {
      return savePost(s3, post);
    });

    // Clean up the old posts, and add the promises to the list
    promises = promises.concat(oldPosts.reduce(function (currentValue, post) {
      if (index.hasOwnProperty(post.guid)) {
        return currentValue.concat([removePost(s3, post)]);
      }

      return currentValue;
    }, []));

    // Return a promise that resolves when all posts have been processed
    return Promise.all(promises)

    // Now add each new post to the index
    .then(function () {
      return newPosts.reduce(function (indexMemo, post) {
        return addToIndex(indexMemo, post);
      }, index);
    })

    // Remove old posts from the index
    .then(function (newIndex) {
      return oldPosts.reduce(function (indexMemo, post) {
        return (0, _lodash.omit)(indexMemo, post.guid);
      }, newIndex);
    })

    // Save the new index
    .then(function (newIndex) {
      return saveIndex(s3, newIndex);
    });
  })['catch'](function (err) {
    log.error(err);
  });
}

function getIndex(s3) {
  // TODO: Use callS3() for this
  return new Promise(function (resolve, reject) {
    s3.getObject({ Key: 'posts/index.json' }, function (err, data) {
      if (err) {
        if (err.code === 'NoSuchKey') {
          // If the index doesn't exist, then resolve the promise with an empty
          // index object
          resolve({});
        } else {
          // Allow any other errors to be handled by the promise consumer
          reject(err);
        }
      } else {
        resolve(JSON.parse(data.Body));
      }
    });
  });
}

function addToIndex(index, post) {
  var entry = {};

  entry[post.guid] = {
    unixDate: (0, _moment2['default'])(post.pubDate).valueOf(),
    path: 'posts/' + (0, _md52['default'])(post.guid) + '.md'
  };

  return _extends({}, index, entry);
}

function saveIndex(s3, index) {
  return (0, _s3Utils.callS3)(s3, 'upload', {
    Key: 'posts/index.json',
    Body: JSON.stringify(index)
  });
}

function toMarkdown(post) {
  // Exclude the description when creating the post metadata
  var metadata = _jsYaml2['default'].safeDump((0, _lodash.omit)(post, 'description'));
  return '---\n' + metadata + '---\n' + post.description + '\n';
}

function savePost(s3, post) {
  return (0, _s3Utils.callS3)(s3, 'upload', {
    Key: 'posts/' + (0, _md52['default'])(post.guid) + '.md',
    Body: toMarkdown(post)
  });
}

function removePost(s3, post) {
  return (0, _s3Utils.callS3)(s3, 'deleteObject', {
    Key: 'posts/' + (0, _md52['default'])(post.guid) + '.md'
  });
}
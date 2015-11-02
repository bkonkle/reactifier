'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateSite = generateSite;
exports.renderIndex = renderIndex;
exports.renderFeed = renderFeed;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _save = require('./save');

var _s3Utils = require('./s3-utils');

var _react = require('react');

var _createLogger = require('./create-logger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _frontMatter = require('front-matter');

var _frontMatter2 = _interopRequireDefault(_frontMatter);

var _componentsIndex = require('./components/index');

var _componentsIndex2 = _interopRequireDefault(_componentsIndex);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _rss = require('rss');

var _rss2 = _interopRequireDefault(_rss);

var log = (0, _createLogger2['default'])('generate');

function generateSite() {
  var s3 = (0, _s3Utils.getS3)();

  var missingItems = [];

  return (0, _save.getIndex)(s3)

  // Get a promise for each of the posts
  .then(function (index) {

    var promises = Object.keys(index).map(function (guid) {
      return (0, _s3Utils.callS3)(s3, 'getObject', { Key: index[guid].path })

      // Catch errors for missing files
      ['catch'](function (error) {
        if (error.code === 'NoSuchKey') {
          // Add it to the list that should be removed from the index
          missingItems.push(guid);
        } else {
          throw error;
        }
      });
    });

    return Promise.all(promises)

    // Remove the missing files from the index
    .then(function (posts) {
      if ((0, _lodash.isEmpty)(missingItems)) return posts;

      var newIndex = missingItems.reduce(function (indexMemo, guid) {
        return (0, _lodash.omit)(indexMemo, guid);
      }, index);

      return (0, _save.saveIndex)(s3, newIndex)

      // Pass the posts through the promise
      .then(function () {
        return posts;
      });
    });
  })

  // Map each post to the frontMatter reader to create a context
  .then(function (posts) {
    // Pull the body from each post
    var postData = (0, _lodash.compact)(posts).map(function (file) {
      return file.Body.toString();
    })

    // Convert the posts to structured data with front-matter
    .map(_frontMatter2['default']);

    // Render the index component and the rss feed with the context
    var index = renderIndex(postData);
    var feed = renderFeed(postData);

    return { index: index, feed: feed };
  })['catch'](function (err) {
    log.error(err);
  });
}

function renderIndex(posts) {
  return (0, _react.renderToStaticMarkup)((0, _react.createElement)(_componentsIndex2['default'], { posts: posts }));
}

function renderFeed(posts) {
  var feed = new _rss2['default']({
    title: _package2['default'].title,
    description: _package2['default'].description,
    /* eslint-disable camelcase */
    feed_url: 'http://reactifier.com/rss.xml',
    site_url: 'http://reactifier.com',
    /* eslint-enable camelcase */
    language: 'en',
    categories: ['React', 'React.js', 'JavaScript', 'Node'],
    pubDate: (0, _moment2['default'])().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    ttl: '60'
  });

  posts.forEach(function (post) {
    var attributes = post.attributes;
    var body = post.body;
    var author = attributes.author;
    var guid = attributes.guid;
    var link = attributes.link;
    var pubDate = attributes.pubDate;
    var subscription = attributes.subscription;
    var title = attributes.title;

    feed.item({
      title: title,
      description: body,
      url: link,
      guid: guid,
      categories: ['React', 'React.js', 'JavaScript', 'Node'],
      author: author || subscription && subscription.title,
      date: (0, _moment2['default'])(pubDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    });
  });

  return feed.xml({ indent: true });
}
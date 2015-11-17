'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateSite = generateSite;
exports.renderIndex = renderIndex;
exports.renderFeed = renderFeed;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _reactDomServer = require('react-dom/server');

var _componentsIndex = require('./components/index');

var _componentsIndex2 = _interopRequireDefault(_componentsIndex);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _rss = require('rss');

var _rss2 = _interopRequireDefault(_rss);

function generateSite(posts) {
  // Render the index component and the rss feed with the context
  var index = renderIndex(posts);
  var feed = renderFeed(posts);

  return { index: index, feed: feed };
}

function renderIndex(posts) {
  return (0, _reactDomServer.renderToStaticMarkup)((0, _react.createElement)(_componentsIndex2['default'], { posts: posts }));
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
    var author = post.author;
    var guid = post.guid;
    var link = post.link;
    var pubDate = post.pubDate;
    var title = post.title;
    var description = post.description;
    var subscription = post.subscription;

    feed.item({
      title: title,
      description: description,
      url: link,
      guid: guid,
      categories: ['React', 'React.js', 'JavaScript', 'Node'],
      author: author || subscription && subscription.title,
      date: (0, _moment2['default'])(pubDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    });
  });

  return feed.xml({ indent: true });
}
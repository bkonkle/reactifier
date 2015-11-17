'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getSubscriptionFeed = getSubscriptionFeed;
exports.requestPosts = requestPosts;
exports.transformPost = transformPost;
exports.combineFeeds = combineFeeds;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _feedparser = require('feedparser');

var _feedparser2 = _interopRequireDefault(_feedparser);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _subscriptions = require('../subscriptions');

var _subscriptions2 = _interopRequireDefault(_subscriptions);

var PER_FEED_LIMIT = 5;

function getSubscriptionFeed() {
  var subs = arguments.length <= 0 || arguments[0] === undefined ? _subscriptions2['default'] : arguments[0];

  // For each feed, request the posts
  var feeds = subs.map(function (subscription) {
    return requestPosts(subscription)

    // Transform each post to include just the data we need
    .then(function (posts) {

      // Return a copy of the subscription object with a new property to hold
      // posts
      return _extends({}, subscription, {
        posts: posts.map(transformPost)
      });
    });
  });

  // Return a promise that will resolve when all of the feed promises are
  // resolved
  return Promise.all(feeds)

  // After each feed has been transformed, combine them into one
  .then(function (transformedFeeds) {
    return transformedFeeds.reduce(combineFeeds, []);
  });
}

function requestPosts(subscription) {
  var title = subscription.title;
  var feedLink = subscription.feedLink;

  var req = (0, _request2['default'])(feedLink);
  var feedparser = new _feedparser2['default']();

  // Return a promise that will resolve when the feed is retrieved
  return new Promise(function (resolve, reject) {
    req.on('error', reject);

    req.on('response', function handleResponse(res) {
      // When the response comes back, check to make sure it is good
      if (res.statusCode !== 200) {
        var error = new Error('Received a status code of ' + res.statusCode + ' from feed ' + title);
        return this.emit('error', error);
      }

      // Then pipe the stream to feedparser
      this.pipe(feedparser);
    });

    // Set up an array to hold posts
    var posts = [];

    feedparser.on('error', reject);

    feedparser.on('readable', function onReadable() {
      var post = this.read();

      while (post) {
        // When feedparser has posts, add them to the posts array
        posts.push(post);
        post = this.read();
      }
    });

    // When the stream is done, resolve the promise with the retrieved posts
    feedparser.on('end', function () {
      return resolve(posts);
    });
  });
}

function transformPost(post) {
  var title = post.title;
  var link = post.link;
  var author = post.author;
  var pubDate = post.pubDate;
  var guid = post.guid;
  var description = post.description;

  var preview = (0, _string2['default'])(description).stripTags().truncate(500).toString();

  // Return a subset of properties available on the post, along with a
  // truncated description that has had HTML tags stripped out of it.
  return { title: title, link: link, author: author, pubDate: pubDate, guid: guid, description: preview };
}

function combineFeeds(combined, feed) {
  var subscription = _lodash2['default'].omit(feed, 'posts');

  // Limit the number of posts per feed and add the subscription data
  var posts = feed.posts.slice(0, PER_FEED_LIMIT).map(function (post) {
    return _extends({}, post, { subscription: subscription });
  });

  // Combine the posts
  var result = combined.concat(posts);

  // Sort them by the pubDate in descending order, parsed by moment
  return _lodash2['default'].sortBy(result, function (post) {
    return -(0, _moment2['default'])(post.pubDate).valueOf();
  });
}
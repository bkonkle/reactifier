import FeedParser from 'feedparser';
import moment from 'moment';
import request from 'request';
import string from 'string';
import subscriptions from '../subscriptions';

export function getSubscriptionFeed() {
  // For each feed, request the posts
  const feeds = subscriptions.map(function(subscription) {
    return requestPosts(subscription)

      // Transform each post to include just the data we need
      .then(function(posts) {

        // Return a copy of the subscription object with a new property to hold
        // posts
        return Object.assign({}, subscription, {
          posts: posts.map(transformPost),
        });

      });

  });

  // Return a promise that will resolve when all of the feed promises are
  // resolved
  return Promise.all(feeds)

    // After each feed has been transformed, combine them into one
    .then(function(feeds) {
      return feeds.reduce(combineFeeds, []);
    });
}

export function requestPosts(subscription) {
  const {url, title} = subscription;
  const req = request(url);
  const feedparser = new FeedParser();

  // Return a promise that will resolve when the feed is retrieved
  return new Promise(function(resolve, reject) {
    req.on('error', reject);

    req.on('response', function(res) {
      // When the response comes back, check to make sure it is good
      if (res.statusCode !== 200) {
        const error = new Error(
          `Received a status code of ${res.statusCode} from feed ${title}`
        );
        return this.emit('error', error);
      }

      // Then pipe the stream to feedparser
      this.pipe(feedparser);
    });

    // Set up an array to hold posts
    const posts = [];

    feedparser.on('error', reject);

    feedparser.on('readable', function() {
      let post = this.read();

      while (post) {
        // When feedparser has posts, add them to the posts array
        posts.push(post);
        post = this.read();
      }
    });

    // When the stream is done, resolve the promise with the retrieved posts
    feedparser.on('end', () => resolve(posts));
  });
}

export function transformPost(post) {
  const {title, link, author, pubDate, guid, description} = post;
  const preview = string(description).stripTags().truncate(500).toString();

  // Return a subset of properties available on the post, along with a
  // truncated description that has had HTML tags stripped out of it.
  return {title, link, author, pubDate, guid, description: preview};
}

export function combineFeeds(combined, feed) {
  // Combine the posts
  const result = combined.concat(feed.posts);

  // Sort the result
  result.sort(function(a, b) {
    const pubDateA = moment(a.pubDate);
    const pubDateB = moment(b.pubDate);

    if (pubDateA.isBefore(pubDateB)) {
      return 1;
    } else if (pubDateA.isAfter(pubDateB)) {
      return -1;
    } else if (pubDateA.isSame(pubDateB)) {
      return 0;
    } else {
      throw new Error(`Date comparison between ${a} and ${b} failed.`);
    }
  });

  return result;
}
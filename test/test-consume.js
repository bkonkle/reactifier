import {getFacebookTestUtils, cleanUpNock} from './utils';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import facebookPosts from './fixtures/facebookPosts';
import konklePosts from './fixtures/konklePosts';
import proxyquire from 'proxyquire';

chai.use(chaiAsPromised);

describe('consume', function() {

  const subscriptions = [
    {
      title: 'Official React Blog',
      description: 'Facebook\'s official React Blog feed',
      url: 'https://facebook.github.io/react/feed.xml',
    },
    {
      title: 'Brandon Konkle\'s Blog',
      description: 'React posts by Brandon Konkle',
      url: 'http://konkle.us/tag/react/rss',
    },
  ];

  const {
    getSubscriptionFeed,
    requestPosts,
    transformPost,
    combineFeeds,
  } = proxyquire('../src/consume', {
    '../subscriptions': subscriptions,
  });

  const {facebookFeed} = getFacebookTestUtils();

  cleanUpNock();

  describe('getSubscriptionFeed()', function() {

    it('retrieves each subscribed feed and returns an array of normalized posts', function() {
      const promise = getSubscriptionFeed();
      return expect(promise).to.eventually.have.length(13);
    });

  });

  describe('requestPosts()', function() {

    it('retrieves a specific feed and returns a promise for the posts', function() {
      const promise = requestPosts(subscriptions[0])

        // Convert to and from JSON so that the output matches what's expected
        .then((posts) => JSON.stringify(posts))
        .then((posts) => JSON.parse(posts));

      return expect(promise).to.eventually.deep.equal(facebookPosts);
    });

    it('constructs the request correctly based on the url specified in the subscription', function() {
      return requestPosts(subscriptions[0])

        // Wait for the request to complete, and use nock to verify that the
        // request was made correctly
        .then(() => expect(facebookFeed.isDone()).to.be.true);
    });

  });

  describe('transformPost()', function() {

    it('transforms a post to just include the set of metadata needed and the post preview', function() {
      const result = transformPost(facebookPosts[0]);

      expect(result).to.deep.equal({
        title: 'New React Developer Tools',
        link: 'https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html',
        author: null,
        pubDate: '2015-09-02T07:00:00.000Z',
        guid: 'https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html',
        description: 'A month ago, we posted a beta of the new React developer tools. Today, we&#39;re releasing the first stable version of the new devtools. We&#39;re calling it version 0.14, but it&#39;s a full rewrite so we think of it more like a 2.0 release.\n\n\n\nIt contains a handful of new features, including:\n\n\nBuilt entirely with React, making it easier to develop and extend\nFirefox support\nSelected component instance is available as $r from the console\nMore detail is shown in props in the component tree...' }
      );
    });

  });

  describe('combineFeeds()', function() {

    const facebook = facebookPosts.map(transformPost);
    const konkle = konklePosts.map(transformPost);

    it('reduces a subscription into a an array of posts', function() {
      const result = combineFeeds([], {posts: konklePosts});
      expect(result).to.deep.equal(konklePosts);
    });

    it('merges new posts into the existing array of posts, sorted in descending order by date', function() {
      const result = combineFeeds(facebook, {posts: konkle});

      expect(result).to.deep.equal([
        konkle[0],
        facebook[0],
        facebook[1],
        facebook[2],
        facebook[3],
        facebook[4],
        facebook[5],
        facebook[6],
        facebook[7],
        facebook[8],
        facebook[9],
        konkle[1],
        konkle[2],
      ]);
    });

    it('shouldn\'t take too long', function() {
      // Since mocha times out at 2 seconds, this test will fail if the combine
      // feeds function takes longer than 2 seconds for 1000 feeds
      for (let i = 0; i < 1000; i++) {
        combineFeeds(facebook, {posts: konkle});
      }
    });

    it('adds metadata to each post describing the feed it came from');

  });

});

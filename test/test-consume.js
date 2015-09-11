import {getFacebookTestUtils, cleanUpNock} from './utils';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import facebookPosts from './fixtures/facebook-posts';
import konklePosts from './fixtures/konkle-posts';
import samplePost from './fixtures/sample-post';
import subscriptions from './fixtures/subscriptions';
import proxyquire from 'proxyquire';

chai.use(chaiAsPromised);

describe('consume', function() {

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
      expect(result).to.deep.equal(samplePost);
    });

  });

  describe('combineFeeds()', function() {

    const transformedFacebook = facebookPosts.map(function(post) {
      return Object.assign({}, transformPost(post), {subscription: subscriptions[0]});
    });

    const transformedKonkle = konklePosts.map(function(post) {
      return Object.assign({}, transformPost(post), {subscription: subscriptions[1]});
    });

    it('reduces a subscription into a an array of posts with extra metadata describing the original feed', function() {
      const expectedPosts = konklePosts.map(function(post) {
        return Object.assign({}, post, {
          subscription: subscriptions[1],
        });
      });

      const feed = Object.assign({}, subscriptions[1], {posts: expectedPosts});
      const result = combineFeeds([], feed);

      expect(result).to.deep.equal(expectedPosts);
    });

    it('merges new posts into the existing array of posts, sorted in descending order by date', function() {
      const feed = Object.assign({}, subscriptions[1], {posts: transformedKonkle});
      const result = combineFeeds(transformedFacebook, feed);

      expect(result).to.deep.equal([
        transformedKonkle[0],
        transformedFacebook[0],
        transformedFacebook[1],
        transformedFacebook[2],
        transformedFacebook[3],
        transformedFacebook[4],
        transformedFacebook[5],
        transformedFacebook[6],
        transformedFacebook[7],
        transformedFacebook[8],
        transformedFacebook[9],
        transformedKonkle[1],
        transformedKonkle[2],
      ]);
    });

    it('shouldn\'t take too long', function() {
      // Since mocha times out at 2 seconds, this test will fail if the combine
      // feeds function takes longer than 2 seconds for 1000 feeds
      for (let i = 0; i < 1000; i++) {
        combineFeeds(transformedFacebook, {posts: transformedKonkle});
      }
    });

  });

});

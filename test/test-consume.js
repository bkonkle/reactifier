import {getFacebookFeed, getKonkleFeed, cleanUpNock} from './utils'
import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import facebookPosts from './fixtures/facebook-posts'
import konklePosts from './fixtures/konkle-posts'
import proxyquire from 'proxyquire'
import samplePost from './fixtures/sample-post'
import subscriptions from './fixtures/subscriptions'

chai.use(chaiAsPromised)

describe('consume', () => {

  const {
    getSubscriptionFeed,
    requestPosts,
    transformPost,
    combineFeeds,
  } = proxyquire('../src/consume', {
    '../subscriptions': subscriptions,
  })

  const facebookFeed = getFacebookFeed()
  getKonkleFeed()

  cleanUpNock()

  describe('getSubscriptionFeed()', () => {

    it('retrieves each subscribed feed and returns an array of normalized posts', () => {
      const promise = getSubscriptionFeed()
      return expect(promise).to.eventually.have.length(13)
    })

  })

  describe('requestPosts()', () => {

    it('retrieves a specific feed and returns a promise for the posts', () => {
      const promise = requestPosts(subscriptions[0])

        // Convert to and from JSON so that the output matches what's expected
        .then(posts => JSON.stringify(posts))
        .then(posts => JSON.parse(posts))

      return expect(promise).to.eventually.deep.equal(facebookPosts)
    })

    it('constructs the request correctly based on the url specified in the subscription', () => {
      return requestPosts(subscriptions[0])

        // Wait for the request to complete, and use nock to verify that the
        // request was made correctly
        .then(() => expect(facebookFeed.isDone()).to.be.true)
    })

  })

  describe('transformPost()', () => {

    it('transforms a post to just include the set of metadata needed and the post preview', () => {
      const result = transformPost(facebookPosts[0])
      expect(result).to.deep.equal(samplePost)
    })

  })

  describe('combineFeeds()', () => {

    const transformedFacebook = facebookPosts.map(post => {
      return Object.assign({}, transformPost(post), {subscription: subscriptions[0]})
    })

    const transformedKonkle = konklePosts.map(post => {
      return Object.assign({}, transformPost(post), {subscription: subscriptions[1]})
    })

    it('reduces a subscription into a an array of posts with extra metadata describing the original feed', () => {
      const expectedPosts = konklePosts.map(post => {
        return Object.assign({}, post, {
          subscription: subscriptions[1],
        })
      })

      const feed = Object.assign({}, subscriptions[1], {posts: expectedPosts})
      const result = combineFeeds([], feed)

      expect(result).to.deep.equal(expectedPosts)
    })

    it('merges new posts into the existing array of posts, sorted in descending order by date', () => {
      const feed = Object.assign({}, subscriptions[1], {posts: transformedKonkle})
      const result = combineFeeds(transformedFacebook, feed)

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
      ])
    })

  })

})

import fs from 'fs'
import path from 'path'
import md5 from 'md5'
import nock from 'nock'
import sampleFeed from './fixtures/sample-feed'

export function getFacebookFeed() {
  // Set up a nock request/response mock
  const facebookFeed = nock('https://facebook.github.io')

  const facebookResponse = fs.readFileSync(
    path.join(__dirname, 'fixtures/facebook.xml')
  ).toString()

  beforeEach(() => {
    // Intercept get requests for the feed
    facebookFeed.get('/react/feed.xml')

      // Reply with the facebook xml response
      .reply(200, facebookResponse)
  })

  return facebookFeed
}

export function getKonkleFeed() {
  const konkleFeed = nock('http://konkle.us')

  const konkleResponse = fs.readFileSync(
    path.join(__dirname, 'fixtures/konkle.xml')
  ).toString()

  beforeEach(() => {
    konkleFeed.get('/tag/react/rss')

      .reply(200, konkleResponse)
  })

  return konkleFeed
}

export function cleanUpNock() {
  // Clean up between tests
  afterEach(() => {
    nock.cleanAll()
  })

  // Clean up when the suite is done
  after(() => {
    nock.restore()
  })
}

export function getMockS3() {
  const sampleMarkdown = fs.readFileSync(path.join(
    __dirname,
    'fixtures',
    'sample-post.md'
  )).toString()

  const guid = 'https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html'

  const sampleIndex = {}
  sampleIndex[guid] = {
    unixDate: 1441177200000,
    path: `posts/${md5(guid)}.md`,
  }

  // Set up a reference to a mock S3 interface which can be implemented by each
  // test as needed
  let mockS3 = {}

  afterEach(() => {
    // Reset the mock
    mockS3 = {}
  })

  return {sampleMarkdown, sampleIndex, mockS3}
}

export function getSampleFeed() {
  const sampleFeedXml = fs.readFileSync(path.join(
    __dirname,
    'fixtures',
    'sample-feed.xml'
  )).toString()
  return {sampleFeed, sampleFeedXml}
}

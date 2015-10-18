import {getMockS3, getSampleFeed} from './utils'
import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import md5 from 'md5'
import proxyquire from 'proxyquire'
import samplePost from './fixtures/sample-post'
import MockIndex from './fixtures/mock-index'

chai.use(chaiAsPromised)

describe('generate', () => {

  const expectedHtml = '<html><body>New React Developer Tools</body></html>'

  const {sampleIndex, sampleMarkdown, mockS3} = getMockS3()
  const {sampleFeed, sampleFeedXml} = getSampleFeed()

  const {generateSite, renderIndex, renderFeed} = proxyquire('../src/generate', {
    './s3-utils': {getS3: () => mockS3},
    './components/index': MockIndex,
  })

  describe('generateSite()', () => {

    it('retrieves the index', () => {
      let called = false

      mockS3.getObject = (options, callback) => {
        // For this test, we only care about the first time it's called
        if (!called) {
          called = true
          expect(options.Key).to.equal('posts/index.json')
          callback(undefined, {Body: JSON.stringify(sampleIndex)})
        } else {
          // The second getObject call should be for the file itself, expecting
          // markdown content
          callback(undefined, {Body: sampleMarkdown})
        }
      }

      return generateSite().then(() => {
        expect(called).to.be.true
      })
    })

    it('iterates over each post and retrieves the content', () => {
      let called = false

      mockS3.getObject = (options, callback) => {
        if (options.Key === 'posts/index.json') {
          callback(undefined, {Body: JSON.stringify(sampleIndex)})
        } else {
          expect(options.Key).to.equal(`posts/${md5(samplePost.guid)}.md`)

          called = true

          // Return the markdown from the file
          callback(undefined, {Body: sampleMarkdown})
        }
      }

      return generateSite().then(() => {
        expect(called).to.be.true
      })
    })

    it('generates a homepage using React', () => {
      mockS3.getObject = (options, callback) => {
        if (options.Key === 'posts/index.json') {
          // Return the sample index
          callback(undefined, {Body: JSON.stringify(sampleIndex)})
        } else {
          // Return the markdown from the file
          callback(undefined, {Body: sampleMarkdown})
        }
      }

      const result = generateSite()

      return expect(result).to.eventually.have.property('index', expectedHtml)
    })

  })

  describe('renderIndex()', () => {

    it('takes a context object and uses it to render the React index component', () => {
      // Render it with a fake context that fills in the title, used by the fake
      // component shimmed in with proxyquire
      const result = renderIndex([{
        attributes: {title: 'New React Developer Tools'},
        body: '',
      }])

      expect(result).to.equal(expectedHtml)
    })

  })

  describe('renderFeed()', () => {

    it('takes a collection of post data and uses it to render the rss feed', () => {
      const result = renderFeed(sampleFeed)

      const expectedResult = result

        // Fix the feed date because moment() returns the time now
        .replace(/<lastBuildDate>.*<\/lastBuildDate>/g, '<lastBuildDate>Tue, 15 Sep 2015 22:45:00 GMT</lastBuildDate>')
        .replace(/<pubDate>.*<\/pubDate>\n {8}<language>/g, '<pubDate>Tue, 15 Sep 2015 22:45:00 GMT</pubDate>\n        <language>')

      expect(expectedResult).to.equal(sampleFeedXml)
    })

  })

})

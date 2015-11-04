import {getMockS3, getSampleFeed} from './utils'
import expect from 'expect'
import proxyquire from 'proxyquire'
import samplePost from './fixtures/sample-post'

describe('generate', () => {

  const {mockS3} = getMockS3()
  const {sampleFeed, sampleFeedXml} = getSampleFeed()

  const {generateSite, renderIndex, renderFeed} = proxyquire('../src/generate', {
    './s3-utils': {getS3: () => mockS3},
  })

  describe('generateSite()', () => {

    it('takes an array of posts and generates a homepage using React', () => {
      return generateSite([samplePost]).then(({index}) => {
        expect(index).toInclude(`<a href="${samplePost.link}">${samplePost.title}</a>`)
        expect(index).toInclude(`<section>${samplePost.description}...<a class="read-more" href="${samplePost.link}">» read more</a></section>`)
      })
    })

  })

  describe('renderIndex()', () => {

    // TODO: Needs to be rewritten to use the actual index component
    it.skip('takes a context object and uses it to render the React index component', () => {
      // Render it with a fake context that fills in the title, used by the fake
      // component shimmed in with proxyquire
      const result = renderIndex([{
        attributes: {title: 'New React Developer Tools'},
        body: '',
      }])

      expect(result).to.equal('FIXME')
    })

  })

  describe('renderFeed()', () => {

    it('takes a collection of post data and uses it to render the rss feed', () => {
      const result = renderFeed(sampleFeed)

      const expectedResult = result

        // Fix the feed date because moment() returns the time now
        .replace(/<lastBuildDate>.*<\/lastBuildDate>/g, '<lastBuildDate>Tue, 15 Sep 2015 22:45:00 GMT</lastBuildDate>')
        .replace(/<pubDate>.*<\/pubDate>\n {8}<language>/g, '<pubDate>Tue, 15 Sep 2015 22:45:00 GMT</pubDate>\n        <language>')

        // Add a newline at the end so it matches the sample xml
        + '\n'

      expect(expectedResult).to.equal(sampleFeedXml)
    })

  })

})

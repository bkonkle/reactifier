import {getMockS3, getSampleFeed} from './utils'
import chai, {expect} from 'chai'
import jsxChai from 'jsx-chai'
import proxyquire from 'proxyquire'

chai.use(jsxChai)

describe('generate', () => {

  const {mockS3} = getMockS3()
  const {sampleFeed, sampleFeedXml} = getSampleFeed()

  const {generateSite, renderIndex, renderFeed} = proxyquire('../src/generate', {
    './s3-utils': {getS3: () => mockS3},
  })

  const renderedPost = '<article><h2><a href="https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html">New React Developer Tools</a></h2><section><p>A month ago, we posted a beta of the new React developer tools. Today, we&#x27;re releasing the first stable version of the new devtools. We&#x27;re calling it version 0.14, but it&#x27;s a full rewrite so we think of it more like a 2.0 release.\n\n\n\nIt contains a handful of new features, including:\n\n\nBuilt entirely with React, making it easier to develop and extend\nFirefox support\nSelected component instance is available as $r from the console\nMore detail is shown in props in the component tree... <a class="read-more" href="https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html">» read more</a></p></section><footer>From <a href="http://facebook.github.io/react/blog/">Official React Blog</a> <time class="post-date" datetime="2015-09-02">September 2nd, 2015</time></footer></article>'

  describe('generateSite()', () => {

    it('takes an array of posts and generates a homepage using React', () => {
      const {index, feed} = generateSite(sampleFeed)

      const cleanedFeed = feed

        // Fix the feed date because moment() returns the time now
        .replace(/<lastBuildDate>.*<\/lastBuildDate>/g, '<lastBuildDate>Tue, 15 Sep 2015 22:45:00 GMT</lastBuildDate>')
        .replace(/<pubDate>.*<\/pubDate>\n {8}<language>/g, '<pubDate>Tue, 15 Sep 2015 22:45:00 GMT</pubDate>\n        <language>')

        // Add a newline at the end so it matches the sample xml
        + '\n'

      expect(index).to.include(renderedPost)
      expect(cleanedFeed).to.equal(sampleFeedXml)
    })

  })

  describe('renderIndex()', () => {

    it('takes a context object and uses it to render the React index component', () => {
      const result = renderIndex(sampleFeed)
      expect(result).to.include(renderedPost)
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

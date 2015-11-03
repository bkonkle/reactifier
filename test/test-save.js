import {getMockS3} from './utils'
import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import md5 from 'md5'
import proxyquire from 'proxyquire'
import samplePost from './fixtures/sample-post'

chai.use(chaiAsPromised)

describe('save', () => {
  const {sampleMarkdown, mockS3} = getMockS3()

  const {saveFeed, toMarkdown, savePost} = proxyquire('../src/save', {
    './s3-utils': {
      getS3: () => mockS3,
    },
  })

  describe('saveFeed()', () => {

    it('calls s3.upload for each new post', () => {
      let called = false

      mockS3.upload = (options, callback) => {
        called = true

        expect(options.Key).to.equal(`posts/${md5(samplePost.guid)}.md`)
        expect(options.Body).to.equal(sampleMarkdown)

        // Send an empty response, because this isn't important
        callback(undefined, {})
      }

      const result = saveFeed([samplePost])

      // The result should be an array with the Location response
      return result.then(() => {
        expect(called).to.be.true
      })
    })

    it('only saves the latest 30 posts')

    it('cleans up old posts')

  })

  describe('toMarkdown()', () => {

    it('takes a post and converts it to markdown', () => {
      const result = toMarkdown(samplePost)
      expect(result).to.equal(sampleMarkdown)
    })

  })

  describe('savePost()', () => {

    it('takes a filename and content, and saves the post to S3', () => {
      const response = {}

      mockS3.upload = (options, callback) => {
        expect(options.Key).to.equal(`posts/${md5(samplePost.guid)}.md`)
        expect(options.Body).to.equal(sampleMarkdown)
        callback(undefined, response)
      }

      const promise = savePost(mockS3, samplePost)

      return expect(promise).to.eventually.equal(response)
    })

  })

})

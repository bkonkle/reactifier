import {getMockS3} from './utils'
import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import md5 from 'md5'
import proxyquire from 'proxyquire'
import samplePost from './fixtures/sample-post'

chai.use(chaiAsPromised)

describe('save', () => {
  const {sampleMarkdown, sampleIndex, mockS3} = getMockS3()

  const {
    saveFeed,
    getIndex,
    addToIndex,
    saveIndex,
    toMarkdown,
    savePost,
  } = proxyquire('../src/save', {
    './s3-utils': {
      getS3: () => mockS3,
    },
  })

  describe('saveFeed()', () => {

    const indexWithSamplePost = {
      'https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html': {
        unixDate: 1441177200000,
        path: 'posts/849e91628c7acbed1e6cee37ed7488ed.md',
      },
    }

    it('calls s3.getObject to get the index', () => {
      let called = false

      mockS3.getObject = (options, callback) => {
        called = true
        expect(options.Key).to.equal('posts/index.json')
        callback(undefined, {Body: JSON.stringify(sampleIndex)})
      }

      mockS3.upload = (options, callback) => {
        // Send an empty response, because this isn't important for this test
        callback(undefined, {})
      }

      return saveFeed([samplePost]).then(() => {
        expect(called).to.be.true
      })
    })

    it('calls s3.upload for each new post', () => {
      let called = false

      mockS3.getObject = (options, callback) => {
        // Return an empty index
        callback(undefined, {Body: JSON.stringify({})})
      }

      mockS3.upload = (options, callback) => {
        called = true
        if (options.Key === 'posts/index.json') {
          // Send a Location just so that we can check the result below
          callback(undefined, {Location: 'posts/index.json'})
        } else {
          expect(options.Key).to.equal(`posts/${md5(samplePost.guid)}.md`)
          expect(options.Body).to.equal(sampleMarkdown)

          // Send an empty response, because this isn't important
          callback(undefined, {})
        }
      }

      const result = saveFeed([samplePost])

      // The result should be an array with the Location response
      return expect(result).to.eventually.deep.equal({Location: 'posts/index.json'})

        .then(() => {
          expect(called).to.be.true
        })
    })

    it('doesn\'t call s3.upload for posts that already exist in the index', () => {
      const newPost = {
        title: 'New Post',
        link: 'https://awesome.blog/awesome/post',
        author: null,
        pubDate: '2015-09-13T07:00:00.000Z',
        guid: 'https://awesome.blog/awesome/post',
        description: 'This are awesome thread. I are awesome post.',
      }

      mockS3.getObject = (options, callback) => {
        // Return an empty index
        callback(undefined, {Body: JSON.stringify(indexWithSamplePost)})
      }

      mockS3.upload = (options, callback) => {
        if (options.Key === 'posts/index.json') {
          // Send a Location just so that we can check the result below
          callback(undefined, {Location: 'posts/index.json'})
        } else {
          expect(options.Key).to.equal(`posts/${md5('https://awesome.blog/awesome/post')}.md`)

          // Send an empty response, because this isn't important
          callback(undefined, {})
        }
      }

      const result = saveFeed([samplePost, newPost])

      // The result should be an array with the Location response
      return expect(result).to.eventually.deep.equal({Location: 'posts/index.json'})
    })

    it('only saves the latest 30 posts')

    it('cleans up posts that aren\'t included in the latest 30')

    it('saves the new index', () => {
      const existingIndex = {
        'testGuid': {
          unixDate: 1441177200123,
          path: 'testPath',
        },
      }

      const expectedIndex = Object.assign({}, existingIndex, indexWithSamplePost)

      mockS3.getObject = (options, callback) => {
        // Return an index that already has an entry
        callback(undefined, {Body: JSON.stringify(existingIndex)})
      }

      mockS3.upload = (options, callback) => {
        if (options.Key === 'posts/index.json') {
          // Make sure the index looks like it's supposed to at this point
          expect(options.Body).to.equal(JSON.stringify(expectedIndex))

          // Send a Location just so that we can check the result below
          callback(undefined, {Location: 'posts/index.json'})
        } else {
          // Send an empty response, because this isn't important
          callback(undefined, {})
        }
      }

      const result = saveFeed([samplePost])

      // The result should be an array with the Location response
      return expect(result).to.eventually.deep.equal({Location: 'posts/index.json'})
    })

  })

  describe('getIndex()', () => {

    it('retrieves the current index', () => {
      mockS3.getObject = (options, callback) => {
        expect(options.Key).to.equal('posts/index.json')
        callback(undefined, {Body: JSON.stringify(sampleIndex)})
      }

      const promise = getIndex(mockS3)

      return expect(promise).to.eventually.deep.equal(sampleIndex)
    })

    it('returns a blank index if none exists in the bucket', () => {
      mockS3.getObject = (options, callback) => {
        expect(options.Key).to.equal('posts/index.json')
        callback({code: 'NoSuchKey'})
      }

      const promise = getIndex(mockS3)

      return expect(promise).to.eventually.deep.equal({})
    })

  })

  describe('addToIndex()', () => {

    it('creates a new index entry for the given post', () => {
      const index = {}
      const result = addToIndex(index, samplePost)
      expect(result).to.deep.equal(sampleIndex)
    })

    it('adds the new entry to existing entries', () => {
      const index = {test: 'test123'}

      const expectedIndex = Object.assign({}, index, sampleIndex)

      const result = addToIndex(index, samplePost)
      expect(result).to.deep.equal(expectedIndex)
    })

    it('doesn\'t mutate the index', () => {
      const index = {test: 'test123'}
      const expectedIndex = {test: 'test123'}

      addToIndex(index, samplePost)

      expect(index).to.deep.equal(expectedIndex)
    })

  })

  describe('saveIndex()', () => {

    it('saves a new index to the bucket', () => {
      const response = {}
      const index = {batman: 'forever'}

      mockS3.upload = (options, callback) => {
        expect(options.Key).to.equal('posts/index.json')
        expect(options.Body).to.equal(JSON.stringify(index))
        callback(undefined, response)
      }

      const promise = saveIndex(mockS3, index)

      return expect(promise).to.eventually.equal(response)
    })

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

  describe('removePost()', () => {

    it('removes a given post from S3')

  })

})

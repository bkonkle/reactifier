import {expect} from 'chai';
import md5 from 'md5';
import path from 'path';
import proxyquire from 'proxyquire';
import fs from 'fs';
import samplePost from './fixtures/sample-post';

describe('save', function() {
  const sampleMarkdown = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-post.md')).toString();

  const guid = 'https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html';

  const sampleIndex = {};
  sampleIndex[guid] = {
    unixDate: 1441177200000,
    path: `posts/${md5(guid)}.md`,
  };

  // Set up a reference to a mock S3 interface which can be implemented by each
  // test as needed
  let mockS3 = {};

  afterEach(function() {
    // Reset the mock
    mockS3 = {};
  });

  const {
    saveFeed,
    getIndex,
    addToIndex,
    saveIndex,
    toMarkdown,
    savePost,
  } = proxyquire('../src/save', {
    'aws-sdk': {
      S3: () => mockS3,
      config: {},
      SharedIniFileCredentials: () => null,
      '@noCallThru': true,
    },
  });

  describe('saveFeed()', function() {

    it('calls s3.getObject to get the index', function() {
      mockS3.getObject = function(options, callback) {
        expect(options.Key).to.equal('index.json');
        callback(undefined, {Body: JSON.stringify(sampleIndex)});
      };

      return saveFeed([samplePost]);
    });


    it('calls s3.upload for each new post', function() {
      mockS3.getObject = function(options, callback) {
        // Return an empty index
        callback(undefined, {Body: JSON.stringify({})});
      };

      mockS3.upload = function(options, callback) {
        expect(options.Key).to.equal(`posts/${md5(samplePost.guid)}.md`);
        expect(options.Body).to.equal(sampleMarkdown);

        // Return a Location (a real response would also include an ETag)
        callback(undefined, {Location: '/sample/location'});
      };

      const result = saveFeed([samplePost]);

      // The result should be an array with the Location response
      return expect(result).to.eventually.deep.equal([{Location: '/sample/location'}]);
    });
  });

  describe('getIndex()', function() {

    it('retrieves the current index', function() {
      mockS3.getObject = function(options, callback) {
        expect(options.Key).to.equal('index.json');
        callback(undefined, {Body: JSON.stringify(sampleIndex)});
      };

      const promise = getIndex(mockS3);

      return expect(promise).to.eventually.deep.equal(sampleIndex);
    });

    it('returns a blank index if none exists in the bucket', function() {
      mockS3.getObject = function(options, callback) {
        expect(options.Key).to.equal('index.json');
        callback({code: 'NoSuchKey'});
      };

      const promise = getIndex(mockS3);

      return expect(promise).to.eventually.deep.equal({});
    });

  });

  describe('addToIndex()', function() {

    it('creates a new index entry for the given post', function() {
      const index = {};
      const result = addToIndex(index, samplePost);
      expect(result).to.deep.equal(sampleIndex);
    });

    it('doesn\'t mutate the index', function() {
      const index = {test: 'test123'};
      const expectedIndex = {test: 'test123'};

      addToIndex(index, samplePost);

      expect(index).to.deep.equal(expectedIndex);
    });

  });

  describe('saveIndex()', function() {

    it('saves a new index to the bucket', function() {
      const response = {};
      const index = {batman: 'forever'};

      mockS3.upload = function(options, callback) {
        expect(options.Key).to.equal('index.json');
        expect(options.Body).to.equal(JSON.stringify(index));
        callback(undefined, response);
      };

      const promise = saveIndex(mockS3, index);

      return expect(promise).to.eventually.equal(response);
    });

  });

  describe('toMarkdown()', function() {

    it('takes a post and converts it to markdown', function() {
      const result = toMarkdown(samplePost);
      expect(result).to.equal(sampleMarkdown);
    });

  });

  describe('savePost()', function() {

    it('takes a filename and content, and saves the post to S3', function() {
      const response = {};

      mockS3.upload = function(options, callback) {
        expect(options.Key).to.equal(`posts/${md5(samplePost.guid)}.md`);
        expect(options.Body).to.equal(sampleMarkdown);
        callback(undefined, response);
      };

      const promise = savePost(mockS3, samplePost);

      return expect(promise).to.eventually.equal(response);
    });

  });

});

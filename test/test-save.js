import chai, {expect} from 'chai';
import path from 'path';
import proxyquire from 'proxyquire';
import fs from 'fs';
import samplePost from './fixtures/sample-post';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('save', function() {
  const awsSpy = sinon.spy();

  const {
    saveFeed,
    getIndex,
    toIndex,
    saveIndex,
    toMarkdown,
    savePost,
  } = proxyquire('../src/save', {'AWS': awsSpy});

  const sampleMarkdown = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-post.md')).toString();

  describe('saveFeed()', function() {

    it('takes an array of posts and converts them to markdown files if they are new');

    it('takes each post and determines the appropriate filename');

    it('gets the markdown for the post');

    it('saves the post markdown to the bucket');

    it('adds the post to the index and saves it');

  });

  describe('getIndex()', function() {

    it('retrieves the current index');

    it('creates a new index if none exists in the bucket');

  });

  describe('toIndex()', function() {

    it('creates a new index entry for the given post');

  });

  describe('saveIndex()', function() {

    it('saves a new index to the bucket');

  });

  describe('toMarkdown()', function() {

    it('takes a post and converts it to markdown', function() {
      const result = toMarkdown(samplePost);
      expect(result).to.equal(sampleMarkdown);
    });

  });

  describe('savePost()', function() {

    it('takes a filename and content, and saves the post to S3');

  });

});

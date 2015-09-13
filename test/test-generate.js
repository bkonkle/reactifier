import {getMockS3} from './utils';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import md5 from 'md5';
import proxyquire from 'proxyquire';
import samplePost from './fixtures/sample-post';
import MockIndex from './fixtures/mock-index';

chai.use(chaiAsPromised);

describe('generate', function() {

  const {sampleIndex, sampleMarkdown, mockS3} = getMockS3();

  const {generateSite, renderIndex} = proxyquire('../src/generate', {
    './s3-utils': {getS3: () => mockS3},
    './components/index': MockIndex,
  });

  describe('generateSite()', function() {

    it('retrieves the index', function() {
      let called = false;

      mockS3.getObject = function(options, callback) {
        // For this test, we only care about the first time it's called
        if (!called) {
          called = true;
          expect(options.Key).to.equal('index.json');
          callback(undefined, {Body: JSON.stringify(sampleIndex)});
        } else {
          // The second getObject call should be for the file itself, expecting
          // markdown content
          callback(undefined, sampleMarkdown);
        }
      };

      return generateSite().then(function() {
        expect(called).to.be.true;
      });
    });

    it('iterates over each post and retrieves the content', function() {
      let called = false;

      mockS3.getObject = function(options, callback) {
        if (options.Key === 'index.json') {
          callback(undefined, {Body: JSON.stringify(sampleIndex)});
        } else {
          expect(options.Key).to.equal(`posts/${md5(samplePost.guid)}.md`);

          called = true;

          // Return the markdown from the file
          callback(undefined, sampleMarkdown);
        }
      };

      return generateSite().then(function() {
        expect(called).to.be.true;
      });
    });

    it('generates a homepage using React', function() {
      mockS3.getObject = function(options, callback) {
        if (options.Key === 'index.json') {
          // Return the sample index
          callback(undefined, {Body: JSON.stringify(sampleIndex)});
        } else {
          // Return the markdown from the file
          callback(undefined, sampleMarkdown);
        }
      };

      expect(generateSite()).to.eventually.equal('<html><body>New React Developer Tools</body></html>');
    });

  });

  describe('renderIndex()', function() {

    it('takes a context object and uses it to render the React index component', function() {
      // Render it with a fake context that fills in the title, used by the fake
      // component shimmed in with proxyquire
      const result = renderIndex([{
        attributes: {title: 'New React Developer Tools'},
        body: '',
      }]);

      expect(result).to.equal('<html><body>New React Developer Tools</body></html>');
    });

  });

});

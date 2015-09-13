import {getIndex} from './save';
import {getS3, callS3} from './s3-utils';
import {renderToStaticMarkup, createElement} from 'react';
import createLogger from './create-logger';
import frontMatter from 'front-matter';
import Index from './components/index';

const log = createLogger('generate');

export function generateSite() {
  const s3 = getS3();

  return getIndex(s3)

    // Get a promise for each of the posts
    .then(function(index) {
      const promises = Object.keys(index).map(function(guid) {
        return callS3(s3, 'getObject', {Key: index[guid].path});
      });

      return Promise.all(promises);
    })

    // Map each post to the frontMatter reader to create a context
    .then(function(posts) {
      return posts

        // Pull the body from each post
        .map(file => file.Body.toString())

        // Convert the posts to structured data with front-matter
        .map(frontMatter);
    })

    // Render the index component with the context
    .then(renderIndex)

    .catch(function(err) {
      log.error(err);
    });
}

export function renderIndex(posts) {
  return renderToStaticMarkup(createElement(Index, {posts}));
}

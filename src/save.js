import {omit} from 'lodash';
import AWS from 'aws-sdk';
import createLogger from './create-logger';
import md5 from 'md5';
import moment from 'moment';
import yaml from 'js-yaml';

const log = createLogger('save');

export function saveFeed(feed) {
  // Make sure the desired AWS credentials profile is used, even if the env var
  // isn't available right away (such as when dotenv is used)
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});

  const s3 = new AWS.S3({params: {Bucket: process.env.S3_BUCKET}});

  return getIndex(s3)

    // When the index is retrieved, it's time to begin saving new posts
    .then(function(index) {
      const promises = [];

      feed.forEach(function(post) {
        if (!index.hasOwnProperty(post.guid)) {
          // If the post is not yet in the index, save it and add it to the index
          const promise = savePost(s3, post)

            .then(function() {
              // Now that the post is saved, add it to the index
              const newIndex = addToIndex(index, post);

              // Return the promise from saveIndex
              return saveIndex(s3, newIndex).then(value => {
                return value;
              });
            })

            .catch(function(err) {
              log.error(err);
            });

          // Add the promise to the array of promises to wait for
          promises.push(promise);
        }
      });

      // Return a promise that resolves when all of the posts have been saved
      return Promise.all(promises);
    });
}

export function getIndex(s3) {
  return new Promise(function(resolve, reject) {
    s3.getObject({Key: 'index.json'}, function(err, data) {
      if (err) {
        if (err.code === 'NoSuchKey') {
          // If the index doesn't exist, then resolve the promise with an empty
          // index object
          resolve({});
        } else {
          // Allow any other errors to be handled by the promise consumer
          reject(err);
        }
      } else {
        resolve(JSON.parse(data.Body));
      };
    });
  });
}

export function addToIndex(index, post) {
  const entry = {};

  entry[post.guid] = {
    unixDate: moment(post.pubDate).valueOf(),
    path: `posts/${md5(post.guid)}.md`,
  };

  return Object.assign({}, index, entry);
}

export function saveIndex(s3, index) {
  return new Promise(function(resolve, reject) {
    s3.upload({
      Key: 'index.json',
      Body: JSON.stringify(index),
    }, function(err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

export function toMarkdown(post) {
  // Exclude the metadata when creatin ghte post metadata
  const metadata = yaml.safeDump(omit(post, 'description'));
  return `---\n${metadata}---\n${post.description}\n`;
}

export function savePost(s3, post) {
  return new Promise(function(resolve, reject) {
    s3.upload({
      Key: `posts/${md5(post.guid)}.md`,
      Body: toMarkdown(post),
    }, function(err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

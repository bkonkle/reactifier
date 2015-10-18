import {omit} from 'lodash'
import createLogger from './create-logger'
import {getS3, callS3} from './s3-utils'
import md5 from 'md5'
import moment from 'moment'
import yaml from 'js-yaml'

const log = createLogger('save')

export function saveFeed(feed) {
  const s3 = getS3()

  return getIndex(s3)

    .then(index => {
      // Pull the latest 30 items from the feed, and save the rest for cleanup
      const newPosts = feed.slice(0, 30)

        // Filter to just those that haven't already been saved to S3
        .filter(post => !index.hasOwnProperty(post.guid))

      const oldPosts = feed.slice(30)

      // Begin the save operation for each post, resulting in a promise array
      let promises = newPosts.map(post => savePost(s3, post))

      // Clean up the old posts, and add the promises to the list
      promises = promises.concat(oldPosts.reduce((currentValue, post) => {
        if (index.hasOwnProperty(post.guid)) {
          return currentValue.concat([removePost(s3, post)])
        }

        return currentValue
      }, []))

      // Return a promise that resolves when all posts have been processed
      return Promise.all(promises)

        // Now add each new post to the index
        .then(() => {
          return newPosts.reduce((indexMemo, post) => {
            return addToIndex(indexMemo, post)
          }, index)
        })

        // Remove old posts from the index
        .then(newIndex => {
          return oldPosts.reduce((indexMemo, post) => {
            return omit(indexMemo, post.guid)
          }, newIndex)
        })

        // Save the new index
        .then(newIndex => {
          return saveIndex(s3, newIndex)
        })
    })

    .catch(err => {
      log.error(err)
    })
}

export function getIndex(s3) {
  // TODO: Use callS3() for this
  return new Promise((resolve, reject) => {
    s3.getObject({Key: 'posts/index.json'}, (err, data) => {
      if (err) {
        if (err.code === 'NoSuchKey') {
          // If the index doesn't exist, then resolve the promise with an empty
          // index object
          resolve({})
        } else {
          // Allow any other errors to be handled by the promise consumer
          reject(err)
        }
      } else {
        resolve(JSON.parse(data.Body))
      }
    })
  })
}

export function addToIndex(index, post) {
  const entry = {}

  entry[post.guid] = {
    unixDate: moment(post.pubDate).valueOf(),
    path: `posts/${md5(post.guid)}.md`,
  }

  return Object.assign({}, index, entry)
}

export function saveIndex(s3, index) {
  return callS3(s3, 'upload', {
    Key: 'posts/index.json',
    Body: JSON.stringify(index),
  })
}

export function toMarkdown(post) {
  // Exclude the description when creating the post metadata
  const metadata = yaml.safeDump(omit(post, 'description'))
  return `---\n${metadata}---\n${post.description}\n`
}

export function savePost(s3, post) {
  return callS3(s3, 'upload', {
    Key: `posts/${md5(post.guid)}.md`,
    Body: toMarkdown(post),
  })
}

export function removePost(s3, post) {
  return callS3(s3, 'deleteObject', {
    Key: `posts/${md5(post.guid)}.md`,
  })
}

import {omit} from 'lodash'
import createLogger from './create-logger'
import {getS3, callS3} from './s3-utils'
import md5 from 'md5'
import yaml from 'js-yaml'

const log = createLogger('save')

export function saveFeed(feed) {
  const s3 = getS3()

  // Pull the latest 30 items from the feed and generate markup for them
  const posts = feed.slice(0, 30).map(post => {
    // Return a new post object annotated with the rendered markdown
    return Object.assign({}, post, {renderedBody: toMarkdown(post)})
  })

  // Return a promise that resolves when all posts have been processed
  return Promise.all(posts.map(post => savePost(s3, post)))

    // Provide the posts as the value of the promise when it is resolved
    .then(() => {
      return posts
    })

    .catch(err => {
      log.error(err)
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
    Body: post.renderedBody,
  })
}

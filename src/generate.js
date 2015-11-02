import {compact, omit, isEmpty} from 'lodash'
import {getIndex, saveIndex} from './save'
import {getS3, callS3} from './s3-utils'
import {renderToStaticMarkup, createElement} from 'react'
import createLogger from './create-logger'
import frontMatter from 'front-matter'
import Index from './components/index'
import moment from 'moment'
import RSS from 'rss'

const log = createLogger('generate')

export function generateSite() {
  const s3 = getS3()

  const missingItems = []

  return getIndex(s3)

    // Get a promise for each of the posts
    .then(index => {

      const promises = Object.keys(index).map(guid => {
        return callS3(s3, 'getObject', {Key: index[guid].path})

          // Catch errors for missing files
          .catch(error => {
            if (error.code === 'NoSuchKey') {
              // Add it to the list that should be removed from the index
              missingItems.push(guid)
            } else {
              throw error
            }
          })
      })

      return Promise.all(promises)

        // Remove the missing files from the index
        .then(posts => {
          if (isEmpty(missingItems)) return posts

          const newIndex = missingItems.reduce((indexMemo, guid) => {
            return omit(indexMemo, guid)
          }, index)

          return saveIndex(s3, newIndex)

            // Pass the posts through the promise
            .then(() => posts)
        })
    })

    // Map each post to the frontMatter reader to create a context
    .then(posts => {
      // Pull the body from each post
      const postData = compact(posts).map(file => file.Body.toString())

        // Convert the posts to structured data with front-matter
        .map(frontMatter)

      // Render the index component and the rss feed with the context
      const index = renderIndex(postData)
      const feed = renderFeed(postData)

      return {index, feed}
    })

    .catch(err => {
      log.error(err)
    })
}

export function renderIndex(posts) {
  return renderToStaticMarkup(createElement(Index, {posts}))
}

export function renderFeed(posts) {
  const feed = new RSS({
    title: 'Reactifier.',
    description: 'A blog post aggregator bringing together React developers from across the globe.',
    /* eslint-disable camelcase */
    feed_url: 'http://reactifier.com/rss.xml',
    site_url: 'http://reactifier.com',
    /* eslint-enable camelcase */
    language: 'en',
    categories: ['React', 'React.js', 'JavaScript', 'Node'],
    pubDate: moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    ttl: '60',
  })

  posts.forEach(post => {
    const {attributes, body} = post
    const {author, guid, link, pubDate, subscription, title} = attributes

    feed.item({
      title,
      description: body,
      url: link,
      guid,
      categories: ['React', 'React.js', 'JavaScript', 'Node'],
      author: author || (subscription && subscription.title),
      date: moment(pubDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    })
  })

  return feed.xml({indent: true})
}

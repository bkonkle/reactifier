import {omit, isEmpty} from 'lodash'
import {getS3, callS3} from './s3-utils'
import {renderToStaticMarkup, createElement} from 'react'
import createLogger from './create-logger'
import frontMatter from 'front-matter'
import Index from './components/index'
import moment from 'moment'
import pkg from '../package'
import RSS from 'rss'

const log = createLogger('generate')

export function generateSite(posts) {
  return {index: renderIndex(posts), feed: renderFeed(posts)}
}

export function renderIndex(posts) {
  return renderToStaticMarkup(createElement(Index, {posts}))
}

export function renderFeed(posts) {
  const feed = new RSS({
    title: pkg.title,
    description: pkg.description,
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

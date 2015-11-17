import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import Index from './components/index'
import moment from 'moment'
import pkg from '../package'
import RSS from 'rss'

export function generateSite(posts) {
  // Render the index component and the rss feed with the context
  const index = renderIndex(posts)
  const feed = renderFeed(posts)

  return {index, feed}
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
    const {author, guid, link, pubDate, title, description, subscription} = post

    feed.item({
      title,
      description,
      url: link,
      guid,
      categories: ['React', 'React.js', 'JavaScript', 'Node'],
      author: author || (subscription && subscription.title),
      date: moment(pubDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    })
  })

  return feed.xml({indent: true})
}

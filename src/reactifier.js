import {generateSite} from './generate'
import {getS3, callS3} from './s3-utils'
import {getSubscriptionFeed} from './consume'
import {saveFeed} from './save'
import chalk from 'chalk'
import createLogger from './create-logger'
import dotenv from 'dotenv'

dotenv.load()

const log = createLogger('reactifier')

/*
 * This is the main entry point of reactifier, run within Amazon Lambda. It
 * orchestrates the entire process from start to finish, resulting in a static
 * site on S3.
 */
export default function reactifier(event, context) {
  log.info('Retrieving subscriptions...')

  return getSubscriptionFeed()

    .then(feed => {
      log.info('Saving posts to S3...')
      return saveFeed(feed)
    })

    .then(posts => {
      log.info('Generating the site...')
      return generateSite(posts)
    })

    .then(site => {
      log.info('Uploading the site to S3...')

      const s3 = getS3()

      const indexPromise = callS3(s3, 'upload', {
        Key: 'index.html',
        Body: `<!doctype html>${site.index}`,
        ContentType: 'text/html',
      })

      const feedPromise = callS3(s3, 'upload', {
        Key: 'rss.xml',
        Body: site.feed,
        ContentType: 'application/rss+xml',
      })

      // Return a promise that resolves when both have been uploaded
      return Promise.all([indexPromise, feedPromise])
    })

    // Report success
    .then(() => {
      log.info(chalk.green('Done!'))

      // If there is a Lambda context object present, call its done callback
      if (context && typeof context.done === 'function') {
        context.done()
      }
    })
}

// If invoked from the command line, simply call the reactifier function
if (require.main === module) {
  reactifier()
}

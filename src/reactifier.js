import {generateSite} from './generate'
import {getSubscriptionFeed} from './consume'
import {uploadSite} from './upload'
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

  // First, retrieve a combined feed of all subscriptions
  return getSubscriptionFeed()

    // Generate the site
    .then(feed => {
      log.info('Generating the site...')
      return generateSite(feed)
    })

    // Finally, save the index and feed to S3
    .then(site => {
      log.info('Uploading the site to S3...')
      return uploadSite(site)
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

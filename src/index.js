import {generateSite} from './generate';
import {getS3, callS3} from './s3-utils';
import {getSubscriptionFeed} from './consume';
import {saveFeed} from './save';
import chalk from 'chalk';
import createLogger from './create-logger';
import dotenv from 'dotenv';

dotenv.load();

const log = createLogger('reactifier');

/**
 * This is the main entry point of reactifier, run within Amazon Lambda. It
 * orchestrates the entire process from start to finish, resulting in a static
 * site on S3.
 */
export default function reactifier() {
  log.info('Retrieving subscriptions...');

  // First, retrieve a combined feed of all subscriptions
  getSubscriptionFeed()

    // Then, save the new posts to S3
    .then(function(feed) {
      log.info('Saving new posts to S3...');
      return saveFeed(feed);
    })

    // Generate the site
    .then(function() {
      log.info('Generating the site...');
      return generateSite();
    })

    // Finally, save the site to S3
    .then(function(body) {
      log.info('Uploading the site to S3...');
      return callS3(getS3(), 'upload', {
        Key: 'index.html',
        Body: body,
        ContentType: 'text/html',
      });
    })

    // Report success
    .then(function() {
      log.info(chalk.green('Done!'));
    });
}

// If invoked from the command line, simply call the reactifier function
if (require.main === module) {
  reactifier();
}

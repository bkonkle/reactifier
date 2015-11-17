'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reactifier;

var _generate = require('./generate');

var _consume = require('./consume');

var _upload = require('./upload');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _createLogger = require('./create-logger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.load();

var log = (0, _createLogger2.default)('reactifier');

/*
 * This is the main entry point of reactifier, run within Amazon Lambda. It
 * orchestrates the entire process from start to finish, resulting in a static
 * site on S3.
 */
function reactifier(event, context) {
  log.info('Retrieving subscriptions...');

  // First, retrieve a combined feed of all subscriptions
  return (0, _consume.getSubscriptionFeed)()

  // Generate the site
  .then(function (feed) {
    log.info('Generating the site...');
    return (0, _generate.generateSite)(feed);
  })

  // Finally, save the index and feed to S3
  .then(function (site) {
    log.info('Uploading the site to S3...');
    return (0, _upload.uploadSite)(site);
  })

  // Report success
  .then(function () {
    log.info(_chalk2.default.green('Done!'));

    // If there is a Lambda context object present, call its done callback
    if (context && typeof context.done === 'function') {
      context.done();
    }
  });
}

// If invoked from the command line, simply call the reactifier function
if (require.main === module) {
  reactifier();
}
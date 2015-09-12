/* eslint no-console:0 */
import bunyan from 'bunyan';
import chalk from 'chalk';

// Create a stream to format the string and call console commands
function PlainStream() {}
PlainStream.prototype.write = function(rec) {
  let record = rec.msg;

  if (rec.level < bunyan.INFO) {
    console.log(record);
  } else if (rec.level < bunyan.WARN) {
    console.info(record);
  } else if (rec.level < bunyan.ERROR) {
    console.warn(record);
  } else {
    if (typeof record === 'string') {
      record = chalk.red(record);
    }
    console.error(record);
  }
};

/**
 * Create a logger with the given name.
 *
 * @param {String} name - the name for the logger (usually the module being
 *                        logged in)
 * @param {Number} [level] - an optional override for the loglevel
 * @return {Object} - the bunyan logger object
 */
export default function createLogger(name, level) {
  // Adjust the loglevel based on the environment variable
  const loglevel = process.env.LOGLEVEL || 'info';

  let settings = {
    name: name,
    streams: [
      {
        level: level || loglevel,
        type: 'raw',
        stream: new PlainStream(),
      },
    ],
  };

  return bunyan.createLogger(settings);
}

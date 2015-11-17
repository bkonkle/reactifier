'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLogger;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a stream to format the string and call console commands
/* eslint no-console:0 */
function PlainStream() {}
PlainStream.prototype.write = function (rec) {
  var message = rec.msg;

  if (rec.level < _bunyan2.default.INFO) {
    console.log(message);
  } else if (rec.level < _bunyan2.default.WARN) {
    console.info(message);
  } else if (rec.level < _bunyan2.default.ERROR) {
    console.warn(message);
  } else {
    if (rec.err && rec.err.stack) {
      console.error(rec.err.stack);
    } else {
      console.log(_chalk2.default.red(message));
    }
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
function createLogger(name, level) {
  // Adjust the loglevel based on the environment variable
  var loglevel = process.env.LOGLEVEL || 'info';

  var settings = {
    name: name,
    streams: [{
      level: level || loglevel,
      type: 'raw',
      stream: new PlainStream()
    }]
  };

  return _bunyan2.default.createLogger(settings);
}
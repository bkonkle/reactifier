'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Head = (function (_Component) {
  _inherits(Head, _Component);

  function Head() {
    _classCallCheck(this, Head);

    _Component.apply(this, arguments);
  }

  Head.prototype.render = function render() {
    return _react2['default'].createElement(
      'head',
      null,
      _react2['default'].createElement('meta', { charSet: 'utf-8' }),
      _react2['default'].createElement(
        'title',
        null,
        'Reactifier.'
      ),
      _react2['default'].createElement('meta', { content: 'A blog post aggregator bringing together React developers from across the globe.', name: 'description' }),
      _react2['default'].createElement('meta', { content: 'width=device-width, initial-scale=1', name: 'viewport' }),
      _react2['default'].createElement('link', { href: 'media/css/style.css', rel: 'stylesheet' }),
      _react2['default'].createElement('link', { href: 'http://reactifier.com/rss.xml', rel: 'alternate', title: 'RSS Feed', type: 'application/rss+xml' })
    );
  };

  _createClass(Head, null, [{
    key: 'displayName',
    value: 'Head',
    enumerable: true
  }]);

  return Head;
})(_react.Component);

exports['default'] = Head;
module.exports = exports['default'];
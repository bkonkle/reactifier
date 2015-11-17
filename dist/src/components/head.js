'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Head = (function (_Component) {
  _inherits(Head, _Component);

  function Head() {
    _classCallCheck(this, Head);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Head).apply(this, arguments));
  }

  _createClass(Head, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'head',
        null,
        _react2.default.createElement('meta', { charSet: 'utf-8' }),
        _react2.default.createElement(
          'title',
          null,
          'Reactifier.'
        ),
        _react2.default.createElement('meta', { content: 'A blog post aggregator bringing together React developers from across the globe.', name: 'description' }),
        _react2.default.createElement('meta', { content: 'width=device-width, initial-scale=1', name: 'viewport' }),
        _react2.default.createElement('link', { href: 'media/css/style.css', rel: 'stylesheet' }),
        _react2.default.createElement('link', { href: 'http://reactifier.com/rss.xml', rel: 'alternate', title: 'RSS Feed', type: 'application/rss+xml' })
      );
    }
  }]);

  return Head;
})(_react.Component);

exports.default = Head;
Head.displayName = 'Head';
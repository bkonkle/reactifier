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

var Footer = (function (_Component) {
  _inherits(Footer, _Component);

  function Footer() {
    _classCallCheck(this, Footer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Footer).apply(this, arguments));
  }

  _createClass(Footer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'footer',
        { id: 'site-footer' },
        _react2.default.createElement(
          'section',
          { className: 'copyright' },
          _react2.default.createElement(
            'a',
            { href: 'http://konkle.us' },
            'Brandon Konkle'
          ),
          ' © 2015'
        ),
        _react2.default.createElement(
          'section',
          { className: 'github' },
          _react2.default.createElement(
            'a',
            { href: 'http://github.com/bkonkle/reactifier' },
            _react2.default.createElement('img', { alt: 'Github stars',
              className: 'stars',
              src: 'https://img.shields.io/github/stars/bkonkle/reactifier.svg?style=flat-square' }),
            _react2.default.createElement('img', { alt: 'Find the source code on Github',
              className: 'logo',
              src: '/media/images/mark-github.svg' })
          )
        )
      );
    }
  }]);

  return Footer;
})(_react.Component);

exports.default = Footer;
Footer.displayName = 'Footer';
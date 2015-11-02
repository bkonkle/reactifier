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

var Footer = (function (_Component) {
  _inherits(Footer, _Component);

  function Footer() {
    _classCallCheck(this, Footer);

    _Component.apply(this, arguments);
  }

  Footer.prototype.render = function render() {
    return _react2['default'].createElement(
      'footer',
      { id: 'site-footer' },
      _react2['default'].createElement(
        'section',
        { className: 'copyright' },
        _react2['default'].createElement(
          'a',
          { href: 'http://konkle.us' },
          'Brandon Konkle'
        ),
        ' © 2015'
      ),
      _react2['default'].createElement(
        'section',
        { className: 'github' },
        _react2['default'].createElement(
          'a',
          { href: 'http://github.com/bkonkle/reactifier' },
          _react2['default'].createElement('img', { alt: 'Github stars',
            className: 'stars',
            src: 'https://img.shields.io/github/stars/bkonkle/reactifier.svg?style=flat-square' }),
          _react2['default'].createElement('img', { alt: 'Find the source code on Github',
            className: 'logo',
            src: '/media/images/mark-github.svg' })
        )
      )
    );
  };

  _createClass(Footer, null, [{
    key: 'displayName',
    value: 'Footer',
    enumerable: true
  }]);

  return Footer;
})(_react.Component);

exports['default'] = Footer;
module.exports = exports['default'];
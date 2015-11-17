'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Article = (function (_Component) {
  _inherits(Article, _Component);

  function Article() {
    _classCallCheck(this, Article);

    _Component.apply(this, arguments);
  }

  Article.prototype.render = function render() {
    var _props = this.props;
    var author = _props.author;
    var description = _props.description;
    var link = _props.link;
    var pubDate = _props.pubDate;
    var subscription = _props.subscription;
    var title = _props.title;

    var date = (0, _moment2['default'])(pubDate);

    return _react2['default'].createElement(
      'article',
      null,
      _react2['default'].createElement(
        'h2',
        null,
        _react2['default'].createElement(
          'a',
          { href: link },
          _he2['default'].decode(title)
        )
      ),
      _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'p',
          null,
          _he2['default'].decode(description),
          ' ',
          _react2['default'].createElement(
            'a',
            { className: 'read-more', href: link },
            '» read more'
          )
        )
      ),
      _react2['default'].createElement(
        'footer',
        null,
        'From',
        author ? ' ' + author + ' on' : '',
        ' ',
        _react2['default'].createElement(
          'a',
          { href: subscription.link },
          subscription.title
        ),
        ' ',
        _react2['default'].createElement(
          'time',
          { className: 'post-date', dateTime: date.format('YYYY-MM-DD') },
          date.format('MMMM Do, YYYY')
        )
      )
    );
  };

  _createClass(Article, null, [{
    key: 'displayName',
    value: 'Article',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      author: _react.PropTypes.string,
      description: _react.PropTypes.string.isRequired,
      guid: _react.PropTypes.string.isRequired,
      link: _react.PropTypes.string.isRequired,
      pubDate: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.date]).isRequired,
      subscription: _react.PropTypes.shape({
        title: _react.PropTypes.string.isRequired,
        description: _react.PropTypes.string,
        link: _react.PropTypes.string.isRequired,
        feedLink: _react.PropTypes.string
      }),
      title: _react.PropTypes.string.isRequired
    },
    enumerable: true
  }]);

  return Article;
})(_react.Component);

exports['default'] = Article;
module.exports = exports['default'];
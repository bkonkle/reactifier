import React, {Component, PropTypes} from 'react';

export default class MockIndex extends Component {
  render() {
    return (
      <html>
        <body>
          {this.props.posts.map(post => post.attributes.title)}
        </body>
      </html>
    );
  }
}

MockIndex.displayName = 'MockIndex';

MockIndex.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      body: PropTypes.string,
    })
  ),
};

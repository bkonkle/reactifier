import React, {Component, PropTypes} from 'react';
import moment from 'moment';

export default class Article extends Component {

  static displayName = 'Article';

  static propTypes = {
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    guid: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    pubDate: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subscription: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      link: PropTypes.string.isRequired,
      feedLink: PropTypes.string,
    }),
  };

  render() {
    const {author, description, guid, link, pubDate, title, subscription} = this.props;
    const date = moment(pubDate);

    return (
      <article key={guid}>
        <h2><a href={link}>{title}</a></h2>
        <section>
          <p>
            {description}&nbsp;
            - <a className="read-more" href={link}>» read more</a>
          </p>
        </section>
        <footer>
          From {author}&nbsp;
          on <a href={subscription.link}>{subscription.title}</a>&nbsp;
          <time className="post-date" dateTime={date.format('YYYY-MM-DD')}>
            {date.format('MMMM Do, YYYY')}
          </time>
        </footer>
      </article>
    );
  }

}

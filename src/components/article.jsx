import he from 'he'
import moment from 'moment'
import React, {Component, PropTypes} from 'react'

export default class Article extends Component {

  static displayName = 'Article';

  static propTypes = {
    author: PropTypes.string,
    description: PropTypes.string.isRequired,
    guid: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    pubDate: PropTypes.string.isRequired,
    subscription: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      link: PropTypes.string.isRequired,
      feedLink: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
  };

  render() {
    const {author, description, link, pubDate, subscription, title} = this.props
    const date = moment(pubDate)

    return (
      <article>
        <h2><a href={link}>{he.decode(title)}</a></h2>
        <section>
          <p>
            {he.decode(description)} <a className="read-more" href={link}>» read more</a>
          </p>
        </section>
        <footer>
          From{author ? ` ${author} on` : ''}&nbsp;
          <a href={subscription.link}>{subscription.title}</a>&nbsp;
          <time className="post-date" dateTime={date.format('YYYY-MM-DD')}>
            {date.format('MMMM Do, YYYY')}
          </time>
        </footer>
      </article>
    )
  }

}

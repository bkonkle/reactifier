import he from 'he'
import moment from 'moment'
import React, {PropTypes} from 'react'

export default function Article({author, description, link, pubDate, subscription, title}) {
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

Article.displayName = 'Article'

Article.propTypes = {
  author: PropTypes.string,
  description: PropTypes.string.isRequired,
  guid: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  pubDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.date,
  ]).isRequired,
  subscription: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.string.isRequired,
    feedLink: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
}

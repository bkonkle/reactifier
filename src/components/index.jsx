import React, {Component, PropTypes} from 'react'
import Article from './article'
import Footer from './footer'
import Head from './head'

export default class Index extends Component {

  static displayName = 'Index'

  static propTypes = {
    posts: PropTypes.array.isRequired,
  };

  render() {

    return (
      <html>
        <Head/>
        <body>
          <header className="title">Reactifier<strong>.</strong></header>
          <section id="description">
            <p>A blog post aggregator bringing together React developers from across the globe. Use the <a href="http://reactifier.com/rss.xml">RSS Feed</a> to subscribe in your favorite feed reader. Would you like to see your blog on this site? Send a pull request for <a href="https://github.com/bkonkle/reactifier/blob/master/subscriptions.json">this file</a>!</p>
          </section>
          <main id="posts">
            {this.props.posts.map(post => <Article key={post.guid} {...post}/>)}
          </main>
          <Footer/>
        </body>
      </html>
    )
  }

}

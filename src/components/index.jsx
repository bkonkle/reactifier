import React, {Component, PropTypes} from 'react';
import Article from './article';
import Footer from './footer';
import Head from './head';

export default class Index extends Component {

  static displayName = 'Index';

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
            <p>A blog post aggregator bringing together React developers from across the globe.</p>
          </section>
          <main id="posts">
            {this.props.posts.map(post => <Article key={post.attributes.guid} {...post}/>)}
          </main>
          <Footer/>
        </body>
      </html>
    );
  }

}

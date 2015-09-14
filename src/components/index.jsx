import React, {Component, PropTypes} from 'react';

export default class Index extends Component {

  displayName: 'Index';

  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>Reactifier.</title>
          <meta name="description" content="A blog post aggregator bringing together React developers from across the globe."/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="media/css/style.css"/>
        </head>
        <body>
          <header className="title">Reactifier<strong>.</strong></header>
          <section id="description">

          </section>
          <main id="posts">
            <article>
              <h2><a href="#">State Management with Redux</a></h2>
              <section>
                <p>
                  If you follow React developers on Twitter, you've probably been hearing the name Redux come up a lot lately. There's a good reason for this
                  - <a className="read-more" href="/state-management-with-redux/">»</a>
                </p>
              </section>
              <footer>
                <a href="/author/brandon/">Brandon Konkle</a>
                 on <a href="/tag/react/">React</a>, <a href="/tag/javascript/">JavaScript</a>
                <time className="post-date" dateTime="2015-09-05">05 September 2015</time>
              </footer>
            </article>
          </main>
        </body>
      </html>
    );
  }

}

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
          <h1>Reactifier.</h1>
        </body>
      </html>
    );
  }

}

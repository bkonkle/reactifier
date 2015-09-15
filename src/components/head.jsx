import React, {Component} from 'react';

export default class Head extends Component {

  static displayName = 'Head';

  render() {
    return (
      <head>
        <meta charSet="utf-8"/>
        <title>Reactifier.</title>
        <meta name="description" content="A blog post aggregator bringing together React developers from across the globe."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="media/css/style.css"/>
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="http://reactifier/rss.xml"/>
      </head>
    );
  }

}

import React from 'react'

export default function Head() {
  return (
    <head>
      <meta charSet="utf-8" />
      <title>Reactifier.</title>
      <meta
        content="A blog post aggregator bringing together React developers from across the globe."
        name="description" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link href="media/css/style.css" rel="stylesheet" />
      <link href="http://reactifier.com/rss.xml"
        rel="alternate"
        title="RSS Feed"
        type="application/rss+xml" />
    </head>
  )
}

Head.displayName = 'Head'

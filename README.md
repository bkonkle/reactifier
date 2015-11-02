# Reactifier.

A blog post aggregator bringing together React developers from across the globe.

## How do I add my feed?

Send a pull request for the `subscriptions.json` file. We're glad to have you on
the feed!

## How does it work?

Reactifier is run as an AWS Lambda function. The compiled code and
dependencies are zipped up and uploaded to AWS to be triggered as a Scheduled
Event every hour. AWS executes the default export on the index module, which is
the `reactifier()` function.

The function pulls down all subscribed RSS feeds based on the
`subscriptions.json` file. For each new post, a markdown file is created on S3
with yaml front matter for metadata and a preview of the post in the markdown
body. The files are indexed for faster access.

After all new posts are saved, a static site is generated to display the post
previews and provide an RSS feed. The static site is hosted entirely through S3.

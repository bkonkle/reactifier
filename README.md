# Reactifier

A blog post aggregator bringing together React developers from across the globe.

## Plan

* Use Amazon Simple Workflow to create a timer that periodically triggers an
  AWS Lambda function
* The function will pull down all subscribed RSS feeds, based on a list checked
  into version control.
* To add a new feed, a pull request can be created.
* For each new post, create a markdown file with yaml front matter for metadata
  and a preview of the post in the markdown body.
* Generate a static site to host the post previews, including an rss feed.
* Host the static site through S3.

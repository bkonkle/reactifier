# Reactifier

A blog post aggregator bringing together React developers from across the globe.

## Plan

* Use Amazon Simple Workflow to create a timer that periodically triggers an
  AWS Lambda function.
* The function will pull down all subscribed RSS feeds, based on a list checked
  into version control.
* To add a new feed, a pull request can be created.
* For each new post, create a markdown file on S3 with yaml front matter for
  metadata and a preview of the post in the markdown body.
* Existing markdown files will be indexed to make it easy to identify if a post
  is new or not.
* After all new posts are saved, generate a static site to host the post
  previews, including an rss feed.
* Host the static site through S3.
* Periodically clean out posts that are older than 30 days.

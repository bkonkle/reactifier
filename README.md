# Reactifier.

[http://reactifier.com](http://reactifier.com)

A blog post aggregator bringing together React developers from across the globe.

## How do I add my feed?

Send a pull request for the `subscriptions.json` file. We're glad to have you on
the feed!

## How does it work?

Reactifier is run as an AWS Lambda function. The compiled code and
dependencies are zipped up and uploaded to AWS to be triggered as a Scheduled
Event every hour. AWS executes the default export on the _lambda.js_ module,
which calls the `reactifier()` function.

The function pulls down all subscribed RSS feeds based on the
`subscriptions.json` file. After the latest posts are retrieved, a static site
is generated to display the post previews and provide an RSS feed. The static
site is hosted entirely through S3.

## But, why??

I didn't want to stand up $10/month cloud server and maintain it. Lambda allows
me to periodically invoke my function, so I'm using a 128 MB instance for about
19 seconds every hour. That fits well within the free tier! \o/

## What does the AWS Lambda configuration look like?

![Lambda screenshot](https://raw.githubusercontent.com/bkonkle/reactifier/master/lambda-screenshot.png)

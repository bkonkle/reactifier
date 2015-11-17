import {getS3, callS3} from './s3-utils'

export function uploadSite({index, feed}) {
  const s3 = getS3()

  const indexPromise = callS3(s3, 'upload', {
    Key: 'index.html',
    Body: `<!doctype html>${index}`,
    ContentType: 'text/html',
  })

  const feedPromise = callS3(s3, 'upload', {
    Key: 'rss.xml',
    Body: feed,
    ContentType: 'application/rss+xml',
  })

  // Return a promise that resolves when both have been uploaded
  return Promise.all([indexPromise, feedPromise])
}

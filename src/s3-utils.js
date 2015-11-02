import AWS from 'aws-sdk'
import mime from 'mime-types'
import path from 'path'
import through from 'through2'

export function getS3() {
  return new AWS.S3({params: {Bucket: process.env.S3_BUCKET}})
}

/**
 * Calls S3 and returns a promise for the results.
 *
 * @param {AWS.S3} s3 - the S3 instance to work with
 * @param {String} method - the S3 method to call
 * @param {Object} options - the options to pass with the call
 * @returns {Promise}
 */
export function callS3(s3, method, options) {
  return new Promise((resolve, reject) => {
    s3[method](options, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

export function uploadToS3() {
  const s3 = getS3()

  return through.obj((file, enc, cb) => {
    // Find the relative path based on the current working directory
    const dest = path.relative(process.cwd(), file.path)

    // Upload the file to S3
    callS3(s3, 'upload', {
      Key: dest,
      Body: file.contents,
      ContentType: mime.lookup(file.path),
    })

      // Hit the callback when the upload is done
      .then(() => {
        cb(null, file)
      })
  })
}

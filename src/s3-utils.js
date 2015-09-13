import AWS from 'aws-sdk';

export function getS3() {
  // Make sure the desired AWS credentials profile is used, even if the env var
  // isn't available right away (such as when dotenv is used)
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});

  return new AWS.S3({params: {Bucket: process.env.S3_BUCKET}});
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
  return new Promise(function(resolve, reject) {
    s3[method](options, function(err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

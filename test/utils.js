import fs from 'fs';
import path from 'path';
import nock from 'nock';

export function getFacebookTestUtils() {
  const facebookResponse = fs.readFileSync(
    path.join(__dirname, 'fixtures/facebook.xml')
  ).toString();

  // Set up a nock request/response mock
  const facebookFeed = nock('https://facebook.github.io')

    // Intercept get requests for the feed
    .get('/react/feed.xml')

    // Reply with the facebook xml response
    .reply(200, facebookResponse);

  return {facebookResponse, facebookFeed};
}

export function cleanUpNock() {
  // Clean up between tests
  afterEach(function() {
    nock.cleanAll();
  });

  // Clean up when the suite is done
  after(function() {
    nock.restore();
  });
}

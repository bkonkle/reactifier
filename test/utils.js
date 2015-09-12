import fs from 'fs';
import path from 'path';
import nock from 'nock';

export function getFacebookFeed() {
  // Set up a nock request/response mock
  const facebookFeed = nock('https://facebook.github.io');

  const facebookResponse = fs.readFileSync(
    path.join(__dirname, 'fixtures/facebook.xml')
  ).toString();

  beforeEach(function() {
    // Intercept get requests for the feed
    facebookFeed.get('/react/feed.xml')

      // Reply with the facebook xml response
      .reply(200, facebookResponse);
  });

  return facebookFeed;
}

export function getKonkleFeed() {
  const konkleFeed = nock('http://konkle.us');

  const konkleResponse = fs.readFileSync(
    path.join(__dirname, 'fixtures/konkle.xml')
  ).toString();

  beforeEach(function() {
    konkleFeed.get('/tag/react/rss')

      .reply(200, konkleResponse);
  });

  return konkleFeed;
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

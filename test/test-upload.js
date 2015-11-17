import {getMockS3, getSampleFeed} from './utils'
import {expect} from 'chai'
import proxyquire from 'proxyquire'

describe('generate', () => {

  const {mockS3} = getMockS3()
  const {sampleFeedXml} = getSampleFeed()

  const {uploadSite} = proxyquire('../src/upload', {
    './s3-utils': {getS3: () => mockS3},
  })

  describe('uploadSite()', () => {

    it('calls s3 to upload the index and feed', () => {
      const fakeIndex = 'HEAD ON apply directly to the forehead'

      mockS3.upload = (options, callback) => {
        callback(undefined, 'Uploaded!')
      }

      const promise = uploadSite({index: fakeIndex, feed: sampleFeedXml})

      expect(promise).to.eventually.equal(['Uploaded!', 'Uploaded!'])
    })

  })

})

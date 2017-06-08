import AWS from 'aws-sdk'
import Promise from 'bluebird'
import {writeFile} from './write-file'

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY
})

const debug = require('debug')('riqra-api:utils:upload-to-s3')

const s3 = new AWS.S3()

export const uploadToS3 = (bucket, key, buffer) => {
  buffer = Buffer.from(buffer, 'binary')

  return new Promise((resolve, reject) => {
    const req = s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ACL: 'public-read'
    })

    req.send((err, data) => {
      if (err) {
        return reject(new Error(err))
      }

      let url = `https://s3-sa-east-1.amazonaws.com/${bucket}/${key}`
      resolve(url)
    })
  })
  .catch((e) => {
    debug('it fails uploading to S3')

    let path = `${process.env.PROJECT_DIR}/public/${key}`
    return writeFile(path, buffer).then(() => {
      return `${process.env.BASE_URL}/${key}`
    })
  })
}

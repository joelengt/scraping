import moment from 'moment'
import crypto from 'crypto'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

function createHMACDigest (key, string) {
  var hmac = crypto.createHmac('sha256', key)
  hmac.write(string)
  hmac.end()
  return hmac.read()
}

const S3Signature = mutationWithClientMutationId({
  name: `S3Signature`,
  inputFields: {
    key: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    uploadURL: {
      type: new GraphQLNonNull(GraphQLString)
    },
    key: {
      type: new GraphQLNonNull(GraphQLString)
    },
    acl: {
      type: new GraphQLNonNull(GraphQLString)
    },
    success_action_status: {
      type: new GraphQLNonNull(GraphQLString)
    },
    policy: {
      type: new GraphQLNonNull(GraphQLString)
    },
    XAMZAlgorithm: {
      type: new GraphQLNonNull(GraphQLString)
    },
    XAMZCredential: {
      type: new GraphQLNonNull(GraphQLString)
    },
    XAMZDate: {
      type: new GraphQLNonNull(GraphQLString)
    },
    XAMZSignature: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async({key}, ctx, info) => {
    let {S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION} = process.env

    let uploadURL = `https://${S3_BUCKET}.s3.amazonaws.com`
    let date = moment().format('YMMDD')

    let XAMZCredential = `${S3_ACCESS_KEY}/${date}/${S3_REGION}/s3/aws4_request`

    let XAMZAlgorithm = 'AWS4-HMAC-SHA256'
    let XAMZDate = `${date}T000000Z`
    let acl = 'public-read'
    let successActionStatus = '201'

    let payload = {
      expiration: moment().add(1, 'hour').toISOString(),
      conditions: [
        {bucket: S3_BUCKET},
        {key},
        {acl},
        {success_action_status: successActionStatus},
        {'x-amz-algorithm': XAMZAlgorithm},
        {'x-amz-credential': XAMZCredential},
        {'x-amz-date': XAMZDate}
      ]
    }

    let policy = Buffer.from(JSON.stringify(payload)).toString('base64')

    let dateKey = createHMACDigest(`AWS4${S3_SECRET_KEY}`, date)
    let dateRegionKey = createHMACDigest(dateKey, S3_REGION)
    let dateRegionServiceKey = createHMACDigest(dateRegionKey, 's3')
    let signingKey = createHMACDigest(dateRegionServiceKey, 'aws4_request')

    let XAMZSignature = createHMACDigest(signingKey, policy).toString('hex')

    return {
      uploadURL,
      key,
      acl,
      success_action_status: successActionStatus,
      policy,
      XAMZAlgorithm,
      XAMZCredential,
      XAMZDate,
      XAMZSignature
    }
  }
})

export default {S3Signature}

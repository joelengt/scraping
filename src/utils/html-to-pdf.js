import pdf from 'html-pdf'
import _ from 'lodash'
import Promise from 'bluebird'
import {uploadToS3} from './upload-to-s3'

export const htmlTopdf = (html, payload) => {
  return new Promise((resolve, reject) => {
    let template = _.template(html)({items: payload})
    let filename = `invoice-${payload[0].code}.pdf`
    let options = {
      border: {
        top: '10px',
        right: '10px',
        bottom: '10px',
        left: '10px'
      },
      footer: {
        height: '10mm',
        contents: `<p style='text-align:right; font-size:12px; font-family: Arial;'>${payload[0].code} {{page}} / {{pages}}</p>`
      },
      base: `file://${process.env.PROJECT_DIR}/templates/invoice/`
    }

    pdf.create(template, options)
    .toBuffer((err, buffer) => {
      if (err) {
        return reject(err)
      }

      uploadToS3(process.env.S3_BUCKET, filename, buffer)
      .then(resolve)
      .catch(reject)
    })
  })
}

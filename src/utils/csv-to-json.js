import Promise from 'bluebird'
import csv from 'csvtojson'

export const csvTojson = (data, options) => {
  options = options || {checkType: true, ignoreEmpty: true}

  return new Promise((resolve, reject) => {
    csv(options)
    .fromString(data)
    .on('end_parsed', (data) => {
      if (!data) {
        reject(new Error('CSV to JSON conversion failed!'))
      }

      resolve(data)
    })
  })
}

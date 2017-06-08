import _ from 'lodash'

export const generatePurchaseCode = (id) => {
  let code = id.toString()
  let total = 5 - code.length

  _.times(total, () => (code = `0${code}`))

  return `PR${code}`
}

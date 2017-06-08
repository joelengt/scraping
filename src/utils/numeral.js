import numeral from 'numeral'

numeral.defaultFormat('$0.00')

numeral.register('locale', 'pe', {
  delimiters: {
    thousands: ' ',
    decimal: '.'
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  currency: {
    symbol: 'S/'
  }
})

numeral.locale('pe')

export {numeral}

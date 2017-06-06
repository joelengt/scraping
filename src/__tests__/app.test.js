import {sum} from '../app'

describe('app.js', () => {
  it('sum two numbers', () => {
    expect(sum(5, 7)).toEqual(12)
  })
})

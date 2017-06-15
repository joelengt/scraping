import {noop} from '../'

test('it must return the value passed', () => {
  let value = 2
  let noopValue = noop(value)

  expect(noopValue).toBe(2)
})

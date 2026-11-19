import {describe, test, expect} from 'vitest'
import {isNotBlank} from './isNotBlank'

describe('isNotBlank', () => {
  test('true', () => {
    expect(isNotBlank('foo')).toEqual(true)
    expect(isNotBlank('0')).toEqual(true)
  })

  test('false', () => {
    expect(isNotBlank('')).toEqual(false)
    expect(isNotBlank(' ')).toEqual(false)
    expect(isNotBlank(null)).toEqual(false)
    expect(isNotBlank(undefined)).toEqual(false)
  })
})

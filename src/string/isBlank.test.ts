import {describe, test, expect} from 'vitest'
import {isBlank} from './isBlank'

describe('isBlank', () => {
  test('true', () => {
    expect(isBlank('')).toEqual(true)
    expect(isBlank(' ')).toEqual(true)
    expect(isBlank('　')).toEqual(true)
    expect(isBlank('\n')).toEqual(true)
    expect(isBlank('\r\n')).toEqual(true)
    expect(isBlank('\r')).toEqual(true)
    expect(isBlank(null)).toEqual(true)
    expect(isBlank(undefined)).toEqual(true)
  })

  test('false', () => {
    expect(isBlank('foo')).toEqual(false)
    expect(isBlank('0')).toEqual(false)
  })
})

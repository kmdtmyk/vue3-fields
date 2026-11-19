import {describe, test, expect} from 'vitest'
import {isNotEmpty} from './isNotEmpty'

describe('isNotEmpty', () => {
  test('true', () => {
    expect(isNotEmpty('foo')).toEqual(true)
    expect(isNotEmpty('0')).toEqual(true)
    expect(isNotEmpty(' ')).toEqual(true)
  })

  test('false', () => {
    expect(isNotEmpty('')).toEqual(false)
    expect(isNotEmpty(null)).toEqual(false)
    expect(isNotEmpty(undefined)).toEqual(false)
  })
})

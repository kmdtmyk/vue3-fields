import {describe, test, expect} from 'vitest'
import {isNullOrEmpty} from './isNullOrEmpty'

describe('isNullOrEmpty', () => {
  test('true', () => {
    expect(isNullOrEmpty(null)).toEqual(true)
    expect(isNullOrEmpty(undefined)).toEqual(true)
    expect(isNullOrEmpty([])).toEqual(true)
  })

  test('false', () => {
    expect(isNullOrEmpty([1])).toEqual(false)
  })
})

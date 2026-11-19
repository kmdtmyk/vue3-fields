import {describe, test, expect} from 'vitest'
import {isEmpty} from './isEmpty'

describe('isEmpty', () => {
  test('true', () => {
    expect(isEmpty('')).toEqual(true)
    expect(isEmpty(null)).toEqual(true)
    expect(isEmpty(undefined)).toEqual(true)
  })

  test('false', () => {
    expect(isEmpty('foo')).toEqual(false)
    expect(isEmpty('0')).toEqual(false)
    expect(isEmpty(' ')).toEqual(false)
  })
})

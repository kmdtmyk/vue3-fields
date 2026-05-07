import {describe, test, expect} from 'vitest'

import Strings from './Strings'

describe('includes', () => {

  test('basic', () => {
    expect(Strings.includes('abcdef', 'ab')).toEqual(true)
    expect(Strings.includes('abcdef', 'AB')).toEqual(false)
    expect(Strings.includes('abcdef', '')).toEqual(false)
    expect(Strings.includes('abcdef', null)).toEqual(false)
    expect(Strings.includes('abcdef', undefined)).toEqual(false)
    // expect(Strings.includes('123', 1)).toEqual(true)
    // expect(Strings.includes(123, '1')).toEqual(true)
    // expect(Strings.includes(null, 'u')).toEqual(false)
    // expect(Strings.includes(undefined, 'u')).toEqual(false)
    expect(Strings.includes('', '')).toEqual(false)
  })

  test('ignoreCase: true', () => {
    const option = {ignoreCase: true}
    expect(Strings.includes('abcdef', 'ab', option)).toEqual(true)
    expect(Strings.includes('abcdef', 'AB', option)).toEqual(true)
  })

})

describe('isBlank', () => {

  test('true', () => {
    expect(Strings.isBlank('')).toEqual(true)
    expect(Strings.isBlank(' ')).toEqual(true)
    expect(Strings.isBlank('　')).toEqual(true)
    expect(Strings.isBlank('\n')).toEqual(true)
    expect(Strings.isBlank('\r\n')).toEqual(true)
    expect(Strings.isBlank('\r')).toEqual(true)
    expect(Strings.isBlank(null)).toEqual(true)
    expect(Strings.isBlank(undefined)).toEqual(true)
  })

  test('false', () => {
    expect(Strings.isBlank('foo')).toEqual(false)
    expect(Strings.isBlank('0')).toEqual(false)
  })

})

describe('isEmpty', () => {

  test('true', () => {
    expect(Strings.isEmpty('')).toEqual(true)
    expect(Strings.isEmpty(null)).toEqual(true)
    expect(Strings.isEmpty(undefined)).toEqual(true)
  })

  test('false', () => {
    expect(Strings.isEmpty('foo')).toEqual(false)
    expect(Strings.isEmpty('0')).toEqual(false)
    expect(Strings.isEmpty(' ')).toEqual(false)
  })

})

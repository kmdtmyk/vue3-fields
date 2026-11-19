import {describe, test, expect} from 'vitest'
import {includes} from './includes'

describe('includes', () => {
  test('basic', () => {
    expect(includes('abcdef', 'ab')).toEqual(true)
    expect(includes('abcdef', 'AB')).toEqual(false)
    expect(includes('abcdef', '')).toEqual(false)
    expect(includes('abcdef', null)).toEqual(false)
    expect(includes('abcdef', undefined)).toEqual(false)
    expect(includes('', '')).toEqual(false)
  })

  test('ignoreCase: true', () => {
    const option = {ignoreCase: true}
    expect(includes('abcdef', 'ab', option)).toEqual(true)
    expect(includes('abcdef', 'AB', option)).toEqual(true)
  })
})

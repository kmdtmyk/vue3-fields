import {describe, test, expect} from 'vitest'
import {from} from './from'

describe('from', () => {
  test('array', () => {
    expect(from([1, 2, 3])).toEqual([1, 2, 3])
  })

  test('function', () => {
    expect(from(() => [1, 2, 3])).toEqual([1, 2, 3])
  })
})

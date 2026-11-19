import {describe, test, expect} from 'vitest'
import {toArray} from './toArray'

describe('toArray', () => {
  test('array', () => {
    expect(toArray([1, 2, 3])).toEqual([1, 2, 3])
  })

  test('function', () => {
    expect(toArray(() => [1, 2, 3])).toEqual([1, 2, 3])
  })
})

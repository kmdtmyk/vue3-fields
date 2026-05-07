import {describe, test, expect} from 'vitest'

import Arrays from './Arrays'

describe('from', () => {

  test('array', () => {
    expect(Arrays.from([1, 2, 3])).toEqual([1, 2, 3])
  })

  test('function', () => {
    expect(Arrays.from(() => [1, 2, 3])).toEqual([1, 2, 3])
  })

})

describe('isNullOrEmpty', () => {

  test('true', () => {
    expect(Arrays.isNullOrEmpty(null)).toEqual(true)
    expect(Arrays.isNullOrEmpty(undefined)).toEqual(true)
    expect(Arrays.isNullOrEmpty([])).toEqual(true)
  })

  test('false', () => {
    expect(Arrays.isNullOrEmpty([1])).toEqual(false)
  })

})

describe('search', () => {

  test('ignore case', () => {
    const array = [
      'foo',
      'bar',
      'hoge',
    ]
    expect(Arrays.search(array, 'foo')).toEqual(['foo'])
    expect(Arrays.search(array, 'FOO')).toEqual(['foo'])
  })

  test('multiple words', () => {
    const array = [
      'ubuntu',
      'centos',
      'debian',
      'linux mint',
    ]
    expect(Arrays.search(array, 'li mi')).toEqual(['linux mint'])
    expect(Arrays.search(array, 'li　mi')).toEqual(['linux mint'])
  })

  test('object array', () => {
    const array = [
      {id: 1, name: 'ubuntu'},
      {id: 2, name: 'centos'},
      {id: 3, name: 'debian'},
      {id: 4, name: 'linux mint'},
    ]
    expect(Arrays.search(array, 'bun')).toEqual([{id: 1, name: 'ubuntu'}])
    expect(Arrays.search(array, '3')).toEqual([{id: 3, name: 'debian'}])
    expect(Arrays.search(array, 'li mi')).toEqual([{id: 4, name: 'linux mint'}])
  })

})

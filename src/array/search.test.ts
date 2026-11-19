import {describe, test, expect} from 'vitest'
import {search} from './search'

describe('search', () => {
  test('ignore case', () => {
    const array = ['foo', 'bar', 'hoge']
    expect(search(array, 'foo')).toEqual(['foo'])
    expect(search(array, 'FOO')).toEqual(['foo'])
  })

  test('multiple words', () => {
    const array = ['ubuntu', 'centos', 'debian', 'linux mint']
    expect(search(array, 'li mi')).toEqual(['linux mint'])
    expect(search(array, 'li　mi')).toEqual(['linux mint'])
  })

  test('object array', () => {
    const array = [
      {id: 1, name: 'ubuntu'},
      {id: 2, name: 'centos'},
      {id: 3, name: 'debian'},
      {id: 4, name: 'linux mint'},
    ]
    expect(search(array, 'bun')).toEqual([{id: 1, name: 'ubuntu'}])
    expect(search(array, '3')).toEqual([{id: 3, name: 'debian'}])
    expect(search(array, 'li mi')).toEqual([{id: 4, name: 'linux mint'}])
  })
})

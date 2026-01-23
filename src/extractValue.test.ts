import {describe, test, expect} from 'vitest'
import extractValue from './extractValue'


test('basic', () => {
  expect(extractValue('', 1)).toEqual([{name: '', value: 1}])
  expect(extractValue('', 'string')).toEqual([{name: '', value: 'string'}])
  expect(extractValue('', true)).toEqual([{name: '', value: true}])
  expect(extractValue('', false)).toEqual([{name: '', value: false}])
  expect(extractValue('', null)).toEqual([{name: '', value: null}])
  expect(extractValue('foo', [1, 2])).toEqual([
    {name: 'foo[]', value: 1},
    {name: 'foo[]', value: 2},
  ])
})

test('object', () => {
  expect(extractValue('', {id: 1})).toEqual([{name: 'id', value: 1}])
  expect(extractValue('foo', {id: 1})).toEqual([{name: 'foo[id]', value: 1}])

  expect(extractValue('foo', {ids: [1, 2]})).toEqual([
    {name: 'foo[ids][]', value: 1},
    {name: 'foo[ids][]', value: 2},
  ])
  expect(extractValue('foo', {detail: {id: 1}})).toEqual([
    {name: 'foo[detail][id]', value: 1},
  ])
  expect(extractValue('foo', {details: [{id: 1}]})).toEqual([
    {name: 'foo[details][0][id]', value: 1},
  ])

})


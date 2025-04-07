import {describe, test, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import Component from './SelectField.vue'

describe('name', () => {

  test('with value', () => {
    const wrapper = mount(Component, {
      props: {
        name: 'foo',
        modelValue: 'bar',
      },
    })
    const input = wrapper.find('input[type=text]')
    const hidden = wrapper.find('input[type=hidden]')
    expect(input.attributes().name).toBeUndefined()
    expect(hidden.attributes().name).toEqual('foo')
    expect(hidden.attributes().value).toEqual('bar')
  })

  test('without value', async () => {
    const wrapper = mount(Component, {
      props: {
        name: 'foo',
      }
    })
    const input = wrapper.find('input[type=text]')
    const hidden = wrapper.find('input[type=hidden]')
    expect(input.attributes().name).toBeUndefined()
    expect(hidden.attributes().name).toEqual('foo')
    expect(hidden.attributes().value).toBeUndefined()
    await wrapper.vm.select('abc')
    expect(hidden.attributes().value).toEqual('abc')
  })

  test('record-key', async () => {
    const wrapper = mount(Component, {
      props: {
        name: 'foo',
        recordKey: 'id',
      }
    })
    const input = wrapper.find('input[type=text]')
    const hidden = wrapper.find('input[type=hidden]')
    expect(input.attributes().name).toBeUndefined()
    expect(hidden.attributes().name).toEqual('foo')
    expect(hidden.attributes().value).toBeUndefined()
    await wrapper.vm.select({id: 1, name: 'abc'})
    expect(hidden.attributes().value).toEqual('1')
  })

})

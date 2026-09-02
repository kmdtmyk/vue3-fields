import {describe, test, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import Component from './DatetimeField.vue'

describe('value', () => {

  test('iso8601', () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: '2026-09-02T11:20:50+09:00',
      }
    })
    expect(wrapper.element.value).toEqual('2026-09-02T11:20:50.000')
  })

  test('null', () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: null,
      }
    })
    expect(wrapper.element.value).toEqual('')
  })

  test('invalid value', () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'invalid',
      }
    })
    expect(wrapper.element.value).toEqual('')
  })

})

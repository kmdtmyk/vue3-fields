import {describe, test, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick}  from 'vue'
import Component from './TextField.vue'

describe('autocomplete', () => {

  test('array', async () => {
    const wrapper = mount(Component, {
      props: {
        autocomplete: ['foo', 'bar'],
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.trigger('focus')
    const items = wrapper.findAll('.dropdown-list-item')
    expect(items.length).toEqual(2)
    expect(items[0].text()).toEqual('foo')
    expect(items[1].text()).toEqual('bar')
  })

})

test('class', () => {
  const wrapper = mount(Component, {
    props: {
      class: 'foo',
    }
  })
  const input = wrapper.find('input[type=text]')
  expect(input.attributes().class).toEqual('foo')
})

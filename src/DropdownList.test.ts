import {describe, expect, test} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import Component from './DropdownList.vue'

describe('DropdownList', () => {

  test('renders records', () => {
    const wrapper = mount(Component, {
      props: {
        records: ['foo', 'bar'],
      },
    })

    const items = wrapper.findAll('.dropdown-list-item')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toBe('foo')
    expect(items[1].text()).toBe('bar')
  })

  test('selects the first record by default', () => {
    const wrapper = mount(Component, {
      props: {
        records: ['foo', 'bar'],
      },
    })

    expect(wrapper.findAll('.selected')).toHaveLength(1)
    expect(wrapper.find('.selected').text()).toBe('foo')
  })

  test('moves the selected record with down and up', async () => {
    const wrapper = mount(Component, {
      props: {
        records: ['foo', 'bar'],
      },
    })
    const dropdown = wrapper.findComponent(Component).vm

    dropdown.down()
    await nextTick()
    expect(wrapper.find('.selected').text()).toBe('bar')

    dropdown.up()
    await nextTick()
    expect(wrapper.find('.selected').text()).toBe('foo')
  })

  test('emits the selected record', () => {
    const wrapper = mount(Component, {
      props: {
        records: ['foo', 'bar'],
      },
    })
    const dropdown = wrapper.findComponent(Component).vm

    expect(dropdown.select()).toBe(true)
    expect(wrapper.emitted('input')).toEqual([['foo']])
  })

  test('does not render an empty list without an empty slot', () => {
    const wrapper = mount(Component, {
      props: {
        records: [],
      },
    })

    expect(wrapper.find('.dropdown-list').exists()).toBe(false)
  })

})

import {describe, expect, test} from 'vitest'
import {mount} from '@vue/test-utils'
import Component from './DropdownInput.vue'

describe('DropdownInput', () => {

  test('syncs input and modelValue', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'foo',
      },
    })
    const input = wrapper.find('input')

    expect(input.element.value).toBe('foo')

    await input.setValue('bar')

    expect(wrapper.emitted('update:modelValue')).toEqual([['bar']])
  })

  test('updates the input when modelValue changes', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'foo',
      },
    })

    await wrapper.setProps({modelValue: 'bar'})

    expect(wrapper.find('input').element.value).toBe('bar')
  })

  test('opens the dropdown on focus and closes it with escape', async () => {
    const wrapper = mount(Component, {
      slots: {
        default: 'content',
      },
    })
    const input = wrapper.find('input')

    await input.trigger('focus')
    expect(wrapper.find('.dropdown').text()).toBe('content')

    await input.trigger('keydown.esc')
    expect(wrapper.find('.dropdown').exists()).toBe(false)
  })

  test('emits clear when the clear button is clicked', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'foo',
        clear: true,
      },
    })

    await wrapper.find('.clear').trigger('click')

    expect(wrapper.emitted('clear')).toEqual([[null]])
  })

  test('shows a spinner instead of the clear button while loading', () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'foo',
        clear: true,
        loading: true,
      },
    })

    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.find('.clear').exists()).toBe(false)
  })

  test('exposes the input element', () => {
    const wrapper = mount(Component)
    const dropdownInput = wrapper.findComponent(Component).vm

    expect(dropdownInput.input).toBe(wrapper.find('input').element)
  })

})

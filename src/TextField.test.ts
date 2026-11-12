import {describe, test, expect, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick}  from 'vue'
import Component from './TextField.vue'

describe('name', () => {

  test('string', () => {
    const wrapper = mount(Component, {
      props: {
        name: 'foo',
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().name).toEqual('foo')
  })

  test('null', () => {
    const wrapper = mount(Component, {
      props: {
        name: null,
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().name).toBeUndefined()
  })

  test('without value', () => {
    const wrapper = mount(Component, {
      props: {
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().name).toBeUndefined()
  })

})

describe('type', () => {

  test('number', () => {
    const wrapper = mount(Component, {
      props: {
        type: 'number',
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().type).toEqual('text')
  })

})

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

  test('function modelValueなし', async () => {
    const func = vi.fn()
    func.mockReturnValue([])
    const wrapper = mount(Component, {
      props: {
        autocomplete: func,
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.trigger('focus')
    expect(func).toHaveBeenCalledOnce()
    expect(func).toHaveBeenCalledWith('')
  })

  test('function modelValueあり', async () => {
    const func = vi.fn()
    func.mockReturnValue([])
    const wrapper = mount(Component, {
      props: {
        modelValue: 'foo',
        autocomplete: func,
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.trigger('focus')
    expect(func).toHaveBeenCalledOnce()
    expect(func).toHaveBeenCalledWith('foo')
  })

})

describe('@input', () => {

  test('input', async () => {
    const func = vi.fn()
    const wrapper = mount(Component, {
      props: {
        onInput: func,
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.setValue('foo')
    expect(func).toHaveBeenCalledOnce()
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

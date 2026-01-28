import {describe, test, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick}  from 'vue'
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

describe('autocomplete', () => {

  test('force off', () => {
    const wrapper = mount(Component, {
      props: {
        autocomplete: 'on',
      }
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().autocomplete).toEqual('off')
  })

})

describe('class', () => {

  test('attribute', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'abc',
      }
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().class).toEqual('')

    wrapper.setProps({'class': 'foo bar'})
    await nextTick()
    expect(input.attributes().class).toEqual('foo bar')

    wrapper.setProps({'class': ['foo', 'baz']})
    await nextTick()
    expect(input.attributes().class).toEqual('foo baz')

    wrapper.setProps({'class': {foo: true, bar: false, hoge: true}})
    await nextTick()
    expect(input.attributes().class).toEqual('foo hoge')
  })

})

describe('value', () => {

  test('string', () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 'foo',
      },
    })
    expect(wrapper.vm.modelValue).toEqual('foo')
    expect(wrapper.emitted().input).toBeUndefined()
  })

  test('object', () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: {id: 1, name: 'foo'},
      },
    })
    expect(wrapper.vm.modelValue).toEqual({id: 1, name: 'foo'})
    expect(wrapper.emitted().input).toBeUndefined()
  })

})

describe('readonly', () => {

  test('true', () => {
    const wrapper = mount(Component, {
      props: {
        readonly: true,
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().readonly).toEqual('')
  })

  test('false', () => {
    const wrapper = mount(Component, {
      props: {
        readonly: false,
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().readonly).toBeUndefined()
  })

})

describe('disabled', () => {

  test('true', () => {
    const wrapper = mount(Component, {
      props: {
        disabled: true,
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().disabled).toEqual('')
  })

  test('false', () => {
    const wrapper = mount(Component, {
      props: {
        disabled: false,
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().disabled).toBeUndefined()
  })

})

describe('clear', () => {

  test('not required', async () => {
    const wrapper = mount(Component)
    await nextTick()
    expect(wrapper.find('.clear').exists()).toEqual(false)
    wrapper.setProps({modelValue: 1})
    await nextTick()
    expect(wrapper.find('.clear').exists()).toEqual(true)
  })

  test('required', async () => {
    const wrapper = mount(Component, {
      props: {
        required: true,
      },
    })
    await nextTick()
    expect(wrapper.find('.clear').exists()).toEqual(false)
    wrapper.setProps({modelValue: 1})
    await nextTick()
    expect(wrapper.find('.clear').exists()).toEqual(false)
  })

})

describe('title', () => {

  test('text', () => {
    const wrapper = mount(Component, {
      props: {
        title: 'foo',
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().title).toEqual('foo')
  })

})

describe('placeholder', () => {

  test('not selected', () => {
    const wrapper = mount(Component, {
      props: {
        placeholder: 'foo',
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().placeholder).toEqual('foo')
  })

  test('selected', () => {
    const wrapper = mount(Component, {
      props: {
        placeholder: 'foo',
        modelValue: 'bar',
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().placeholder).toEqual('bar')
  })

})

describe('onUpdate:modelValue', () => {

  test('does not updated by input set value', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: null,
        'onUpdate:modelValue': (e: any) => wrapper.setProps({modelValue: e})
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.setValue('foo')
    console.log(wrapper.props())
    expect(wrapper.props().modelValue).toEqual(null)
  })

})

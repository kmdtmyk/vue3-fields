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

  test('readonly', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 1,
        readonly: true,
      },
    })
    expect(wrapper.find('.clear').exists()).toEqual(false)
  })

  test('disabled', async () => {
    const wrapper = mount(Component, {
      props: {
        modelValue: 1,
        disabled: true,
      },
    })
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

  test('with slot', async () => {
    const wrapper = mount(Component, {
      props: {
        recordKey: 'id',
        records: [{id: 1, name: 'foo'}],
        modelValue: 1,
      },
      slots: {
        default: '{{record.id}}: {{record.name}}'
      },
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().placeholder).toEqual('1: foo')
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
    expect(wrapper.props().modelValue).toEqual(null)
  })

})

describe('records', () => {

  test('function', async () => {
    const queries: string[] = []
    const func = (query: string) => {
      queries.push(query)
      return []
    }
    const wrapper = mount(Component, {
      props: {
        records: func,
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.trigger('focus')
    await input.setValue('a')
    // focus時と入力時で2回呼ばれる
    expect(queries).toEqual(['', 'a'])
  })

  test('async function', async () => {
    const queries: string[] = []
    const func = async (query: string) => {
      queries.push(query)
      return []
    }
    const wrapper = mount(Component, {
      props: {
        records: func,
        asyncWait: 0,
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.trigger('focus')
    await input.setValue('a')
    // focus時と入力時で2回呼ばれる
    expect(queries).toEqual(['', 'a'])
  })

  test('searches again on focus when the previous result was empty', async () => {
    const queries: string[] = []
    const func = async (query: string) => {
      queries.push(query)
      return []
    }
    const wrapper = mount(Component, {
      props: {
        records: func,
        asyncWait: 0,
      },
    })
    const input = wrapper.find('input[type=text]')

    await input.trigger('focus')
    await input.setValue('a')
    await new Promise((resolve) => setTimeout(resolve, 0))
    await input.trigger('blur')
    // 空だったらここで再検索する
    await input.trigger('focus')

    expect(queries).toEqual(['', 'a', ''])
  })

})

describe('keydown', () => {

  test('prevents default for ArrowUp when dropdown exists', async () => {
    const wrapper = mount(Component, {
      props: {
        records: ['foo'],
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.trigger('focus')

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      cancelable: true,
    })
    input.element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })

  test('prevents default for ArrowDown when dropdown exists', async () => {
    const wrapper = mount(Component, {
      props: {
        records: ['foo'],
      },
    })
    const input = wrapper.find('input[type=text]')
    await input.trigger('focus')

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      cancelable: true,
    })
    input.element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })

  test.each(['ArrowUp', 'ArrowDown'])('does not prevent default for %s when dropdown does not exist', (key) => {
    const wrapper = mount(Component)
    const input = wrapper.find('input[type=text]')
    const event = new KeyboardEvent('keydown', {
      key,
      cancelable: true,
    })

    input.element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
  })

})

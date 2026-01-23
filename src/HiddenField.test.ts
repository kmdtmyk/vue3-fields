import {describe, test, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick}  from 'vue'
import Component from './HiddenField.vue'

test('number', () => {
  const wrapper = mount(Component, {
    props: {
      value: {
        number: 1,
      },
    },
  })
  const inputs = wrapper.findAll('input[type="hidden"]')
  expect(inputs.length).toEqual(1)
  expect(inputs[0].attributes('name')).toEqual('number')
  expect(inputs[0].attributes('value')).toEqual('1')
})

test('string', () => {
  const wrapper = mount(Component, {
    props: {
      value: {
        string: 'foo',
      },
    },
  })
  const inputs = wrapper.findAll('input[type="hidden"]')
  expect(inputs.length).toEqual(1)
  expect(inputs[0].attributes('name')).toEqual('string')
  expect(inputs[0].attributes('value')).toEqual('foo')
})

test('boolean', () => {
  const wrapper = mount(Component, {
    props: {
      value: {
        true: true,
        false: false,
      },
    },
  })
  const inputs = wrapper.findAll('input[type="hidden"]')
  expect(inputs.length).toEqual(2)
  expect(inputs[0].attributes('name')).toEqual('true')
  expect(inputs[0].attributes('value')).toEqual('true')
  expect(inputs[1].attributes('name')).toEqual('false')
  expect(inputs[1].attributes('value')).toEqual('false')
})

test('array', () => {
  const wrapper = mount(Component, {
    props: {
      value: {
        array: [1, 2, 3],
      },
    },
  })
  const inputs = wrapper.findAll('input[type="hidden"]')
  expect(inputs.length).toEqual(3)
  expect(inputs[0].attributes('name')).toEqual('array[]')
  expect(inputs[0].attributes('value')).toEqual('1')
})

test('null', () => {
  const wrapper = mount(Component, {
    props: {
      value: {
        foo: null,
      },
    },
  })
  const inputs = wrapper.findAll('input[type="hidden"]')
  expect(inputs.length).toEqual(1)
  expect(inputs[0].attributes('name')).toEqual('foo')
  expect(inputs[0].attributes('value')).toEqual('')
})

test('undefined', () => {
  const wrapper = mount(Component, {
    props: {
      value: {
        foo: undefined,
      },
    },
  })
  const inputs = wrapper.findAll('input[type="hidden"]')
  expect(inputs.length).toEqual(1)
  expect(inputs[0].attributes('name')).toEqual('foo')
  expect(inputs[0].attributes('value')).toEqual('')
})

test('object + name', () => {
  const wrapper = mount(Component, {
    props: {
      name: 'foo',
      value: {
        id: 1,
      },
    },
  })
  const inputs = wrapper.findAll('input[type="hidden"]')
  expect(inputs.length).toEqual(1)
  expect(inputs[0].attributes('name')).toEqual('foo[id]')
  expect(inputs[0].attributes('value')).toEqual('1')
})

describe('attribute' , () => {

  test('force type hidden', () => {
    const wrapper = mount(Component, {
      props: {
        value: {
          id: 1,
        },
        type:'text'
      },
    })
    const inputs = wrapper.findAll('input[type="hidden"]')
    expect(inputs.length).toEqual(1)
  })

  test('disabled', () => {
    const wrapper = mount(Component, {
      props: {
        value: {
          id: 1,
        },
        disabled: true,
      },
    })
    const inputs = wrapper.findAll('input[type="hidden"]')
    expect(inputs[0].attributes('disabled')).toEqual('')
  })

})


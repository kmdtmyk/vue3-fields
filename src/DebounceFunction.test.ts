import {afterEach, describe, expect, test, vi} from 'vitest'
import DebounceFunction from './DebounceFunction'

afterEach(() => {
  vi.useRealTimers()
})

describe('DebounceFunction', () => {
  test('executes immediately when wait is zero or less', () => {
    const func = vi.fn()
    const debounce = new DebounceFunction(func)

    debounce.call({
      wait: 0,
      arguments: ['foo', 1],
    })

    expect(func).toHaveBeenCalledOnce()
    expect(func).toHaveBeenCalledWith('foo', 1)
  })

  test('executes after the specified wait', () => {
    vi.useFakeTimers()
    const func = vi.fn()
    const debounce = new DebounceFunction(func)

    debounce.call({
      wait: 100,
      arguments: ['foo'],
    })

    expect(func).not.toHaveBeenCalled()
    vi.advanceTimersByTime(99)
    expect(func).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(func).toHaveBeenCalledOnce()
    expect(func).toHaveBeenCalledWith('foo')
  })

  test('cancels the previous call when called again', () => {
    vi.useFakeTimers()
    const func = vi.fn()
    const debounce = new DebounceFunction(func)

    debounce.call({
      wait: 100,
      arguments: ['first'],
    })
    debounce.call({
      wait: 100,
      arguments: ['second'],
    })

    vi.advanceTimersByTime(100)

    expect(func).toHaveBeenCalledOnce()
    expect(func).toHaveBeenCalledWith('second')
  })

  test('cancel prevents a pending call from executing', () => {
    vi.useFakeTimers()
    const func = vi.fn()
    const debounce = new DebounceFunction(func)

    debounce.call({
      wait: 100,
      arguments: ['foo'],
    })
    debounce.cancel()
    vi.advanceTimersByTime(100)

    expect(func).not.toHaveBeenCalled()
  })
})

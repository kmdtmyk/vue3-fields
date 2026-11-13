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

  test('isWaiting reports whether a call is waiting', () => {
    vi.useFakeTimers()
    const debounce = new DebounceFunction(() => {})

    expect(debounce.isWaiting()).toBe(false)
    debounce.call({
      wait: 100,
      arguments: [],
    })
    expect(debounce.isWaiting()).toBe(true)

    vi.advanceTimersByTime(100)
    expect(debounce.isWaiting()).toBe(false)
  })

  test('tracks executing promises and removes them when completed', async () => {
    let resolve!: () => void
    const promise = new Promise<void>((resolvePromise) => {
      resolve = resolvePromise
    })
    const debounce = new DebounceFunction(async () => promise)

    debounce.call({
      wait: 0,
      arguments: [],
    })
    expect(debounce.getExecutingCount()).toBe(1)

    resolve()
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 0))
    expect(debounce.getExecutingCount()).toBe(0)
  })

})

import {afterEach, describe, expect, test, vi} from 'vitest'
import DebounceFunction from './DebounceFunction'

afterEach(() => {
  vi.useRealTimers()
})

describe('DebounceFunction', () => {

  test('executes immediately when wait is zero or less', () => {
    const func = vi.fn()
    const debounce = new DebounceFunction()

    debounce.runAfter(func, 0)

    expect(func).toHaveBeenCalledOnce()
  })

  test('treats a negative wait as zero',  () => {
    const func = vi.fn()
    const debounce = new DebounceFunction()

    debounce.runAfter(func, -100)

    expect(func).toHaveBeenCalledOnce()
  })

  test('executes after the specified wait', () => {
    vi.useFakeTimers()
    const func = vi.fn()
    const debounce = new DebounceFunction()

    debounce.runAfter(func, 100)

    expect(func).not.toHaveBeenCalled()
    vi.advanceTimersByTime(99)
    expect(func).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(func).toHaveBeenCalledOnce()
  })

  test('cancels the previous call when called again', () => {
    vi.useFakeTimers()
    const first = vi.fn()
    const second = vi.fn()
    const debounce = new DebounceFunction()

    debounce.runAfter(first, 100)
    debounce.runAfter(second, 100)
    vi.advanceTimersByTime(100)

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })

  test('cancel prevents a pending call from executing', () => {
    vi.useFakeTimers()
    const func = vi.fn()
    const debounce = new DebounceFunction()

    debounce.runAfter(func, 100)
    debounce.cancel()
    vi.advanceTimersByTime(100)

    expect(func).not.toHaveBeenCalled()
  })

  test('isWaiting reports whether a call is waiting', () => {
    vi.useFakeTimers()
    const debounce = new DebounceFunction()

    expect(debounce.isWaiting()).toBe(false)
    debounce.runAfter(() => {}, 100)
    expect(debounce.isWaiting()).toBe(true)

    vi.advanceTimersByTime(100)
    expect(debounce.isWaiting()).toBe(false)
  })

  test('executes a function passed to call', () => {
    const argument = vi.fn()
    const debounce = new DebounceFunction()

    debounce.runAfter(() => argument(), 0)

    expect(argument).toHaveBeenCalledOnce()
  })

  test('tracks executing promises and removes them when completed', async () => {
    let resolve!: () => void
    const promise = new Promise<void>((resolvePromise) => {
      resolve = resolvePromise
    })
    const debounce = new DebounceFunction()

    debounce.runAfter(async () => promise, 0)
    expect(debounce.getExecutingCount()).toBe(1)

    resolve()
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 0))
    expect(debounce.getExecutingCount()).toBe(0)
  })

  test('rejects when the function throws synchronously', async () => {
    const debounce = new DebounceFunction()

    await expect(debounce.runAfter(() => {
      throw new Error('failed')
    }, 0)).rejects.toThrow('failed')
    expect(debounce.getExecutingCount()).toBe(0)
  })

  test('rejects when the function rejects', async () => {
    const debounce = new DebounceFunction()

    await expect(debounce.runAfter(async () => {
      throw new Error('failed')
    }, 0)).rejects.toThrow('failed')
    expect(debounce.getExecutingCount()).toBe(0)
  })

})

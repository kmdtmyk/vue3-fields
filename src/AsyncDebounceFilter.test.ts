import {afterEach, describe, expect, test, vi} from 'vitest'
import AsyncDebounceFilter from './AsyncDebounceFilter'

afterEach(() => {
  vi.useRealTimers()
})

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return {promise, resolve}
}

const flushPromises = () => {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('AsyncDebounceFilter', () => {

  test('waits before executing and stays pending while the function runs', async () => {
    vi.useFakeTimers()
    const result = deferred<string[]>()
    const func = vi.fn(async () => result.promise)
    const filter = new AsyncDebounceFilter(() => {})

    filter.run(func, 100)
    expect(filter.hasPending()).toBe(true)
    expect(func).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledOnce()
    expect(filter.hasPending()).toBe(true)

    result.resolve([])
    await vi.runAllTimersAsync()
    expect(filter.hasPending()).toBe(false)
  })

  test('executes only the last call during the wait time', () => {
    vi.useFakeTimers()
    const first = vi.fn(async () => [])
    const second = vi.fn(async () => [])
    const filter = new AsyncDebounceFilter(() => {})

    filter.run(first, 100)
    filter.run(second, 100)
    vi.advanceTimersByTime(100)

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })

  test('returns a promise that resolves when the function completes', async () => {
    const filter = new AsyncDebounceFilter(() => {})

    await expect(filter.run(async () => [], 0)).resolves.toBeUndefined()
  })

  test('rejects when the function fails', async () => {
    const error = new Error('failed')
    const filter = new AsyncDebounceFilter(() => {})

    const result = filter.run(async () => {
      throw error
    }, 0)

    await expect(result).rejects.toBe(error)
  })

  test('ignores an older result when a newer result completes first', async () => {
    const first = deferred<string>()
    const second = deferred<string>()
    const results: string[] = []
    const filter = new AsyncDebounceFilter<string>((result) => results.push(result))

    filter.run(async () => first.promise, 0)
    filter.run(async () => second.promise, 0)

    second.resolve('second result')
    await flushPromises()
    expect(results).toEqual(['second result'])

    first.resolve('first result')
    await flushPromises()
    expect(results).toEqual(['second result'])
  })

})

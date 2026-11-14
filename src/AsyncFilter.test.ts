import {describe, expect, test} from 'vitest'
import AsyncFilter from './AsyncFilter'

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return {promise, resolve}
}

describe('AsyncFilter', () => {

  test('ignores an older result when a newer result completed first', async () => {
    const first = deferred<string>()
    const second = deferred<string>()
    const results: string[] = []
    const filter = new AsyncFilter<string>((result) => results.push(result))

    const firstResult = filter.run(async () => first.promise)
    const secondResult = filter.run(async () => second.promise)
    expect(filter.hasPending()).toBe(true)

    second.resolve('second result')
    await secondResult
    expect(results).toEqual(['second result'])
    expect(filter.hasPending()).toBe(false)

    first.resolve('first result')
    await firstResult
    expect(results).toEqual(['second result'])
  })

  test('accepts an older result when it completed before a newer result', async () => {
    const first = deferred<string>()
    const second = deferred<string>()
    const results: string[] = []
    const filter = new AsyncFilter<string>((result) => results.push(result))

    const firstResult = filter.run(async () => first.promise)
    const secondResult = filter.run(async () => second.promise)
    expect(filter.hasPending()).toBe(true)

    first.resolve('first result')
    await firstResult
    expect(results).toEqual(['first result'])
    expect(filter.hasPending()).toBe(true)

    second.resolve('second result')
    await secondResult
    expect(results).toEqual(['first result', 'second result'])
    expect(filter.hasPending()).toBe(false)
  })

  test('removes a request when the function throws synchronously', async () => {
    const filter = new AsyncFilter(() => {})

    const result = filter.run(() => {
      throw new Error('failed')
    })

    await expect(result).rejects.toThrow('failed')
    expect(filter.hasPending()).toBe(false)
  })

  test('rejects and removes a request when the async function fails', async () => {
    const filter = new AsyncFilter(() => {})
    const error = new Error('failed')

    const result = filter.run(async () => {
      throw error
    })

    await expect(result).rejects.toBe(error)
    expect(filter.hasPending()).toBe(false)
  })

})

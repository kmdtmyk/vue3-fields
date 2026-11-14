import {describe, expect, test} from 'vitest'
import useSearchRecords, {isRecordsSource} from './useSearchRecords'

describe('isRecordsSource', () => {

  test('returns true for an array or function', () => {
    expect(isRecordsSource([])).toBe(true)
    expect(isRecordsSource(() => [])).toBe(true)
    expect(isRecordsSource(async () => [])).toBe(true)
  })

  test('returns false for other values', () => {
    expect(isRecordsSource(null)).toBe(false)
    expect(isRecordsSource('foo')).toBe(false)
  })

})

describe('useSearchRecords', () => {

  test('searches an array', () => {
    const result = useSearchRecords(['foo', 'bar'], undefined)

    expect(result.isAsync).toBe(false)
    expect(result.records.value).toBeNull()

    result.search('fo')

    expect(result.records.value).toEqual(['foo'])
    expect(result.loading.value).toBe(false)
  })

  test('searches with a synchronous function', () => {
    const result = useSearchRecords((query: string) => [query], undefined)

    result.search('foo')

    expect(result.isAsync).toBe(false)
    expect(result.records.value).toEqual(['foo'])
  })

  test('searches with an asynchronous function', async () => {
    let resolve!: (records: string[]) => void
    const promise = new Promise<string[]>((resolvePromise) => {
      resolve = resolvePromise
    })
    const result = useSearchRecords(async () => promise, 0)

    result.search('foo')
    expect(result.isAsync).toBe(true)
    expect(result.loading.value).toBe(true)
    expect(result.records.value).toBeNull()

    resolve(['foo'])
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.records.value).toEqual(['foo'])
    expect(result.loading.value).toBe(false)
  })

})

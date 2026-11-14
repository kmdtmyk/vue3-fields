import {ref} from 'vue'
import Arrays from './Arrays'
import AsyncDebounceFilter from './AsyncDebounceFilter'
import defaultAsyncWait from './defaultAsyncWait'

export type RecordsSource<T> = T[] | ((query: string) => T[] | Promise<T[]>)
export type AsyncWait = number | ((query: string) => number)

/**
 * このcomposableの引数として使える場合はtrue
 * @param value
 * @returns
 */
export const isRecordsSource = <T>(value: unknown): value is RecordsSource<T> => {
  return Array.isArray(value) || typeof value === 'function'
}

/**
 * 非同期関数だとtrue
 * @param value
 * @returns
 */
const isAsyncFunction = <T>(value: unknown): value is (query: string) => Promise<T[]> => {
  return typeof value === 'function' && value.constructor.name === 'AsyncFunction'
}

/**
 * 非同期でない関数だとtrue
 * @param value
 * @returns
 */
const isSyncFunction = <T>(value: unknown): value is (query: string) => T[] => {
  return typeof value === 'function' && value.constructor.name !== 'AsyncFunction'
}

export default function useSearchRecords<T>(
  source: RecordsSource<T> | null | undefined,
  asyncWait: AsyncWait | undefined,
){
  const asyncFunction = isAsyncFunction<T>(source) ? source : null
  const syncFunction = isSyncFunction<T>(source) ? source : null
  const records = ref<T[] | null>(null)
  const arrayRecords = Array.isArray(source) ? source : null
  const loading = ref(false)

  let asyncDebounceFilter: AsyncDebounceFilter<T[]> | null = null
  if(asyncFunction != null){
    asyncDebounceFilter = new AsyncDebounceFilter(
      (value) => {
        records.value = value
        loading.value = asyncDebounceFilter?.hasPending() ?? false
      },
      () => {
        loading.value = asyncDebounceFilter?.hasPending() ?? false
      },
    )
  }

  const callAsyncRecords = (query: string) => {
    if(asyncDebounceFilter == null || asyncFunction == null){
      return
    }

    let wait
    if(asyncWait instanceof Function){
      wait = asyncWait(query)
    }else if(asyncWait != null){
      wait = asyncWait
    }else{
      wait = defaultAsyncWait(query)
    }

    asyncDebounceFilter.run(() => asyncFunction(query), wait)
    loading.value = true
  }

  const callSyncRecords = (query: string) => {
    if(syncFunction != null){
      records.value = syncFunction(query)
    }else if(Array.isArray(arrayRecords)){
      records.value = Arrays.search(arrayRecords, query)
    }
  }

  const search = (query: string) => {
    if(asyncFunction != null){
      callAsyncRecords(query)
    }else{
      callSyncRecords(query)
    }
  }

  return {
    isAsync: asyncFunction != null,
    records,
    loading,
    search,
  }
}

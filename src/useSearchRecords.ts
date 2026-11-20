import {ref} from 'vue'
import {search as searchArray} from './array/search'
import AsyncDebounceFilter from './AsyncDebounceFilter'
import defaultDebounceTime from './defaultDebounceTime'

export type RecordsSource<T> = T[] | ((query: string) => T[] | Promise<T[]>)
export type DebounceTime = number | ((query: string) => number)

/**
 * このcomposableの引数として使える場合はtrue
 * @param value
 * @returns
 */
export const isRecordsSource = <T>(value: unknown): value is RecordsSource<T> => {
  return Array.isArray(value) || typeof value === 'function'
}

/** SelectFieldとTextFieldで、配列・検索関数から候補を取得する。 */
export default function useSearchRecords<T>(
  source: RecordsSource<T> | null | undefined,
  debounceTime: DebounceTime | undefined,
){
  // nullは検索前、空配列は検索結果なしを表す。
  const records = ref<T[] | null>(null)
  const loading = ref(false)

  // async宣言のある関数は、呼び出す前からデバウンスできる。
  const isAsync = typeof source === 'function' && source.constructor.name === 'AsyncFunction'

  const asyncFilter = new AsyncDebounceFilter<T[]>((result) => {
    records.value = result
    loading.value = asyncFilter.hasPending()
  })

  const getDebounceTime = (query: string): number => {
    if(typeof debounceTime === 'function'){
      return debounceTime(query)
    }
    return debounceTime ?? defaultDebounceTime(query)
  }

  const searchAsync = (query: string, getResult: () => T[] | Promise<T[]>) => {
    loading.value = true
    asyncFilter.run(() => Promise.resolve(getResult()), getDebounceTime(query)).catch(() => {
      loading.value = asyncFilter.hasPending()
    })
  }

  const search = (query: string) => {
    if(source == null){
      return
    }
    if(Array.isArray(source)){
      records.value = searchArray(source, query)
      return
    }
    if(isAsync){
      searchAsync(query, () => source(query))
      return
    }

    const result = source(query)
    if(Array.isArray(result)){
      records.value = result
    }else{
      // 通常関数が返したPromiseも扱う。関数を二重に呼び出さない。
      searchAsync(query, () => result)
    }
  }

  return {isAsync, records, loading, search}
}

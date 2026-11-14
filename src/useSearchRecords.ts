import {ref} from 'vue'
import Arrays from './Arrays'
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

/**
 * SelectFieldやTextFieldのpropsで以下の3通りを受け付けるようにしている、これを扱うためのcomposable
 * - 配列
 * - 配列を返す同期関数
 * - 配列を返す非同期関数
 *
 * @param source
 * @param debounceTime
 * @returns
 */
export default function useSearchRecords<T>(
  source: RecordsSource<T> | null | undefined,
  debounceTime: DebounceTime | undefined,
){
  // asyncあり
  const asyncFunction = isAsyncFunction<T>(source) ? source : null
  // asyncなし
  const syncFunction = isSyncFunction<T>(source) ? source : null
  // 直接配列が渡された時用
  const arrayRecords = Array.isArray(source) ? source : null
  // 検索結果保存用、検索実行前だとnull
  const records = ref<T[] | null>(null)
  // 読み込み中のやつを表示するのに使う
  const loading = ref(false)

  let asyncDebounceFilter: AsyncDebounceFilter<T[]> | null = null
  if(asyncFunction != null){
    asyncDebounceFilter = new AsyncDebounceFilter((value) => {
      records.value = value
      loading.value = asyncDebounceFilter?.hasPending() ?? false
    })
  }

  const callAsyncRecords = (query: string) => {
    if(asyncDebounceFilter == null || asyncFunction == null){
      return
    }

    let wait
    if(debounceTime instanceof Function){
      wait = debounceTime(query)
    }else if(debounceTime != null){
      wait = debounceTime
    }else{
      wait = defaultDebounceTime(query)
    }

    asyncDebounceFilter.run(() => asyncFunction(query), wait).catch(() => {
      loading.value = asyncDebounceFilter?.hasPending() ?? false
    })
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

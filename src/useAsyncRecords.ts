import {ref} from 'vue'
import AsyncDebounceFilter from './AsyncDebounceFilter'
import defaultAsyncWait from './defaultAsyncWait'

type AsyncRecordsFunction<T> = (query: string) => Promise<T[]>
type AsyncWait = number | ((query: string) => number)

export default function useAsyncRecords<T>(
  getRecords: AsyncRecordsFunction<T> | null,
  asyncWait: AsyncWait | undefined,
){
  const records = ref<T[] | null>(null)
  const loading = ref(false)

  let filter: AsyncDebounceFilter<T[]> | null = null
  if(getRecords != null){
    filter = new AsyncDebounceFilter(
      (value) => {
        records.value = value
        loading.value = filter?.hasPending() ?? false
      },
      () => {
        loading.value = filter?.hasPending() ?? false
      },
    )
  }

  const run = (query: string) => {
    if(filter == null || getRecords == null){
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

    filter.run(() => getRecords(query), wait)
    loading.value = true
  }

  return {
    records,
    loading,
    run,
  }
}

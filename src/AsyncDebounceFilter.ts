import AsyncFilter from './AsyncFilter'
import DebounceFunction from './DebounceFunction'

/**
 * AsyncFilterとDebounceFunctionを組合せたクラス
 *
 * runで指定した秒数[ms]経つまで再度runが呼ばれなかったら実行する。
 * 実行順に結果を返して、順番が遅れた結果は無視する。
 *
 */
export default class<T>{

  private readonly debounce: DebounceFunction
  private readonly filter: AsyncFilter<T>

  constructor(private readonly onResult: (result: T) => void){
    this.filter = new AsyncFilter(onResult)
    this.debounce = new DebounceFunction()
  }

  run(func: () => Promise<T>, wait: number): Promise<void>{
    return this.debounce.runAfter(() => this.filter.run(func), wait)
  }

  hasPending(): boolean{
    return this.debounce.isWaiting() || this.filter.hasPending()
  }

}

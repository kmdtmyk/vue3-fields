import AsyncFilter from './AsyncFilter'
import DebounceFunction from './DebounceFunction'

/**
 * 非同期処理のデバウンスと、古い結果のフィルタを組み合わせるクラス。
 */
export default class<T>{

  private readonly debounce: DebounceFunction
  private readonly filter: AsyncFilter<T>

  constructor(
    private readonly onResult: (result: T) => void,
    private readonly onError: (error: unknown) => void = () => {},
  ){
    this.filter = new AsyncFilter(onResult)
    this.debounce = new DebounceFunction((func: () => Promise<T>) => {
      return this.filter.run(func).catch(this.onError)
    })
  }

  run(func: () => Promise<T>, wait: number): void{
    this.debounce.call({
      wait,
      arguments: [func],
    })
  }

  hasPending(): boolean{
    return this.debounce.isWaiting() || this.filter.hasPending()
  }

}

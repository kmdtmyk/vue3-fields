type DebouncedFunction = () => void | PromiseLike<unknown>

/**
 * 関数の実行を遅延し、待機中に再度呼び出された場合は
 * 前回の実行予定を取り消して、最後に渡された関数だけを実行する。
 *
 * 実行する関数がPromiseを返す場合は、完了するまで実行中として扱う。
 */
export default class{

  private timeoutID: ReturnType<typeof setTimeout> | null = null
  private executingCount = 0
  private pendingResolve: (() => void) | null = null

  /**
   * 関数を実行する。waitが0以下の場合はすぐに実行する。
   * 実行完了時にresolveし、エラー発生時にrejectするPromiseを返す。
   *
   * @param func 実行する関数
   * @param wait 実行まで待機する時間[ms]
   */
  runAfter(func: DebouncedFunction, wait: number): Promise<void>{
    if(this.timeoutID != null){
      this.cancel()
    }

    const delay = Math.max(0, wait)

    return new Promise<void>((resolve, reject) => {
      this.pendingResolve = resolve

      const execute = () => {
        this.timeoutID = null
        this.pendingResolve = null
        this.execute(func).then(resolve, reject)
      }

      if(delay === 0){
        execute()
      }else{
        this.timeoutID = setTimeout(execute, delay)
      }
    })

  }

  cancel(){
    if(this.timeoutID == null){
      return
    }
    clearTimeout(this.timeoutID)
    this.timeoutID = null
    this.pendingResolve?.()
    this.pendingResolve = null
  }

  /**
   * @returns 実行待ちの呼び出しがある場合はtrue
   */
  isWaiting(): boolean{
    return this.timeoutID != null
  }

  /**
   *
   * @returns 実行中で未完了の件数
   */
  getExecutingCount(): number{
    return this.executingCount
  }

  private execute(func: DebouncedFunction): Promise<void>{
    this.executingCount += 1

    let result: void | PromiseLike<unknown>
    try{
      result = func()
    }catch(error){
      this.executingCount -= 1
      return Promise.reject(error)
    }
    if(result == null){
      this.executingCount -= 1
      return Promise.resolve()
    }

    return Promise.resolve(result).then(
      () => {
        this.executingCount -= 1
      },
      (error) => {
        this.executingCount -= 1
        throw error
      },
    )
  }

}

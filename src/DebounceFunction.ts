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

  /**
   * 関数を実行する。waitが0以下の場合はすぐに実行する。
   *
   * @param func 実行する関数
   * @param wait 実行まで待機する時間[ms]
   */
  runAfter(func: DebouncedFunction, wait: number): void{
    if(this.timeoutID != null){
      this.cancel()
    }

    if(wait <= 0){
      this.execute(func)
      return
    }

    this.timeoutID = setTimeout(() => {
      this.timeoutID = null
      this.execute(func)
    }, wait)

  }

  cancel(){
    if(this.timeoutID == null){
      return
    }
    clearTimeout(this.timeoutID)
    this.timeoutID = null
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

  private execute(func: DebouncedFunction): void{
    this.executingCount += 1

    let result
    try{
      result = func()
    }catch(error){
      this.executingCount -= 1
      throw error
    }
    if(result == null){
      this.executingCount -= 1
      return
    }

    result.then(
      () => {
        this.executingCount -= 1
      },
      () => {
        this.executingCount -= 1
      },
    )
  }

}

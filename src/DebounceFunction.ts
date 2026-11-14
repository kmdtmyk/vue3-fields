type DebouncedFunction = () => void | PromiseLike<unknown>

export default class{

  private timeoutID: ReturnType<typeof setTimeout> | null = null
  private executingCount = 0

  call(func: DebouncedFunction, wait: number): void{
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

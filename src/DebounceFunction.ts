type DebouncedFunction = (...args: any[]) => void | PromiseLike<unknown>

export default class{

  private timeoutID: ReturnType<typeof setTimeout> | null = null
  private executingCount = 0

  constructor(private readonly func: DebouncedFunction){
  }

  call(option: {wait: number, arguments: any[]}): void{

    const {wait} = option

    if(this.timeoutID != null){
      this.cancel()
    }

    if(wait <= 0){
      this.execute(option.arguments)
      return
    }

    this.timeoutID = setTimeout(() => {
      this.timeoutID = null
      this.execute(option.arguments)
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

  private execute(arguments_: any[]): void{
    this.executingCount += 1

    let result
    try{
      result = this.func(...arguments_)
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

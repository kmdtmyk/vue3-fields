export default class{

  private timeoutID: ReturnType<typeof setTimeout> | null = null
  private executingCount = 0

  constructor(private readonly func: Function){
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
   *
   * @returns 実行中で未完了の件数
   */
  getExecutingCount(): number{
    return this.executingCount
  }

  private execute(arguments_: any[]): void{
    this.executingCount += 1

    const result = this.func(...arguments_)
    if(result == null || typeof result.then !== 'function'){
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

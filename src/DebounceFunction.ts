export default class{

  private timeoutID: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly func: Function){
  }

  call(option: {wait: number, arguments: any}){

    const {wait} = option

    if(this.timeoutID != null){
      this.cancel()
    }

    if(wait <= 0){
      this.func(...option.arguments)
      return
    }

    this.timeoutID = setTimeout(() => {
      this.timeoutID = null
      this.func(...option.arguments)
    }, wait)

  }

  cancel(){
    if(this.timeoutID == null){
      return
    }
    clearTimeout(this.timeoutID)
    this.timeoutID = null
  }

}

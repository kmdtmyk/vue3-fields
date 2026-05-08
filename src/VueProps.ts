export default class{

  static isAsyncFunction(prop: any){
    if(prop instanceof Function === false){
      return false
    }
    if(prop.constructor.name === 'AsyncFunction'){
      return true
    }
    return false
  }

  static toOnOff(prop: any): 'on' | 'off' | null {
    if(prop === true || prop === 'on'){
      return 'on'
    }
    if(prop === false || prop === 'off'){
      return 'off'
    }
    return null
  }

}

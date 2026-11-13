export default class{

  static isAsyncFunction(prop: unknown): prop is (...args: any[]) => Promise<any>{
    if(typeof prop !== 'function'){
      return false
    }
    if(prop.constructor.name === 'AsyncFunction'){
      return true
    }
    return false
  }

  static isSyncFunction(prop: unknown): prop is (...args: any[]) => any{
    return typeof prop === 'function' && this.isAsyncFunction(prop) === false
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

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

}

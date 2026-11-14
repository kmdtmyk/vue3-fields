import Strings from './Strings'

export default class{

  static from<T>(arrayLike: unknown): T[]{
    if(Array.isArray(arrayLike)){
      return arrayLike
    }

    if(arrayLike instanceof Function){
      return this.from(arrayLike())
    }

    return []
  }

  static isNullOrEmpty<T>(array: T[] | null | undefined): boolean{
    if(array == null){
      return true
    }
    return array.length === 0
  }

  static search<T>(array: T[], query: string): T[]{
    if(Strings.isEmpty(query)){
      return array
    }
    const words = query.split(/\s/)
    return array.filter(value => {
      return words.every(word => {
        if(value instanceof Object){
          return Object.values(value).find(value => {
            return Strings.includes(String(value), word, {ignoreCase: true})
          }) != null
        }else{
          return Strings.includes(String(value), word, {ignoreCase: true})
        }
      })
    })
  }

}

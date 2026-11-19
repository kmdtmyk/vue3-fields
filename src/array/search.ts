import {includes} from '../string/includes'
import {isEmpty} from '../string/isEmpty'

export const search = <T>(array: T[], query: string): T[] => {
  if(isEmpty(query)){
    return array
  }
  const words = query.split(/\s/)
  return array.filter(value => words.every(word => {
    if(value instanceof Object){
      return Object.values(value).find(value => {
        return includes(String(value), word, {ignoreCase: true})
      }) != null
    }
    return includes(String(value), word, {ignoreCase: true})
  }))
}

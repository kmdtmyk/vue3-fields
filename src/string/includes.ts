import {isEmpty} from './isEmpty'

export const includes = (
  text: string,
  value: string | null | undefined,
  options: {ignoreCase?: boolean} = {},
) => {
  if(isEmpty(text) || isEmpty(value) || value == null){
    return false
  }
  if(options.ignoreCase === true){
    return text.toLowerCase().includes(value.toLowerCase())
  }
  return text.includes(value)
}

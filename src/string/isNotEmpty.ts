import {isEmpty} from './isEmpty'

export const isNotEmpty = (value: string | null | undefined): boolean => {
  return isEmpty(value) === false
}

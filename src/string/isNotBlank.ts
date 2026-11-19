import {isBlank} from './isBlank'

export const isNotBlank = (value: string | null | undefined): boolean => {
  return isBlank(value) === false
}

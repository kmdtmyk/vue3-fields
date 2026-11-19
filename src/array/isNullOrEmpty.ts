export const isNullOrEmpty = <T>(array: T[] | null | undefined): boolean => {
  return array == null || array.length === 0
}

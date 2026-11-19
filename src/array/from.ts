export const from = <T>(arrayLike: unknown): T[] => {
  if(Array.isArray(arrayLike)){
    return arrayLike
  }
  if(arrayLike instanceof Function){
    return from<T>(arrayLike())
  }
  return []
}

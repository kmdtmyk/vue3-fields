export const toArray = <T>(arrayLike: unknown): T[] => {
  if(Array.isArray(arrayLike)){
    return arrayLike
  }
  if(arrayLike instanceof Function){
    return toArray<T>(arrayLike())
  }
  return []
}

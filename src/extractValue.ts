


const extractValue = (name: string | undefined, value: any): Array<{name: string, value: any}> => {

  if(Array.isArray(value)){
    return value.flatMap((value) => {
      return extractValue(joinNames(name, ''), value)
    })
  }else if(value != null && typeof value === 'object'){
    return Object.entries(value).flatMap(([key, value]) => {
      return extractValue(joinNames(name, key), value)
    })
  }else{
    return [{
      name: joinNames(name),
      value: value,
    }]
  }
}


const joinNames = (...names: Array<string | undefined>): string => {
  if(names[0] == null || names[0] === ''){
    names.shift()
  }

  return names
    .map((name, index) => {
      if(index === 0){
        return name
      }else{
        return `[${name}]`
      }
    }).join('')
}

export default extractValue

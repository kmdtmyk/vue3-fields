export default class{

  static includes(text: string, value: string | null | undefined, options: {ignoreCase?: boolean} = {}){
    if(this.isEmpty(text) || this.isEmpty(value)){
      return false
    }
    if(value == null){
      return false
    }
    if(options.ignoreCase === true){
      return text.toString().toLowerCase().includes(value.toLowerCase())
    }else{
      return text.toString().includes(value)
    }
  }

  static isBlank(value: string | null | undefined): boolean{
    if(value == null){
      return true
    }

    return /^\s*$/.test(value)
  }

  static isNotBlank(value: string | null | undefined): boolean{
    return this.isBlank(value) === false
  }

  static isEmpty(value: string | null | undefined): boolean{
    if(value == null){
      return true
    }

    return value === ''
  }

  static isNotEmpty(value: string | null | undefined): boolean{
    return this.isEmpty(value) === false
  }

}

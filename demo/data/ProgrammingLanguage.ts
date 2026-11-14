export default class ProgrammingLanguage {

  private static readonly all = [
    'C', 'Java', 'C++', 'Python', 'JavaScript', 'Perl', 'PHP', 'Rust', 'Go', 'Ruby', 'Swift', 'Kotlin',
    'C#', 'TypeScript', 'R', 'Dart', 'Scala', 'Haskell', 'Lua', 'Objective-C', 'Visual Basic', 'Fortran', 'COBOL', 'SQL',
  ]

  static search = (query: string) => {
    return ProgrammingLanguage.all.filter(language => {
      return language.toLowerCase().includes(query.toLowerCase())
    })
  }

}

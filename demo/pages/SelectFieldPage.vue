<template lang='pug'>
h1 SelectField
SelectField(
  :records='records'
)
  template(#empty)
    i Not found
</template>

<script lang='ts' setup>
import SelectField from '@/src/SelectField.vue'

const languages = [
  'C', 'Java', 'C++', 'Python', 'JavaScript', 'Perl', 'PHP', 'Rust', 'Go', 'Ruby', 'Swift', 'Kotlin',
  'C#', 'TypeScript', 'R', 'Dart', 'Scala', 'Haskell', 'Lua', 'Objective-C', 'Visual Basic', 'Fortran', 'COBOL', 'SQL',
]

const records = (q: string) => {
  return languages.filter(language => {
    return language.toLowerCase().includes(q.toLowerCase())
  })
}
</script>

<template lang='pug'>
h1 SelectField (async function & debounceTime)
SelectField(
  :records='records'
  :debounce-time='1000'
)
  template(#empty)
    i Not found
</template>

<script lang='ts' setup>
import SelectField from '@/src/SelectField.vue'
import sleep from '@/demo/sleep'

const languages = [
  'C', 'Java', 'C++', 'Python', 'JavaScript', 'Perl', 'PHP', 'Rust', 'Go', 'Ruby', 'Swift', 'Kotlin',
  'C#', 'TypeScript', 'R', 'Dart', 'Scala', 'Haskell', 'Lua', 'Objective-C', 'Visual Basic', 'Fortran', 'COBOL', 'SQL',
]

const records = async (q: string) => {
  await sleep(300)
  return languages.filter(language => {
    return language.toLowerCase().includes(q.toLowerCase())
  })
}
</script>

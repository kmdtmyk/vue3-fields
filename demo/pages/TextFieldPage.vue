<template lang='pug'>
h1 TextField
TextField(
  :autocomplete='autocomplete'
)
</template>

<script lang='ts' setup>
import TextField from '@/src/TextField.vue'
import sleep from '@/demo/sleep'

const languages = [
  'C', 'Java', 'C++', 'Python', 'JavaScript', 'Perl', 'PHP', 'Rust', 'Go', 'Ruby', 'Swift', 'Kotlin',
  'C#', 'TypeScript', 'R', 'Dart', 'Scala', 'Haskell', 'Lua', 'Objective-C', 'Visual Basic', 'Fortran', 'COBOL', 'SQL',
]

const autocomplete = async (q: string) => {
  await sleep(300)
  return languages.filter(language => {
    return language.toLowerCase().includes(q.toLowerCase())
  })
}
</script>

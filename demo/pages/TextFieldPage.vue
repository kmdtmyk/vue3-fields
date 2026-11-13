<template lang='pug'>
h1 TextField
TextField(
  :autocomplete='autocomplete'
)
</template>

<script lang='ts' setup>
import TextField from '@/src/TextField.vue'
import sleep from '@/demo/sleep'

const languages = ['C', 'Java', 'C++', 'Python', 'JavaScript', 'Perl', 'PHP', 'Rust', 'Go', 'Ruby', 'Swift', 'Kotlin']

const autocomplete = async () => {
  await sleep(300)
  return languages
}
</script>

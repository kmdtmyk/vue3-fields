<template lang='pug'>
h1 TextField
TextField(
  :autocomplete='autocomplete'
)
</template>

<script lang='ts' setup>
import TextField from '@/src/TextField.vue'
import ProgrammingLanguage from '@/demo/data/ProgrammingLanguage'

const autocomplete = (q: string) => {
  return ProgrammingLanguage.search(q)
}
</script>

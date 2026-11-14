<template lang='pug'>
h1 TextField (async function)
TextField(
  :autocomplete='autocomplete'
)
</template>

<script lang='ts' setup>
import TextField from '@/src/TextField.vue'
import sleep from '@/demo/sleep'
import ProgrammingLanguage from '@/demo/data/ProgrammingLanguage'

const autocomplete = async (q: string) => {
  await sleep(300)
  return ProgrammingLanguage.search(q)
}
</script>

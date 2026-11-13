<template lang='pug'>
h1 TextField
TextField(
  :autocomplete='autocomplete'
)
</template>

<script lang='ts' setup>
import TextField from '@/src/TextField.vue'
import {languages} from '@/demo/data'
import sleep from '@/demo/sleep'

const autocomplete = async () => {
  await sleep(300)
  return languages
}
</script>

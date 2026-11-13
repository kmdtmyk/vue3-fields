<template lang='pug'>
h1 SelectField (async function)
SelectField(
  :records='records'
)
  template(#empty)
    i Not found
</template>

<script lang='ts' setup>
import SelectField from '@/src/SelectField.vue'
import {languages} from '@/demo/data'
import sleep from '@/demo/sleep'

const records = async () => {
  await sleep(300)
  return languages
}
</script>

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
import ProgrammingLanguage from '@/demo/data/ProgrammingLanguage'

const records = async (q: string) => {
  await sleep(300)
  return ProgrammingLanguage.search(q)
}
</script>

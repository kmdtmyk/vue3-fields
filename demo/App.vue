<template lang='pug'>
SelectField(
  :records='records'
)
</template>

<script lang='ts' setup>
import SelectField from '../src/SelectField.vue'

const records = async () => {
  await sleep(500)
  return ['a', 'b']
}

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
</script>

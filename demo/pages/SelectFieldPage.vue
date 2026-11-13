<template lang='pug'>
h1 SelectField
SelectField(
  :records='records'
)
  template(#empty)
    i Not found
</template>

<script lang='ts' setup>
import SelectField from '../../src/SelectField.vue'

const languages = ['C', 'Java', 'C++', 'Python', 'JavaScript', 'Perl', 'PHP', 'Rust', 'Go', 'Ruby', 'Swift', 'Kotlin']

const records = async () => {
  await sleep(300)
  return languages
}

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
</script>

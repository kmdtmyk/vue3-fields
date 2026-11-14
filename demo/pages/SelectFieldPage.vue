<template lang='pug'>
h1 SelectField
SelectField(
  :records='records'
)
  template(#empty)
    i Not found
</template>

<script lang='ts' setup>
import SelectField from '@/src/SelectField.vue'
import ProgrammingLanguage from '@/demo/data/ProgrammingLanguage'

const records = (q: string) => {
  return ProgrammingLanguage.search(q)
}
</script>

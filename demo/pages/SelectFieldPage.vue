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
import {languages} from '@/demo/data'

const records = () => {
  return languages
}
</script>

<template lang='pug'>
h1 SelectField (records)
SelectField(
  v-model='value'
  v-model:record='record'
  :records='records'
  record-key='id'
)
  template(v-slot='{record}') {{record.id}}: {{record.name}}
  template(#empty)
    i Not found
p v-model: {{value}}
p v-model:record: {{record}}
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import SelectField from '@/src/SelectField.vue'
import sleep from '@/demo/sleep'

const items = [
  {id: 1, name: 'item1'},
  {id: 2, name: 'item2'},
  {id: 3, name: 'item3'},
]

const value = ref(null)
const record = ref(null)

const records = async (q: string) => {
  await sleep(300)
  return items.filter(item => {
    return item.name.toLowerCase().includes(q.toLowerCase())
  })
}
</script>

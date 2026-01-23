<!-- input(type='hidden')をまとめて作る -->
<template lang='pug'>
input(
  v-for='attribute in attributes'
  type='hidden'
  :name='attribute.name'
  :value='normalizeValue(attribute.value)'
)
</template>

<script lang='ts' setup>
import {computed} from 'vue'
import extractValue from './extractValue'

const props = defineProps<{
  name?: string
  value: any
}>()

const attributes = computed(() => {
  return extractValue(props.name ?? '', props.value)
})

const normalizeValue = (value: any) => {
  if(value == null){
    return ''
  }
  return value
}
</script>

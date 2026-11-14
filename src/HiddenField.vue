<!-- input(type='hidden')をまとめて作る -->
<template lang='pug'>
input(
  v-for='attribute in attributes'
  type='hidden'
  :name='attribute.name'
  :value='normalizeValue(attribute.value)'
  :disabled='props.disabled'
)
</template>

<script lang='ts' setup>
import {computed} from 'vue'
import extractValue from './extractValue'

const props = defineProps<{
  name?: string
  value: unknown
  disabled?: boolean
}>()

const attributes = computed(() => {
  return extractValue(props.name ?? '', props.value)
})

const normalizeValue = (value: unknown) => {
  if(value == null){
    return ''
  }
  return value
}

defineOptions({
  inheritAttrs: false,
})
</script>

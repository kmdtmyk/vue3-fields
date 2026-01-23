<!-- input(type='hidden')をまとめて作る -->
<template lang='pug'>
input(
  v-for='attribute in attributes'
  type='hidden'
  :name='joinNames(props.name, attribute.name)'
  :value='attribute.value'
)
</template>

<script lang='ts' setup>
import {computed} from 'vue'

const props = defineProps<{
  name?: string
  value: any
}>()

const attributes = computed(() => {
  return Object.keys(props.value).map(key => {
    return {
      name: key,
      value: normalizeValue(props.value[key]),
    }
  })
})

const normalizeValue = (value: any) => {
  if(value == null){
    return ''
  }
  return value
}

const joinNames = (...names: string[]): string => {
  return [...names]
    .filter(name => name != null)
    .map((name, index) => {
      if(index === 0){
        return name
      }else{
        return `[${name}]`
      }
    }).join('')
}
</script>

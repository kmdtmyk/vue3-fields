<!-- input(type='hidden')をまとめて作る -->
<template lang='pug'>
input(
  v-for='attribute in attributes'
  type='hidden'
  :name='attribute.name'
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
  return extract(props.name, props.value)
})

const extract = (name: string | undefined, value: any) => {
  return Object.entries(value).flatMap(([key, value]) => {
    if(Array.isArray(value)){
      return value.map((value) => {
        return {
          name: joinNames(name, key, ''),
          value: normalizeValue(value),
        }
      })
    }else{
      return {
        name: joinNames(name, key),
        value: normalizeValue(value),
      }
    }
  })
}

const normalizeValue = (value: any) => {
  if(value == null){
    return ''
  }
  return value
}

const joinNames = (...names: Array<string | undefined>): string => {
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

// console.log(attributes.value)
</script>

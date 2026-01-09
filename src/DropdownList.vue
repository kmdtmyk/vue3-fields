<template lang='pug'>
.dropdown-list(
  ref='el'
  v-if='0 < records.length || $slots.empty != null'
  @mouseleave='selectedIndex = null'
)
  dropdown-list-item(
    v-if='0 < records.length'
    v-for='(record, index) in records'
    :class='{selected: selectedIndex === index}'
    :key='index'
    @mouseenter='selectedIndex = index'
    @mousemove='selectedIndex = index'
    @mousedown='select'
  )
    slot(v-bind='{record}' v-if='$slots.default')
    template(v-else) {{record}}
  dropdown-list-item.empty(v-if='$slots.empty != null && records.length === 0')
    slot(name='empty')
</template>

<script lang='ts' setup>
import {ref} from 'vue'
import DropdownListItem from './DropdownListItem.vue'

const {records} = defineProps<{
  records: any[]
}>()

const selectedIndex = ref(0)

const emits = defineEmits(['input'])

const up = () => {
  const current = selectedIndex.value
  const next = current - 1
  const {length} = records
  selectedIndex.value = (next + length) % length
  autoScroll()
}

const down = () => {
  const current = selectedIndex.value
  const next = current === null ? 0 : current + 1
  const {length} = records
  selectedIndex.value = (next + length) % length
  autoScroll()
}

const select = () => {
  const record = records[selectedIndex.value]
  if(record == null){
    return false
  }
  emits('input', record)
  return true
}

const el = ref<HTMLElement>()

const autoScroll = () => {
  const dropdown = el.value
  if(dropdown == null || dropdown.children == null){
    return
  }
  const selected = dropdown.children[selectedIndex.value]
  if(selected instanceof HTMLElement){
    const topOver = dropdown.scrollTop - selected.offsetTop
    const bottomOver = selected.offsetTop + selected.offsetHeight - dropdown.scrollTop - dropdown.offsetHeight
    if(0 < topOver){
      dropdown.scrollTop = dropdown.scrollTop - topOver
    }else if(0 < bottomOver){
      dropdown.scrollTop = dropdown.scrollTop + bottomOver
    }
  }
}

defineExpose({
  up,
  down,
  select,
})
</script>

<style scoped>
.dropdown-list{
  position: static !important;
  border: none !important;
  border-radius: 0 !important;
  max-height: 15.1em;
  overflow-y: auto;
  word-break: break-all;
}
</style>

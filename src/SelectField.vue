<template lang='pug'>
DropdownInput(
  ref='dropdownInput'
  v-model='inputValue'
  v-bind='$attrs'
  type='text'
  autocomplete='off'
  :placeholder='placeholder'
  :required='props.required !== false && isEmpty === true'
  :clear='props.required === false && isEmpty === false'
  :dropdown-style='props.dropdownStyle'
  :class='{empty: isEmpty}'
  :loading='loading || $attrs.loading'
  @input='onInput'
  @keydown.up='onKeydownUp'
  @keydown.down='onKeydownDown'
  @keydown.enter='onKeydownEnter'
  @keydown.delete='onKeydownDelete'
  @focus='onFocus'
  @blur='onBlur'
  @clear='clear'
)
  DropdownList(
    ref='dropdown'
    v-if='dropdownRecords != null'
    :records='dropdownRecords'
    @input='select'
  )
    template(v-slot='{record}')
      slot(v-bind='{record}' v-if='$slots.default')
      template(v-else) {{record}}
    template(v-slot:empty='' v-if='$slots.empty && inputValue !== ""')
      slot(name='empty')
input(
  v-if='$props.name != null'
  type='hidden'
  :name='$props.name' :value='localValue'
)
</template>

<script lang='ts' setup>
import {computed, nextTick, ref, useSlots, watch} from 'vue'
import DropdownInput from './DropdownInput.vue'
import DropdownList from './DropdownList.vue'
import Arrays from './Arrays'
import Strings from './Strings'
import useSearchRecords, {isRecordsSource} from './useSearchRecords'
import type {AsyncWait} from './useSearchRecords'


defineOptions({
  inheritAttrs: false,
})

const modelValue = defineModel()

const props = defineProps<{
  name?: string
  required?: boolean | string
  records?: Array<any> | ((query: string) => Array<any> | Promise<Array<any>>)
  record?: Object
  recordKey?: string
  asyncWait?: AsyncWait
  dropdownStyle?: string | Object
  placeholder?: string
}>()

const emits = defineEmits([
  'update:record',
  'update:modelValue',
  'input',
])

const localValue = ref<any>(null)
const inputValue = ref<string>('')
const selectedRecord = ref<any>(null)

const recordsSource = isRecordsSource<any>(props.records) ? props.records : null
const {
  records: dropdownRecords,
  loading,
  isAsync,
  search: searchRecords,
} = useSearchRecords(recordsSource, props.asyncWait)


watch(modelValue, (value) => {
  localValue.value = value
  const {recordKey} = props

  if(recordKey != null && isAsync === false){
    if(value == null){
      selectedRecord.value = null
      return
    }
    selectedRecord.value = Arrays.from<Record<string, unknown>>(recordsSource).find(record => {
      return record[recordKey] === value
    })
  }
},  {immediate: true})

watch(() => props.record, (value) => {
  if(props.recordKey != null && value !== undefined){
    selectedRecord.value = value
  }
}, {immediate: true})

const placeholder = computed(() => {
  if(selectedRecord.value != null){
    return recordText(selectedRecord.value)
  }
  if(Strings.isNotEmpty(localValue.value)){
    return localValue.value
  }
  return props.placeholder
})

const isEmpty = computed(() => {
  return Strings.isEmpty(localValue.value)
})

const dropdownInput = ref<InstanceType<typeof DropdownInput>>()

const onFocus = (e: Event) => {
  const input = dropdownInput.value?.input
  if(input?.readOnly === true){
    // TODO: test code
    inputValue.value = placeholder.value
  }else if(dropdownRecords.value == null){
    searchRecords(inputValue.value)
  }
}

const onBlur = (e: Event) => {
  inputValue.value = ''
}

const onInput = (e: Event) => {
  searchRecords(inputValue.value)
}

const dropdown = ref<InstanceType<typeof DropdownList> | null>(null)

const onKeydownUp = async (e: Event) => {
  if(dropdown.value?.up() === true){
    e.preventDefault()
  }
}

const onKeydownDown = (e: Event) => {
  if(dropdown.value?.down() === true){
    e.preventDefault()
  }
}

const onKeydownEnter = (e: Event) => {
  if(dropdown.value?.select() === true){
    e.preventDefault()
  }
}

const onKeydownDelete = (e: KeyboardEvent) => {
  if(e.target instanceof HTMLInputElement && e.target.value === '' && modelValue.value != null){
    clear()
  }
}

const clear = () => {
  selectedRecord.value = null
  inputValue.value = ''
  localValue.value = null
  emits('update:record', null)
  emits('update:modelValue', null)
  emits('input', localValue.value)
}

const select = (record: any) => {
  if(record instanceof Object){
    selectedRecord.value = record
  }
  inputValue.value = recordText(record)
  const {recordKey} = props
  if(recordKey != null){
    selectedRecord.value = record
    emits('update:record', record)
    emits('update:modelValue', record[recordKey])
    localValue.value = record[recordKey]
  }else{
    emits('update:modelValue', record)
    localValue.value = record
  }
  emits('input', localValue.value)
}

const slots = useSlots()

const recordText = (record: any) => {
  if(record == null){
    return ''
  }
  const slot = slots.default
  if(slot != null){
    const vnode = slot({record})
    return vnode[0].children
  }
  return record.toString()
}

defineExpose({
  select,
})
</script>

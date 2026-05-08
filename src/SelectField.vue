<template lang='pug'>
DropdownInput(
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
  @input.native='onInputNative'
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
      template(v-else-if='typeof record === "string" && record.trim() === ""') &nbsp;
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
import {computed, nextTick, ref, useAttrs, useSlots, watch} from 'vue'
import DropdownInput from './DropdownInput.vue'
import DropdownList from './DropdownList.vue'
import Arrays from './Arrays'
import Strings from './Strings'
import VueAttrs from './VueAttrs'
import VueProps from './VueProps'
import DebounceFunction from './DebounceFunction'
import defaultAsyncWait from './defaultAsyncWait'


defineOptions({
  inheritAttrs: false,
})

const modelValue = defineModel()

const props = defineProps<{
  name?: string
  required?: boolean | string
  records?: Array<Object> | Function
  record?: Object
  recordKey?: string
  asyncWait?: number | Function
  dropdownStyle?: string | Object
  placeholder?: string
}>()

const emits = defineEmits([
  'update:record',
  'update:modelValue',
  'input',
])

const loading = ref<boolean>(false)
const asyncRecords = ref<Array<any> | null>(null)
const localValue = ref<any>(null)
const inputValue = ref<string>('')
const selectedRecord = ref<any>(null)


watch(modelValue, (value) => {
  localValue.value = value
  const {recordKey} = props

  // if(recordKey != null && isAsync.value === false){
  if(recordKey != null){
    if(value == null){
      selectedRecord.value = null
      return
    }
    selectedRecord.value = Arrays.from(props.records).find(record => {
      return record[recordKey] === value
    })
  }
},  {immediate: true})

watch(() => props.record, (value) => {
  if(props.recordKey != null && value !== undefined){
    selectedRecord.value = value
  }
}, {immediate: true})

watch(() => props.records, (value) => {
  if(isAsync.value === true){
    asyncRecords.value = null
  }
})

const dropdownRecords = computed(() => {
  if(isAsync.value === true){
    return asyncRecords.value
  }else if(props.records instanceof Function){
    return props.records(inputValue)
  }else if(Array.isArray(props.records)){
    return Arrays.search(props.records, inputValue.value)
  }
  return null
})

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

const asyncRecordsFunction = computed(() => {
  let lastAsyncRecordsTime = 0
  return new DebounceFunction((query: any) => {
    const startTime = Date.now()
    if(props.records instanceof Function === false){
      return
    }
    props.records(query).then(
      (data: any) => {
        if(startTime < lastAsyncRecordsTime){
          return
        }
        lastAsyncRecordsTime = startTime
        asyncRecords.value = data
        loading.value = false
      },
      (error: any) => {
        loading.value = false
      }
    )
  })
})

const isAsync = computed(() => {
  if(props.asyncWait != null){
    return true
  }
  return VueProps.isAsyncFunction(props.records)
})

const attrs = useAttrs()

const onFocus = (e: Event) => {
  if(VueAttrs.readonly(attrs)){
    // TODO: test code
    inputValue.value = placeholder.value
  }else if(isAsync.value === true && Arrays.isNullOrEmpty(asyncRecords.value)){
    callAsyncRecords()
  }
}

const onInputNative = (e: Event) => {
  if(isAsync.value === true){
    callAsyncRecords()
  }
}

const callAsyncRecords = () => {
  const _asyncWait = props.asyncWait ?? defaultAsyncWait
  let wait
  if(_asyncWait instanceof Function){
    wait = _asyncWait(inputValue.value)
  }else{
    wait = _asyncWait
  }
  asyncRecordsFunction.value.call({
    wait,
    arguments: [inputValue.value],
  })
  loading.value = true
}

const dropdown = ref()

const onKeydownUp = async (e: Event) => {
  await nextTick()
  dropdown.value.up()
}

const onKeydownDown = (e: Event) => {
  if(dropdown.value){
    dropdown.value.down()
  }
}

const onKeydownEnter = (e: Event) => {
  if(dropdown.value == null){
    return
  }
  if(dropdown.value.select() === true){
    e.preventDefault()
  }
}

const onKeydownDelete = (e: Event) => {
  const target = e.target as HTMLInputElement
  if(target != null && target.value === '' && modelValue.value != null){
    clear()
  }
}

const onBlur = (e: Event) => {
  inputValue.value = ''
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

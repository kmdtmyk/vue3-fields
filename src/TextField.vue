<template lang='pug'>
DropdownInput(
  v-model='inputValue'
  v-bind='$attrs'
  type='text'
  :autocomplete='autocompleteAttribute'
  :loading='loading || $attrs.loading'
  @input='onInput'
  @keydown.up='onKeydownUp'
  @keydown.down='onKeydownDown'
  @keydown.enter='onKeydownEnter'
  @focus='onFocus'
)
  DropdownList(
    ref='dropdown'
    v-if='useDropdown'
    :records='dropdownRecords'
    @input='select'
  )
</template>

<script lang='ts' setup>
import {computed, nextTick, ref, watch} from 'vue'
import DropdownInput from './DropdownInput.vue'
import DropdownList from './DropdownList.vue'
import Arrays from './Arrays'
import VueProps from './VueProps'
import useAsyncRecords from './useAsyncRecords'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  autocomplete?: string | boolean | string[] | ((query: string) => string[] | Promise<string[]>)
  asyncWait?: number | ((query: string) => number)
}>()

const modelValue = defineModel<string>()

const inputValue = ref('')

const autocomplete = props.autocomplete
const asyncRecordsFunction = VueProps.isAsyncFunction(autocomplete) ? autocomplete : null
const syncRecordsFunction = VueProps.isSyncFunction(autocomplete) ? autocomplete : null
const arrayRecords = Array.isArray(autocomplete) ? autocomplete : null

const useDropdown = computed(() => {
  return arrayRecords != null || syncRecordsFunction != null || asyncRecordsFunction != null
})

const {
  records: asyncRecords,
  loading,
  run: runAsyncRecords,
} = useAsyncRecords(asyncRecordsFunction, props.asyncWait)

const autocompleteAttribute = computed(() => {
  if(Array.isArray(props.autocomplete) || typeof props.autocomplete === 'function'){
    return 'off'
  }
  if(props.autocomplete === true){
    return 'on'
  }
  if(props.autocomplete === false){
    return 'off'
  }
  return props.autocomplete
})

const dropdownRecords = computed(() => {
  if(asyncRecordsFunction != null){
    return asyncRecords.value ?? []
  }else if(syncRecordsFunction != null){
    return syncRecordsFunction(inputValue.value)
  }else if(arrayRecords != null){
    return Arrays.search(arrayRecords, inputValue.value)
  }
  return null
})

watch(modelValue, (value) => {
  inputValue.value = value ?? ''
}, {immediate: true})

const onFocus = () => {
  if(asyncRecordsFunction != null && Arrays.isNullOrEmpty(asyncRecords.value)){
    callAsyncRecords()
  }
}

const onInput = () => {
  modelValue.value = inputValue.value
  if(asyncRecordsFunction != null){
    callAsyncRecords()
  }
}

const callAsyncRecords = () => {
  runAsyncRecords(inputValue.value)
}

const dropdown = ref<InstanceType<typeof DropdownList> | null>(null)

const onKeydownUp = (event: KeyboardEvent) => {
  if(!useDropdown.value){
    return
  }
  event.preventDefault()
  dropdown.value?.up()
}

const onKeydownDown = (event: KeyboardEvent) => {
  if(!useDropdown.value){
    return
  }
  event.preventDefault()
  dropdown.value?.down()
}

const onKeydownEnter = (event: KeyboardEvent) => {
  if(!useDropdown.value || dropdown.value == null){
    return
  }
  if(dropdown.value.select() === true){
    event.preventDefault()
  }
}

const select = (record: string) => {
  inputValue.value = record
  modelValue.value = record
}
</script>

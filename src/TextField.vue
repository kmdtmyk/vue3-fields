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
import AsyncDebounceFilter from './AsyncDebounceFilter'
import defaultAsyncWait from './defaultAsyncWait'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  autocomplete?: string | boolean | string[] | ((query: string) => string[] | Promise<string[]>)
  asyncWait?: number | ((query: string) => number)
}>()

const modelValue = defineModel<string>()

const loading = ref(false)
const asyncRecords = ref<string[]>([])
const inputValue = ref('')

const useDropdown = computed(() => {
  return props.autocomplete instanceof Array || props.autocomplete instanceof Function
})

const isAsync = computed(() => {
  return VueProps.isAsyncFunction(props.autocomplete)
})

const autocompleteAttribute = computed(() => {
  if(useDropdown.value){
    return 'off'
  }
  return VueProps.toOnOff(props.autocomplete)
})

const dropdownRecords = computed(() => {
  if(isAsync.value === true){
    return asyncRecords.value
  }

  if(props.autocomplete instanceof Function){
    return props.autocomplete(inputValue.value)
  }else if(Array.isArray(props.autocomplete)){
    return Arrays.search(props.autocomplete, inputValue.value)
  }
  return null
})

let asyncRecordsFilter: AsyncDebounceFilter<string[]> | null = null
if(isAsync.value === true){
  asyncRecordsFilter = new AsyncDebounceFilter(
    (records) => {
      asyncRecords.value = records
      loading.value = asyncRecordsFilter?.hasPending() ?? false
    },
    () => {
      loading.value = asyncRecordsFilter?.hasPending() ?? false
    },
  )
}

watch(modelValue, (value) => {
  inputValue.value = value ?? ''
}, {immediate: true})

const onFocus = () => {
  if(isAsync.value === true && Arrays.isNullOrEmpty(asyncRecords.value)){
    callAsyncRecords()
  }
}

const onInput = () => {
  modelValue.value = inputValue.value
  if(isAsync.value === true){
    callAsyncRecords()
  }
}

const callAsyncRecords = () => {
  if(isAsync.value !== true || asyncRecordsFilter == null){
    return
  }

  let wait
  if(props.asyncWait instanceof Function){
    wait = props.asyncWait(inputValue.value)
  }else if(props.asyncWait != null){
    wait = props.asyncWait
  }else{
    wait = defaultAsyncWait(inputValue.value)
  }

  const autocomplete = props.autocomplete as (query: string) => Promise<any[]>
  asyncRecordsFilter.run(
    () => autocomplete(inputValue.value),
    wait,
  )
  loading.value = true
}

const dropdown = ref<InstanceType<typeof DropdownList> | null>(null)

const onKeydownUp = (event: KeyboardEvent) => {
  if(!useDropdown.value){
    return
  }
  event.preventDefault()
  if(dropdown.value != null){
    dropdown.value.up()
    return
  }
  nextTick(() => {
    dropdown.value?.up()
  })
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

const select = (record: any) => {
  inputValue.value = record
  modelValue.value = record
}
</script>

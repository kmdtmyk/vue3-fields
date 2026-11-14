<template lang='pug'>
DropdownInput(
  v-model='inputValue'
  v-bind='$attrs'
  type='text'
  :autocomplete='autocompleteAttribute'
  :loading='loading'
  @input='onInput'
  @keydown.up='onKeydownUp'
  @keydown.down='onKeydownDown'
  @keydown.enter='onKeydownEnter'
  @focus='onFocus'
)
  DropdownList(
    ref='dropdown'
    v-if='dropdownRecords != null'
    :records='dropdownRecords'
    @input='select'
  )
</template>

<script lang='ts' setup>
import {computed, ref, watch} from 'vue'
import DropdownInput from './DropdownInput.vue'
import DropdownList from './DropdownList.vue'
import useSearchRecords, {isRecordsSource} from './useSearchRecords'
import type {DebounceTime} from './useSearchRecords'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  autocomplete?: string | boolean | string[] | ((query: string) => string[] | Promise<string[]>)
  debounceTime?: DebounceTime
}>()

const modelValue = defineModel<string>()

const inputValue = ref('')

const recordsSource = isRecordsSource<string>(props.autocomplete) ? props.autocomplete : null

const {
  records: dropdownRecords,
  loading,
  search: searchDropdownRecords,
} = useSearchRecords(recordsSource, props.debounceTime)


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

watch(modelValue, (value) => {
  inputValue.value = value ?? ''
}, {immediate: true})

const onFocus = () => {
  if(dropdownRecords.value == null){
    searchDropdownRecords(inputValue.value)
  }
}

const onInput = () => {
  modelValue.value = inputValue.value
  searchDropdownRecords(inputValue.value)
}

const dropdown = ref<InstanceType<typeof DropdownList> | null>(null)

const onKeydownUp = (event: KeyboardEvent) => {
  if(dropdown.value?.up() === true){
    event.preventDefault()
  }
}

const onKeydownDown = (event: KeyboardEvent) => {
  if(dropdown.value?.down() === true){
    event.preventDefault()
  }
}

const onKeydownEnter = (event: KeyboardEvent) => {
  if(dropdown.value?.select() === true){
    event.preventDefault()
  }
}

const select = (record: string) => {
  inputValue.value = record
  modelValue.value = record
}
</script>

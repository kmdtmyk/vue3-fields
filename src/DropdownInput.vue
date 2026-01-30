<template lang='pug'>
input(
  ref='input'
  v-model='inputValue'
  v-bind='$attrs'
  :readonly='readonly'
  :disabled='disabled'
  @mousedown='dropdownOpen = true'
  @focus='dropdownOpen = true'
  @blur='dropdownOpen = false'
  @keydown.up='dropdownOpen = true'
  @keydown.down='dropdownOpen = true'
  @keydown.enter='dropdownOpen = false'
  @keydown.esc='onKeydownEsc'
  :data-anchor='anchorName'
)
.spinner(v-if='loading' :data-anchor='anchorName')
  LoadingSpinner
.clear(v-else-if='clearable' @click='clickClear' :data-anchor='anchorName')
.dropdown(
  v-if='editable && dropdownOpen'
  :style='dropdownStyle'
  :data-anchor='anchorName'
)
  slot
</template>

<script lang='ts' setup>
import {computed, ref, watch} from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import {v4 as uuid} from 'uuid'

defineOptions({
  inheritAttrs: false,
})

const modelValue = defineModel()

const {clear, loading, readonly, disabled} = defineProps<{
  clear?: boolean
  loading?: boolean
  readonly?: boolean
  disabled?: boolean
}>()

const dropdownOpen = ref(false)
const inputValue = ref(modelValue)
const dropdownStyle = ref({})
const anchorName = `--${uuid()}`

const editable = computed(() => {
  if(readonly || disabled){
    return false
  }
  return true
})

const clearable = computed(() => {
  if(!editable){
    return false
  }
  if(clear != null){
    return clear
  }
  return modelValue != null
})

watch(() => modelValue.value, () => {
  inputValue.value = modelValue.value
})

watch(() => dropdownOpen.value, () => {
  // スクロール、リサイズ時にドロップダウンを閉じるようにする
  // (selectタグと同じ挙動)
  if(dropdownOpen.value){
    updateDropdownStyle()
    addEventListener('scroll', onWindowScroll)
    addEventListener('resize', onWindowResize)
  }else{
    removeEventListener('scroll', onWindowScroll)
    removeEventListener('resize', onWindowResize)
  }
})

const input = ref<HTMLInputElement>()

const updateDropdownStyle = () => {
  if(input.value == null){
    return
  }
  const {fontSize} = getComputedStyle(input.value)
  const rect = input.value.getBoundingClientRect()
  dropdownStyle.value = {
    fontSize,
    width: `${rect.width}px`,
  }
}

const onWindowScroll = (e: Event) => {
  dropdownOpen.value = false
}

const onWindowResize = (e: Event) => {
  dropdownOpen.value = false
}

const onKeydownEsc = (e: Event) => {
  if(dropdownOpen.value === true){
    dropdownOpen.value = false
    e.preventDefault()
  }
}

const emits = defineEmits(['clear'])

const clickClear = (e: Event) => {
  emits('clear', null)
}

</script>

<style scoped>
input{
  anchor-name: attr(data-anchor type(<custom-ident>));

  &::placeholder{
    color: inherit;
    opacity: 1;
  }

  &:focus, &.empty{
    &::placeholder{
      opacity: 0.6;
    }
  }

}

.dropdown, .spinner, .clear{
  position-anchor: attr(data-anchor type(<custom-ident>));
}

.dropdown{
  border: 1px solid #ced4da;
  box-sizing: border-box;
  background-color: white;
  position: fixed;
  z-index: 9999;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  position-area: bottom span-right;
  position-try-fallbacks: bottom span-left, top span-right, top span-left;

  &:empty{
    display: none;
  }
}


.spinner, .clear{
  position: absolute;
  right: anchor(right);
  top: anchor(top);
  bottom: anchor(bottom);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner{
  width: 1.5em;
}

.clear{
  width: 1.8em;
  text-align: center;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
}

.clear::after{
  content: '×';
  font-size: 1.2em;
}
</style>

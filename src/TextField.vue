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

<script>
import DropdownInput from './DropdownInput.vue'
import DropdownList from './DropdownList.vue'
import Arrays from './Arrays'
import VueProps from './VueProps'
import AsyncDebounceFilter from './AsyncDebounceFilter'
import defaultAsyncWait from './defaultAsyncWait'

export default {
  inheritAttrs: false,
  components: {
    DropdownInput,
    DropdownList,
  },
  props: {
    modelValue: String,
    autocomplete: {
      type: [String, Boolean, Array, Function],
      default(){
        return null
      },
    },
    asyncWait: {
      type: [Number, Function],
    },
  },
  data(){
    return {
      loading: false,
      asyncRecords: [],
      inputValue: '',
      asyncRecordsFilter: null,
    }
  },
  created(){
    if(this.isAsync !== true){
      return
    }

    let filter
    filter = new AsyncDebounceFilter(
      (records) => {
        this.asyncRecords = records
        this.loading = filter.hasPending()
      },
      () => {
        this.loading = filter.hasPending()
      },
    )
    this.asyncRecordsFilter = filter
  },
  watch: {
    modelValue: {
      handler(value){
        this.inputValue = value ?? ''
      },
      immediate: true,
    },
  },
  computed: {
    autocompleteAttribute(){
      if(this.useDropdown){
        return 'off'
      }
      return VueProps.toOnOff(this.autocomplete)
    },
    useDropdown(){
      const {autocomplete} = this.$props
      if(autocomplete instanceof Array || autocomplete instanceof Function){
        return true
      }
      return false
    },
    dropdownRecords(){
      if(this.isAsync){
        return this.asyncRecords
      }

      if(this.autocomplete instanceof Function){
        return this.autocomplete(this.inputValue)
      }else{
        return Arrays.search(this.autocomplete, this.inputValue)
      }
    },
    isAsync(){
      return VueProps.isAsyncFunction(this.autocomplete)
    },
  },
  methods: {
    onFocus(){
      if(this.isAsync === true && Arrays.isNullOrEmpty(this.asyncRecords)){
        this.callAsyncRecords()
      }
    },
    onInput(){
      if(this.isAsync === true){
        this.callAsyncRecords()
      }
    },
    callAsyncRecords(){
      if(this.isAsync !== true){
        return
      }
      let wait
      if(this.asyncWait instanceof Function){
        wait = this.asyncWait(this.inputValue)
      }else if(this.asyncWait != null){
        wait = this.asyncWait
      }else{
        wait = defaultAsyncWait(this.inputValue)
      }
      this.asyncRecordsFilter.run(
        () => this.autocomplete(this.inputValue),
        wait,
      )
      this.loading = true
    },
    onKeydownUp(e){
      if(!this.useDropdown){
        return
      }
      const dropdown = this.$refs.dropdown
      e.preventDefault()
      if(dropdown){
        dropdown.up()
        return
      }
      this.$nextTick(() => {
        this.$refs.dropdown.up()
      })
    },
    onKeydownDown(e){
      if(!this.useDropdown){
        return
      }
      const dropdown = this.$refs.dropdown
      e.preventDefault()
      if(dropdown){
        dropdown.down()
      }
    },
    onKeydownEnter(e){
      if(!this.useDropdown){
        return
      }
      const {dropdown} = this.$refs
      if(dropdown == null){
        return
      }
      if(dropdown.select() === true){
        e.preventDefault()
      }
    },
    select(record){
      this.inputValue = record
      this.$emit('update:modelValue', record)
    },
  },
}
</script>

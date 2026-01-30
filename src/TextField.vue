<template lang='pug'>
DropdownInput(
  ref='input'
  v-model='inputValue'
  v-bind='$attrs'
  type='text'
  :autocomplete='autocompleteAttribute'
  :loading='loading || $attrs.loading'
  @input.native='onInputNative'
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
import Strings from './Strings'
import VueProps from './VueProps'
import DebounceFunction from './DebounceFunction'
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
    }
  },
  watch: {
    modelValue: {
      handler(value){
        this.inputValue = value
      },
      immediate: true,
    },
  },
  computed: {
    // listeners(){
    //   return {
    //     ...this.$listeners,
    //     input: this.input,
    //   }
    // },
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

      let array
      if(this.autocomplete instanceof Function){
        array = this.autocomplete(this.inputValue)
      }else{
        array = Arrays.search(this.autocomplete, this.inputValue)
      }
      return array.filter(value => {
        return Strings.isNotBlank(value)
      })
    },
    isAsync(){
      if(this.asyncWait != null){
        return true
      }
      return VueProps.isAsyncFunction(this.autocomplete)
    },
    asyncRecordsFunction(){
      return new DebounceFunction((query) => {
        const startTime = Date.now()
        this.autocomplete(query).then(
          (data) => {
            if(startTime < this.lastAsyncRecordsTime){
              return
            }
            this.lastAsyncRecordsTime = startTime
            this.asyncRecords = data
            this.loading = false
          },
          (error) => {
            this.loading = false
          }
        )
      })
    },
  },
  methods: {
    onFocus(e){
      if(this.isAsync === true && Arrays.isNullOrEmpty(this.asyncRecords)){
        this.callAsyncRecords()
      }
    },
    onInputNative(e){
      if(this.isAsync === true){
        this.callAsyncRecords()
      }
    },
    callAsyncRecords(){
      let wait
      if(this.asyncWait instanceof Function){
        wait = this.asyncWait(this.inputValue)
      }else{
        wait = this.asyncWait
      }
      this.asyncRecordsFunction.call({
        wait,
        arguments: [this.inputValue],
      })
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
    input(e){
      this.$emit('input', e)
    },
    select(record){
      this.$emit('update:modelValue', record)
    },
  },
}
</script>

<style scoped>
</style>

<template lang='pug'>
dropdown-input(
  type='text'
  autocomplete='off'
  v-model='inputValue'
  :placeholder='placeholder'
  :required='required !== false && isEmpty === true'
  :clear='isEmpty === false'
  :dropdown-style='dropdownStyle'
  :class='class'
  :inputClass='[inputClass, {empty: isEmpty}]'
  :loading='loading || $attrs.loading'
  :style='style'
  :size='size'
  @input.native='onInputNative'
  @keydown.up='onKeydownUp'
  @keydown.down='onKeydownDown'
  @keydown.enter='onKeydownEnter'
  @keydown.delete='onKeydownDelete'
  @focus='onFocus'
  @blur='onBlur'
  @clear='clear'
)
  dropdown-list(
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
  template(v-slot:after='' v-if='$props.name != null')
    input(:name='$props.name' :value='localValue' type='hidden')
</template>

<script>
import DropdownInput from './DropdownInput.vue'
import DropdownList from './DropdownList.vue'
import Arrays from './Arrays'
import Strings from './Strings'
import VueAttrs from './VueAttrs'
import VueProps from './VueProps'
import DebounceFunction from './DebounceFunction'
import defaultAsyncWait from './defaultAsyncWait'

export default {
  inheritAttrs: false,
  components: {
    DropdownList,
    DropdownInput,
  },
  props: {
    modelValue: {
      type: [Number, String, Object],
      default(){
        return null
      },
    },
    name: String,
    required: [Boolean, String],
    class: {},
    inputClass: [String, Array, Object],
    records: {
      type: [Array, Function],
      default(){
        return []
      },
    },
    recordKey: {
      type: String,
    },
    asyncWait: {
      type: [Number, Function],
      default(){
        return defaultAsyncWait
      },
    },
    record: {
      type: Object,
    },
    dropdownStyle: {
      type: [String, Object],
    },
    style: String,
    size: String,
  },
  data(){
    return {
      loading: false,
      asyncRecords: null,
      localValue: null,
      inputValue: '',
      selectedRecord: null,
    }
  },
  watch: {
    modelValue: {
      handler(value){
        this.localValue = value
        const {recordKey} = this

        if(recordKey != null && this.isAsync === false){
          if(value == null){
            this.selectedRecord = null
            return
          }
          this.selectedRecord = Arrays.from(this.records).find(record => {
            return record[recordKey] === value
          })
        }

      },
      immediate: true,
    },
    record: {
      handler(record){
        if(this.recordKey != null && record !== undefined){
          this.selectedRecord = record
        }
      },
      immediate: true,
    },
    records(value){
      if(this.isAsync){
        this.asyncRecords = null
      }
    },
  },
  computed: {
    dropdownRecords(){
      if(this.isAsync){
        return this.asyncRecords
      }else if(this.records instanceof Function){
        return this.records(this.inputValue)
      }else if(Array.isArray(this.records)){
        return Arrays.search(this.records, this.inputValue)
      }
      return null
    },
    placeholder(){
      if(this.selectedRecord){
        return this.recordText(this.selectedRecord)
      }
      if(Strings.isNotEmpty(this.localValue)){
        return this.localValue
      }
      return this.$attrs.placeholder
    },
    isEmpty(){
      return Strings.isEmpty(this.localValue)
    },
    asyncRecordsFunction(){
      return new DebounceFunction((query) => {
        const startTime = Date.now()
        this.records(query).then(
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
    isAsync(){
      if(this.asyncWait != null){
        return true
      }
      return VueProps.isAsyncFunction(this.records)
    },
  },
  methods: {
    onFocus(e){
      if(VueAttrs.readonly(this.$attrs)){
        // TODO: test code
        this.inputValue = this.placeholder
      }else if(this.isAsync === true && Arrays.isNullOrEmpty(this.asyncRecords)){
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
      this.$nextTick(() => {
        this.$refs.dropdown.up()
      })
    },
    onKeydownDown(e){
      if(this.$refs.dropdown){
        this.$refs.dropdown.down()
      }
    },
    onKeydownEnter(e){
      const {dropdown} = this.$refs
      if(dropdown == null){
        return
      }
      if(dropdown.select() === true){
        e.preventDefault()
      }
    },
    onKeydownDelete(e){
      if(e.target.value === '' && this.modelValue != null){
        this.clear()
      }
    },
    onBlur(e){
      this.inputValue = ''
    },
    clear(){
      this.selectedRecord = null
      this.inputValue = null
      this.localValue = null
      this.$emit('update:record', null)
      this.$emit('update:modelValue', null)
      this.$emit('input', this.localValue)
    },
    select(record){
      if(record instanceof Object){
        this.selectedRecord = record
      }
      this.inputValue = this.recordText(record)
      const {recordKey} = this
      if(recordKey != null){
        this.selectedRecord = record
        this.$emit('update:record', record)
        this.$emit('update:modelValue', record[recordKey])
        this.localValue = record[recordKey]
      }else{
        this.$emit('update:modelValue', record)
        this.localValue = record
      }
      this.$emit('input', this.localValue)
    },
    recordText(record){
      if(record == null){
        return ''
      }
      const slot = this.$slots.default
      if(slot != null){
        const vnode = slot({record})
        const text = vnode[0].text || vnode[0].children
        return text.trim()
      }
      return record.toString()
    },
  }
}
</script>

<style scoped>
:deep(input){
  &::placeholder{
    color: inherit;
    opacity: 0.7;
  }
  &:not(:focus):not(.empty)::placeholder{
    opacity: 1;
  }
}
</style>

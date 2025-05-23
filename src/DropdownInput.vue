<template lang='pug'>
.dropdown-input
  input(
    ref='input'
    v-model='inputValue'
    v-bind='$attrs'
    :class='inputClass'
    :style='style'
    :readonly='readonly'
    :disabled='disabled'
    @mousedown='_onMousedown'
    @focus='_onFocus'
    @blur='_onBlur'
    @keydown.up='_onKeydownUp'
    @keydown.down='_onKeydownDown'
    @keydown.enter='_onKeydownEnter'
    @keydown.esc='_onKeydownEsc'
  )
  .spinner(v-if='loading')
    LoadingSpinner
  .clear(v-else-if='clearable' @click='_clickClear')
  .dropdown(
    v-if='editable && dropdownOpen'
    :style='dropdown.style'
    ref='dropdown'
  )
    slot
  slot(name='after')
</template>

<script>
import CssString from './CssString'
import LoadingSpinner from './LoadingSpinner.vue'

export default {
  inheritAttrs: false,
  components: {
    LoadingSpinner,
  },
  props: {
    modelValue: [String],
    clear: Boolean,
    loading: Boolean,
    inputClass: [String, Array, Object],
    readonly: [Boolean, String],
    disabled: [Boolean, String],
    dropdownStyle: [String, Object],
  },
  data(){
    return {
      isMounted: false,
      dropdownOpen: false,
      inputValue: this.modelValue,
      dropdown: {
        style: {},
      },
    }
  },
  computed: {
    listeners(){
      return {
        ...this.$listeners,
        input: (e) => {
          this.$emit('input', e.target.modelValue)
          this.dropdownOpen = true
        },
      }
    },
    editable(){
      if(this.isMounted === false){
        return false
      }
      if(this.readonly !== false || this.disabled !== false){
        return false
      }
      return true
    },
    clearable(){
      if(!this.editable){
        return false
      }
      if(this.$props.clear !== null){
        return this.$props.clear
      }
      return !!this.modelValue
    },
    style(){
      return
      // if(!this.clearable){
      //   return this.wrapperStyle
      // }
      // const input = this.$refs.input
      // const style = getComputedStyle(input)
      // return `marginRight: calc(-2em + ${style.paddingRight});` +
      //   'paddingRight: 2em;'
    },
  },
  mounted(){
    this.isMounted = true
  },
  watch: {
    modelValue(){
      this.inputValue = this.modelValue
    },
    dropdownOpen(){
      // スクロール、リサイズ時にドロップダウンを閉じるようにする
      // (selectタグと同じ挙動)
      if(this.dropdownOpen){
        this._updateDropdownStyle()
        addEventListener('scroll', this._onWindowScroll)
        addEventListener('resize', this._onWindowResize)
      }else{
        removeEventListener('scroll', this._onWindowScroll)
        removeEventListener('resize', this._onWindowResize)
      }
    },
  },
  methods: {
    focus(){
      this.$refs.input.focus()
    },
    _onMousedown(e){
      this.dropdownOpen = true
    },
    _onFocus(e){
      this.dropdownOpen = true
    },
    _onBlur(e){
      this.dropdownOpen = false
    },
    _onKeydownUp(e){
      this.dropdownOpen = true
    },
    _onKeydownDown(e){
      this.dropdownOpen = true
    },
    _onKeydownEnter(e){
      this.dropdownOpen = false
    },
    _onKeydownEsc(e){
      if(this.dropdownOpen === true){
        this.dropdownOpen = false
        e.preventDefault()
      }
    },
    _onParentScroll(e){
      this.dropdownOpen = false
    },
    _onWindowScroll(e){
      this.dropdownOpen = false
    },
    _onWindowResize(e){
      this.dropdownOpen = false
    },
    _updateDropdownStyle(){
      const {input} = this.$refs
      if(input == null){
        return
      }
      const {fontSize} = getComputedStyle(input)
      const rect = input.getBoundingClientRect()
      const left = `${rect.x}px`
      const top = `${rect.height + rect.y}px`
      const width = `${rect.width}px`
      const style = {fontSize, width, left, top}
      Object.assign(style, this.getDropdownStyle())
      this.dropdown.style = style
    },
    _clickClear(){
      this.$emit('clear', null)
    },
    getDropdownStyle(){
      const {dropdownStyle} = this
      if(dropdownStyle == null){
        return {}
      }
      if(dropdownStyle instanceof Object){
        return dropdownStyle
      }
      return CssString.parse(dropdownStyle)
    }
  }
}
</script>

<style scoped>
.dropdown-input{
  display: inline-flex;
  position: relative;
}

input{
  box-sizing: border-box;
  width: 100% !important;
}

.dropdown{
  border: 1px solid #ced4da;
  box-sizing: border-box;
  background-color: white;
  position: fixed;
  z-index: 9999;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);

  &:empty{
    display: none;
  }
}

.spinner, .clear{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
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

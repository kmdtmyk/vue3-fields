<template lang='pug'>
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
  :data-anchor='anchorName'
)
.spinner(v-if='loading' :data-anchor='anchorName')
  LoadingSpinner
.clear(v-else-if='clearable' @click='_clickClear' :data-anchor='anchorName')
.dropdown(
  v-if='editable && dropdownOpen'
  :style='dropdown.style'
  :data-anchor='anchorName'
  ref='dropdown'
)
  slot
</template>

<script>
import CssString from './CssString'
import LoadingSpinner from './LoadingSpinner.vue'
import {v4 as uuid} from 'uuid'

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
      anchorName: `--${uuid()}`,
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
      this.dropdown.style = {
        fontSize,
        width: `${rect.width}px`,
      }

    },
    _clickClear(){
      this.$emit('clear', null)
    },
    // getDropdownStyle(){
    //   const {dropdownStyle} = this
    //   if(dropdownStyle == null){
    //     return {}
    //   }
    //   if(dropdownStyle instanceof Object){
    //     return dropdownStyle
    //   }
    //   return CssString.parse(dropdownStyle)
    // }
  }
}
</script>

<style scoped>
input{
  anchor-name: attr(data-anchor type(<custom-ident>));

  &:has(+ .clear){
    &::placeholder{
      color: inherit;
      opacity: 0.7;
    }
    &:not(:focus)::placeholder{
      opacity: 1;
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

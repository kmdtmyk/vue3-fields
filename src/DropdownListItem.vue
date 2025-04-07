<template lang='pug'>
div(
  class='dropdown-list-item text'
)
  slot
//- div(
//-   class='dropdown-list-item'
//-   :class='{text: textSlot}'
//-   v-on='$listeners'
//- )
//-   slot
</template>

<script>
// export default {
//   data(){
//     const defaultSlot = this.$slots.default
//     const textSlot = defaultSlot != null && defaultSlot[0].children == null
//     return {textSlot}
//   },
// }
</script>


<style scoped>
.dropdown-list-item{
  text-wrap: wrap;

  &.text{
    padding: 0.2em 0.4em;
  }

  > *{
    padding: 0.2em 0.4em;
    display: block;
  }

  &:not(.empty){
    cursor: pointer;
  }

  &.selected{
    background-color: #bedcf5;
    > * {
      background-color: #bedcf5 !important;
    }
  }

}
</style>

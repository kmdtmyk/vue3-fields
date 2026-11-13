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

<script lang='ts' setup>
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

  /* 何もない時空行が潰れるのを防ぐ */
  &:empty::before{
    content: '\00A0';
  }

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

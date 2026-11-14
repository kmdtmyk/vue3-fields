<template lang='pug'>
RouterLink(to='/') Home
RouterView
SourceCode(v-if='source != null' :source='source')
</template>

<script lang='ts' setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import SourceCode from './SourceCode.vue'

const route = useRoute()
const source = computed(() => {
  const value = route.meta.source
  return typeof value === 'string' ? value : null
})
</script>

<template lang='pug'>
details.source-code(open)
  summary Source code
  pre
    code(v-html='highlightedSource')
</template>

<script lang='ts' setup>
import {computed} from 'vue'
import hljs from 'highlight.js/lib/common'
// @ts-ignore
import 'highlight.js/styles/github.css'

const props = defineProps<{
  source: string
}>()

const highlightedSource = computed(() => {
  return hljs.highlightAuto(props.source).value
})
</script>

<style scoped>
.source-code {
  margin-top: 2rem;
}

summary {
  cursor: pointer;
}

pre {
  overflow-x: auto;
  padding: 1rem;
  background: #f5f5f5;
  text-align: left;
  white-space: pre-wrap;
}

code {
  font-family: Consolas;
  font-size: 0.75rem;
  line-height: 1.5;
}
</style>

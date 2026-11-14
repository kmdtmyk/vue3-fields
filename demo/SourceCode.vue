<template lang='pug'>
details.source-code(open)
  summary Source code
  pre
    code {{source}}
</template>

<script lang='ts' setup>
defineProps<{
  source: string
}>()
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
</style>

<template lang='pug'>
h1 vue3-fields
ul
  li(v-for='page in pages' :key='page.path')
    RouterLink(:to='page.path') {{page.title}}
</template>

<script lang='ts' setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const pages = computed(() => {
  return router.getRoutes()
    .filter(route => route.path !== '/')
    .map(route => ({
      path: route.path,
      title: String(route.name),
    }))
})
</script>

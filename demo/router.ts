import {createRouter, createWebHashHistory} from 'vue-router'
import type {Component} from 'vue'

// @ts-ignore
const pageModules = import.meta.glob('./pages/**/*Page.vue', {
  eager: true,
  import: 'default',
}) as Record<string, Component>

const routes = Object.entries(pageModules).map(([file, component]) => {
  const pageName = file.match(/\/([^/]+)Page\.vue$/)?.[1] ?? ''
  const pagePath = file
    .replace(/^\.\/pages\//, '')
    .replace(/Page\.vue$/, '')
  const path = pageName === 'Home' ? '/' : `/${pagePath}`

  return {
    path,
    component,
  }
})

export default createRouter({
  history: createWebHashHistory(),
  routes,
})

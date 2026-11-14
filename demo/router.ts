import {createRouter, createWebHashHistory} from 'vue-router'
import type {Component} from 'vue'

// @ts-ignore
const pageModules = import.meta.glob('./pages/**/*Page.vue', {
  eager: true,
  import: 'default',
}) as Record<string, Component>

// @ts-ignore
const pageSources = import.meta.glob('./pages/**/*Page.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const routes = Object.entries(pageModules).map(([file, component]) => {
  const pageName = file.match(/\/([^/]+)Page\.vue$/)?.[1] ?? ''
  const pagePath = file
    .replace(/^\.\/pages\//, '')
    .replace(/Page\.vue$/, '')
  const path = pageName === 'Home' ? '/' : `/${pagePath}`

  return {
    path,
    component,
    meta: {
      source: path === '/' ? null : pageSources[file],
    },
  }
})

export default createRouter({
  history: createWebHashHistory(),
  routes,
})

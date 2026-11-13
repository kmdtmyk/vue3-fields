import {createRouter, createWebHashHistory} from 'vue-router'
import type {Component} from 'vue'

// @ts-ignore
const pageModules = import.meta.glob('./pages/*Page.vue', {
  eager: true,
  import: 'default',
}) as Record<string, Component>

const routes = Object.entries(pageModules).map(([file, component]) => {
  const pageName = file.match(/\/([^/]+)Page\.vue$/)?.[1] ?? ''
  const path = pageName === 'Home' ? '/' : `/${pageName}`

  return {
    path,
    name: pageName,
    component,
  }
})

export default createRouter({
  history: createWebHashHistory(),
  routes,
})

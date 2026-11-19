import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [vue(), cssInjectedByJs()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Vue3Fields',
      fileName: 'vue3-fields',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})

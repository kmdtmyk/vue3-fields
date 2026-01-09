import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: 'demo',
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    vue(),
  ],
})

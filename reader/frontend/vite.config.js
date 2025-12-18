import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/words': 'http://localhost:8000',
      '/story': 'http://localhost:8000',
      '/feedback': 'http://localhost:8000',
    }
  }
})

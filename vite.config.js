import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5174
  },
  plugins: [react()],

  resolve: {
    //navigate the '~' sign to 'src' folder
    //
    alias: {
      '~': path.resolve(
        path.dirname(
          new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:\/)/, '$1')
        ),
        'src'
      )
    }
  }
})

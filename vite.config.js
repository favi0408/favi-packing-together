import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      // After every production build, make 404.html identical to index.html.
      // GitHub Pages serves 404.html for any unmatched path (e.g. /login after
      // a Firebase auth redirect). The app loads and getRedirectResult() fires,
      // completing authentication without an extra navigation that would clear
      // Firebase's pending auth state.
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
  base: '/favi-packing-together/',
})
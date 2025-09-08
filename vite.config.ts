import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wedding Portfolio - Goan Vendors',
        short_name: 'Wedding Portfolio',
        description: 'Discover and book Goan wedding vendors',
        theme_color: '#be123c',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/'
      }
    })
  ],
  server: {
    port: 3000
  }
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true
    }
  },
  build: {
    sourcemap: false
  },
  optimizeDeps: {
    exclude: [
      '@antv/g2',
      '@antv/g2-extension-plot',
      '@antv/component',
      '@antv/scale',
      '@antv/g-canvas',
      '@antv/g-plugin-dragndrop',
      '@antv/util',
      '@antv/g-camera-api',
      '@antv/g-dom-mutation-observer-api'
    ]
  }
})

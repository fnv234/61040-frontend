import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 3000,
      proxy: mode === 'development' ? {
        // Only proxy in development
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : undefined
    },
    // Ensure environment variables are available in the client
    define: {
      'process.env': {}
    },
    // Base URL for production deployment
    base: mode === 'production' ? '/' : '/',
    // Enable source maps in development
    build: {
      sourcemap: mode === 'development',
      outDir: 'dist',
      emptyOutDir: true
    }
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

// Get the repository name for GitHub Pages
const repo = 'portfolio_camille' // Replace with your actual repository name

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          next();
        });
      },
    },
  ],
  base: '/',
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true, // Prevents Vite from trying to use another port
    hmr: {
      protocol: 'ws', // Ensure WebSocket protocol is set
      host: 'localhost',
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  resolve: {
    alias: {
      path: 'path-browserify',
      fs: 'memfs',
      crypto: 'crypto-browserify',
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.wasm')) {
            return 'assets/sql/[name][extname]'
          }
          // Handle images
          if (assetInfo.name.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        external: ['/sql/sql-wasm.wasm'],
        manualChunks: undefined
      },
      input: {
        main: resolve(__dirname, 'index.html'),
        'sql.worker': resolve(__dirname, 'src/workers/sql.worker.js')
      }
    },
    minify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.time']
      }
    },
    cssMinify: true,
    target: 'esnext',
    worker: {
      format: 'es',
      plugins: []
    }
  },
  optimizeDeps: {
    exclude: ['@jlongster/sql.js']
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  assetsInclude: ['**/*.wasm']
})
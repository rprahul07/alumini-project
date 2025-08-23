import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { visualizer } from 'rollup-plugin-visualizer';
dotenv.config();

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  const isProd = mode === 'production';
  
  return {
    plugins: [
      react(),
      // Only add visualizer in production or analyze mode
      ...(isProd || mode === 'analyze' ? [
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        })
      ] : [])
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      // Development optimizations
      hmr: {
        overlay: false // Disable error overlay for faster HMR
      },
      fs: {
        strict: false // Allow serving files from outside root
      },
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          toplevel: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor';
              }
              if (id.includes('react-router-dom')) {
                return 'router';
              }
              if (id.includes('@heroicons') || id.includes('lucide-react')) {
                return 'ui';
              }
              if (id.includes('axios') || id.includes('react-hot-toast') || id.includes('react-toastify')) {
                return 'utils';
              }
              // Other node_modules go to vendor
              return 'vendor';
            }
            
            // Local chunks
            if (id.includes('/pages/')) {
              return 'pages';
            }
            if (id.includes('/components/')) {
              return 'components';
            }
            if (id.includes('/contexts/')) {
              return 'contexts';
            }
            if (id.includes('/services/')) {
              return 'services';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // Optimize font file names and grouping
            if (assetInfo.name && assetInfo.name.endsWith('.ttf')) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (assetInfo.name && assetInfo.name.endsWith('.woff2')) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (assetInfo.name && assetInfo.name.endsWith('.jpg') || assetInfo.name.endsWith('.jpeg')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (assetInfo.name && assetInfo.name.endsWith('.png')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            return 'assets/[ext]/[name]-[hash][extname]';
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      assetsInlineLimit: 4096, // Inline small assets
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@fortawesome/fontawesome-free'],
      // Development optimizations
      force: isDev ? false : true, // Don't force re-optimization in dev
      entries: isDev ? ['src/main.jsx'] : undefined // Faster dev startup
    }
  };
});


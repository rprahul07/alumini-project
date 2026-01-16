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
          target: process.env.VITE_API_BASE_URL || 'https://alumini-project.onrender.com',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      // CSS optimization
      cssCodeSplit: true,
      cssMinify: isProd,
      // Reduce bundle size and improve loading
      sourcemap: false,
      reportCompressedSize: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
          // Advanced compression for maximum size reduction
          passes: 3,
          unsafe: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true,
          // Remove unused code
          dead_code: true,
          unused: true,
          // Optimize conditionals and loops
          conditionals: true,
          evaluate: true,
          loops: true,
          // Optimize properties and sequences
          properties: true,
          sequences: true,
          switches: true,
          comparisons: true,
          booleans: true,
          if_return: true,
          join_vars: true,
          collapse_vars: true,
          reduce_vars: true,
          side_effects: true
        },
        mangle: {
          toplevel: true,
          safari10: true,
          properties: {
            regex: /^_/
          }
        },
        format: {
          comments: false,
          beautify: false
        }
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunks with better separation
            if (id.includes('node_modules')) {
              // Core React libraries
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-core';
              }
              // Routing
              if (id.includes('react-router-dom')) {
                return 'router';
              }
              // Animation libraries (large) - defer loading
              if (id.includes('framer-motion')) {
                return 'animations';
              }
              // Split large UI libraries
              if (id.includes('@radix-ui')) {
                return 'radix-ui';
              }
              // UI libraries - split by usage
              if (id.includes('@heroicons/react/24/outline')) {
                return 'heroicons-outline';
              }
              if (id.includes('@heroicons/react/24/solid')) {
                return 'heroicons-solid';
              }
              if (id.includes('lucide-react')) {
                return 'lucide';
              }
              // Split react-icons by library to reduce bundle size
              if (id.includes('react-icons/fa')) {
                return 'react-icons-fa';
              }
              if (id.includes('react-icons/fi')) {
                return 'react-icons-fi';
              }
              if (id.includes('react-icons/')) {
                return 'react-icons-other';
              }
              // Toast notifications
              if (id.includes('react-hot-toast') || id.includes('react-toastify')) {
                return 'notifications';
              }
              // HTTP client
              if (id.includes('axios')) {
                return 'http';
              }
              // Form handling
              if (id.includes('react-hook-form') || id.includes('formik')) {
                return 'forms';
              }
              // Other vendor libraries
              return 'vendor';
            }

            // Application chunks with better organization
            if (id.includes('/pages/')) {
              return 'pages';
            }
            if (id.includes('/dashboards/')) {
              return 'dashboards';
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
            if (id.includes('/utils/')) {
              return 'utils';
            }
            if (id.includes('/hooks/')) {
              return 'hooks';
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
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
      exclude: ['@fortawesome/fontawesome-free'],
      // Development optimizations
      force: isDev ? false : true, // Don't force re-optimization in dev
      entries: isDev ? ['src/main.jsx'] : undefined, // Faster dev startup
      // Better tree shaking
      esbuildOptions: {
        treeShaking: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true
      }
    },
    define: {
      // Remove console logs in production
      ...(isProd ? {
        'console.log': 'undefined',
        'console.warn': 'undefined',
        'console.error': 'undefined'
      } : {})
    }
  };
});


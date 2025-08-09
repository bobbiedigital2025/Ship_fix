import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable advanced optimizations
    minify: 'esbuild', // Use esbuild for faster builds
    // Enable source maps for debugging in development
    sourcemap: mode === 'development',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Optimize chunk splitting for better caching
        manualChunks: {
          // React and React Router
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Library (Radix UI components)
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          
          // Charts library
          'charts': ['recharts'],
          
          // Form and validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Data fetching and storage
          'data': ['@tanstack/react-query', '@supabase/supabase-js'],
          
          // Utilities
          'utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns',
            'uuid',
            'marked',
            'highlight.js'
          ],
          
          // Other UI components
          'ui-components': [
            'cmdk',
            'sonner',
            'vaul',
            'embla-carousel-react',
            'react-day-picker',
            'react-resizable-panels',
            'input-otp'
          ]
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      // Optimize external dependencies
      external: (id) => {
        // Keep large dependencies external if CDN is preferred
        return false; // For now, bundle everything for offline support
      },
    },
    // Increase chunk size warning limit since we're now using manual chunks
    chunkSizeWarningLimit: 600,
    // Enable asset inlining for small files
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    exclude: [
      // Exclude large dependencies that should be loaded on demand
    ],
  },
  // Enable experimental optimizations
  esbuild: {
    // Drop console logs in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    // Enable tree shaking
    treeShaking: true,
  },
}));

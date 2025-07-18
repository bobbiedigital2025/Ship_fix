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
    rollupOptions: {
      output: {
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
          
          // Data fetching
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
        }
      }
    },
    // Increase chunk size warning limit since we're now using manual chunks
    chunkSizeWarningLimit: 600
  }
}));

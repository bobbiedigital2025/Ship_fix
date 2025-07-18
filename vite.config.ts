import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: "::",
    port: 4173,
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
          // Core React ecosystem
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          
          // UI Component Libraries
          'radix-core': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox'
          ],
          'radix-extended': [
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-progress',
            '@radix-ui/react-switch'
          ],
          
          // Form handling and validation
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Charts and visualization
          'chart-vendor': ['recharts'],
          
          // Backend services
          'supabase-vendor': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Email and communication
          'email-vendor': ['resend'],
          
          // Utility libraries
          'utils-vendor': [
            'clsx', 
            'tailwind-merge', 
            'class-variance-authority', 
            'date-fns', 
            'uuid',
            'next-themes',
            'lucide-react'
          ],
          
          // Code highlighting and markdown
          'content-vendor': ['highlight.js', 'marked'],
          
          // UI interaction libraries  
          'interaction-vendor': [
            'embla-carousel-react',
            'react-resizable-panels',
            'vaul',
            'cmdk',
            'sonner'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 800,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    reportCompressedSize: false,
    // Improve build performance
    target: 'es2015',
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'lucide-react'
    ]
  }
}));

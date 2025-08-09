
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

// Enhanced service worker registration with optimization support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none', // Always check for updates
    })
      .then((registration) => {
        console.log('[Ship_fix] Service worker registered for fast loading', registration);
        
        // Preload critical resources after registration
        if (registration.active) {
          registration.active.postMessage({
            type: 'PRELOAD_RESOURCES',
            resources: [
              '/',
              '/configuration',
              '/support',
              '/assets/css/',
              '/assets/js/',
            ]
          });
        }

        // Check for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, show update notification
                console.log('[Ship_fix] New app version available');
                // You could show a toast notification here
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[Ship_fix] Service worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

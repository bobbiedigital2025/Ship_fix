import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isInstalled: boolean;
  isWaiting: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isInstalled: false,
    isWaiting: false,
    registration: null,
    error: null,
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setState(prev => ({ ...prev, error: 'Service workers not supported' }));
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        setState(prev => ({
          ...prev,
          registration,
          isInstalled: !!registration.active,
        }));

        // Check for waiting service worker
        if (registration.waiting) {
          setState(prev => ({ ...prev, isWaiting: true }));
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isWaiting: true }));
              }
            });
          }
        });

        // Listen for controller change (new SW took over)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        console.log('[SW] Service worker registered successfully');
      } catch (error) {
        console.error('[SW] Service worker registration failed:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
        }));
      }
    };

    registerSW();

    // Preload critical resources
    preloadCriticalResources();
  }, []);

  const skipWaiting = () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const preloadCriticalResources = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({
          type: 'PRELOAD_RESOURCES',
          resources: [
            '/',
            '/configuration',
            '/support',
            // Add other critical routes here
          ],
        });
      });
    }
  };

  return {
    ...state,
    skipWaiting,
    preloadCriticalResources,
  };
};
// Service Worker Registration for Ship_fix PWA
// Handles registration, updates, and communication with service worker

interface ServiceWorkerMessage {
  type: string;
  version?: string;
  [key: string]: unknown;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
  }

  /**
   * Register the service worker
   */
  async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      console.log('Registering Service Worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', this.registration);

      // Handle service worker updates
      this.handleUpdates();

      // Listen for messages from service worker
      this.listenForMessages();

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Handle service worker updates
   */
  private handleUpdates(): void {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration?.installing;
      
      if (newWorker) {
        console.log('New Service Worker available');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is installed but waiting
            this.showUpdateNotification();
          }
        });
      }
    });

    // Handle controller change (when new SW takes control)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
      window.location.reload();
    });
  }

  /**
   * Listen for messages from service worker
   */
  private listenForMessages(): void {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const data: ServiceWorkerMessage = event.data;
      
      console.log('Message from Service Worker:', data);
      
      switch (data.type) {
        case 'VERSION':
          console.log('Service Worker version:', data.version);
          break;
        case 'CACHE_UPDATED':
          console.log('Cache updated by Service Worker');
          break;
        default:
          console.log('Unknown message from Service Worker:', data);
      }
    });
  }

  /**
   * Show update notification to user
   */
  private showUpdateNotification(): void {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3B82F6;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="font-weight: 600; margin-bottom: 8px;">
          🚀 Update Available
        </div>
        <div style="font-size: 14px; margin-bottom: 12px;">
          A new version of Ship_fix is ready!
        </div>
        <button id="update-btn" style="
          background: white;
          color: #3B82F6;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 8px;
        ">
          Update Now
        </button>
        <button id="dismiss-btn" style="
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">
          Later
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Handle update button click
    const updateBtn = notification.querySelector('#update-btn');
    const dismissBtn = notification.querySelector('#dismiss-btn');

    updateBtn?.addEventListener('click', () => {
      this.activateWaitingServiceWorker();
      document.body.removeChild(notification);
    });

    dismissBtn?.addEventListener('click', () => {
      document.body.removeChild(notification);
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 10000);
  }

  /**
   * Activate waiting service worker
   */
  private activateWaitingServiceWorker(): void {
    if (!this.registration?.waiting) return;

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  /**
   * Get service worker version
   */
  async getVersion(): Promise<string | null> {
    if (!this.registration?.active) return null;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event: MessageEvent) => {
        const data: ServiceWorkerMessage = event.data as ServiceWorkerMessage;
        resolve(data.version || null);
      };

      this.registration!.active!.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Check if app is running as PWA
   */
  static isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  /**
   * Check if service worker is supported and active
   */
  isActive(): boolean {
    return this.isSupported && this.registration !== null;
  }
}

// Global service worker manager instance
export const swManager = new ServiceWorkerManager();

// Auto-register service worker when module loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    swManager.register().then((success) => {
      if (success) {
        console.log('✅ Ship_fix PWA ready for offline use');
      } else {
        console.log('❌ Ship_fix running without offline support');
      }
    });
  });
}

export default ServiceWorkerManager;
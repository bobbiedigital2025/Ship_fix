import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';

interface PWAInstallPromptProps {
  onClose?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                            (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS instructions if on iOS and not installed
    if (iOS && !isStandaloneMode) {
      const hasSeenPrompt = localStorage.getItem('shipfix-ios-install-prompt');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted PWA install');
      } else {
        console.log('User dismissed PWA install');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('shipfix-ios-install-prompt', 'seen');
    }
    if (onClose) {
      onClose();
    }
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-sm shadow-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-900">Install Ship_fix</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Get faster access to your supply chain automation with our mobile app experience.
        </p>

        {isIOS ? (
          <div className="space-y-3">
            <div className="text-xs text-gray-600 space-y-1">
              <p>To install on iPhone/iPad:</p>
              <p>1. Tap the Share button in Safari</p>
              <p>2. Select "Add to Home Screen"</p>
              <p>3. Tap "Add" to install</p>
            </div>
            <Button
              size="sm"
              onClick={handleDismiss}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Got it!
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!deferredPrompt}
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-600"
            >
              Later
            </Button>
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500 text-center">
          ✨ Works offline • 📱 App-like experience • 🚀 Faster loading
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallPrompt;

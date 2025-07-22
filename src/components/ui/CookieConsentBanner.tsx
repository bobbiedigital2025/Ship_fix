import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cookie, 
  Settings, 
  X, 
  Check,
  Info,
  Shield,
  BarChart3,
  Target
} from 'lucide-react';

interface CookieConsentBannerProps {
  onAccept?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
}

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'ship_fix_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'ship_fix_cookie_preferences';

export function CookieConsentBanner({ onAccept, onDecline }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    saveConsent(allAccepted);
    setIsVisible(false);
    onAccept?.(allAccepted);
  };

  const handleDeclineAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    
    saveConsent(essentialOnly);
    setIsVisible(false);
    onDecline?.();
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setIsVisible(false);
    onAccept?.(preferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    
    // Initialize Google Analytics if analytics accepted
    if (prefs.analytics) {
      initializeGoogleAnalytics();
    }
    
    // Initialize Google Ads if marketing accepted
    if (prefs.marketing) {
      initializeGoogleAds();
    }
  };

  const initializeGoogleAnalytics = () => {
    // Google Analytics 4 initialization
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        cookie_flags: 'secure;samesite=lax'
      });
    }
  };

  const initializeGoogleAds = () => {
    // Google Ads initialization
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID';
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', 'AW-CONVERSION_ID');
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-6">
          {!showPreferences ? (
            // Main banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start space-x-4 flex-1">
                <Cookie className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">We use cookies to enhance your experience</h3>
                  <p className="text-sm text-gray-600">
                    Ship_fix uses cookies and similar technologies to provide essential functionality, 
                    analyze usage patterns, and deliver personalized content through Google Ads. 
                    We also use cookies for our supply chain automation and tariff analysis features.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Info className="h-4 w-4" />
                    <span>
                      Essential cookies are required for core functionality. 
                      <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">
                        Learn more in our Privacy Policy
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeclineAll}
                  className="flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline All
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            // Preferences panel
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Essential Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Essential Cookies</span>
                      <Badge variant="secondary">Required</Badge>
                    </div>
                    <div className="w-10 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Required for core functionality including authentication, MCP automation, 
                    and A2A transactions. Cannot be disabled.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Analytics Cookies</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePreference('analytics')}
                      className={preferences.analytics ? 'bg-blue-50 border-blue-300' : ''}
                    >
                      {preferences.analytics ? 'On' : 'Off'}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Help us understand how you use our supply chain features and improve our service. 
                    Includes Google Analytics for usage patterns.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Marketing Cookies</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePreference('marketing')}
                      className={preferences.marketing ? 'bg-purple-50 border-purple-300' : ''}
                    >
                      {preferences.marketing ? 'On' : 'Off'}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Enable personalized advertising through Google Ads and remarketing. 
                    Help us show relevant supply chain solutions.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Functional Cookies</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePreference('functional')}
                      className={preferences.functional ? 'bg-orange-50 border-orange-300' : ''}
                    >
                      {preferences.functional ? 'On' : 'Off'}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Remember your preferences and settings, including dashboard layouts 
                    and automation configurations.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
                <p className="text-xs text-gray-500 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Changes will take effect after saving. Visit our 
                  <a href="/privacy-policy" className="text-blue-600 hover:underline mx-1">
                    Privacy Policy
                  </a> 
                  for more details.
                </p>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDeclineAll}
                  >
                    Essential Only
                  </Button>
                  <Button
                    onClick={handleSavePreferences}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Export hook to get current cookie preferences
export const useCookiePreferences = (): CookiePreferences | null => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  return preferences;
};

// Utility function to check if a specific cookie type is allowed
export const isCookieAllowed = (type: keyof CookiePreferences): boolean => {
  const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
  if (!savedPreferences) return false;
  
  const preferences: CookiePreferences = JSON.parse(savedPreferences);
  return preferences[type];
};

// Google Analytics tracking function that respects cookie consent
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (isCookieAllowed('analytics') && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Google Ads conversion tracking
export const trackConversion = (conversionId: string, conversionLabel: string, value?: number) => {
  if (isCookieAllowed('marketing') && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
      value: value,
      currency: 'USD'
    });
  }
};

// Declare global gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

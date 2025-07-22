import { useEffect } from 'react';

interface GoogleAdsConfig {
  googleAdsId: string;
  googleAnalyticsId: string;
  enableConsentMode: boolean;
  defaultSettings: {
    ad_storage: 'granted' | 'denied';
    analytics_storage: 'granted' | 'denied';
    ad_user_data: 'granted' | 'denied';
    ad_personalization: 'granted' | 'denied';
  };
}

// Default configuration for Ship_fix
const DEFAULT_CONFIG: GoogleAdsConfig = {
  googleAdsId: import.meta.env.VITE_GOOGLE_ADS_ID || 'AW-XXXXXXXXX', // Replace with your Google Ads ID
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXX', // Replace with your GA4 ID
  enableConsentMode: true,
  defaultSettings: {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  }
};

export function GoogleAdsIntegration({ config = DEFAULT_CONFIG }: { config?: GoogleAdsConfig }) {
  useEffect(() => {
    // Initialize Google Tag Manager / Global Site Tag
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
    document.head.appendChild(script1);

    // Initialize gtag
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      
      // Set default consent mode
      gtag('consent', 'default', {
        ad_storage: '${config.defaultSettings.ad_storage}',
        analytics_storage: '${config.defaultSettings.analytics_storage}',
        ad_user_data: '${config.defaultSettings.ad_user_data}',
        ad_personalization: '${config.defaultSettings.ad_personalization}',
        wait_for_update: 500
      });
      
      gtag('js', new Date());
      
      // Configure Google Analytics
      gtag('config', '${config.googleAnalyticsId}', {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
      
      // Configure Google Ads if ID is provided
      ${config.googleAdsId !== 'AW-XXXXXXXXX' ? `
      gtag('config', '${config.googleAdsId}', {
        allow_enhanced_conversions: true
      });` : ''}
      
      // Enhanced conversion tracking for better ROI measurement
      gtag('config', '${config.googleAnalyticsId}', {
        custom_map: {
          'custom_parameter_tariff_savings': 'tariff_cost_savings',
          'custom_parameter_automation_type': 'mcp_automation_type',
          'custom_parameter_customer_tier': 'customer_tier'
        }
      });
    `;
    document.head.appendChild(script2);

    // Clean up function
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [config]);

  return null; // This component doesn't render anything
}

// Google Ads tracking functions
export const trackConversion = (conversionLabel: string, value?: number, currency: string = 'USD') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${DEFAULT_CONFIG.googleAdsId}/${conversionLabel}`,
      value: value,
      currency: currency
    });
  }
};

export const trackTariffSavings = (savings: number, automationType: string, customerTier: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tariff_cost_saved', {
      event_category: 'automation',
      event_label: automationType,
      value: savings,
      currency: 'USD',
      custom_parameter_tariff_savings: savings,
      custom_parameter_automation_type: automationType,
      custom_parameter_customer_tier: customerTier
    });
  }
};

export const trackSupplyChainOptimization = (optimizationType: string, costSavings: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'supply_chain_optimization', {
      event_category: 'automation',
      event_label: optimizationType,
      value: costSavings,
      currency: 'USD'
    });
  }
};

export const trackMCPAutomation = (actionType: string, success: boolean) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'mcp_automation_action', {
      event_category: 'automation',
      event_label: actionType,
      value: success ? 1 : 0
    });
  }
};

export const trackUserRegistration = (registrationType: string, customerTier: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: registrationType,
      custom_parameter_customer_tier: customerTier
    });
    
    // Track conversion for Google Ads
    trackConversion('SIGNUP_CONVERSION_LABEL'); // Replace with your actual conversion label
  }
};

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
      items: items
    });
    
    // Track conversion for Google Ads
    trackConversion('PURCHASE_CONVERSION_LABEL', value); // Replace with your actual conversion label
  }
};

// Update consent based on user preferences
export const updateConsentMode = (preferences: {
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.advertising ? 'granted' : 'denied',
      ad_user_data: preferences.advertising ? 'granted' : 'denied',
      ad_personalization: preferences.advertising ? 'granted' : 'denied'
    });
  }
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

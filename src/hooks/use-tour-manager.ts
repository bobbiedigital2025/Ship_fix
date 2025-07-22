import { useState, useCallback } from 'react';
import { TourStep } from '@/components/ui/GuidedTour';

export interface TourSession {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  category: 'setup' | 'features' | 'advanced';
}

// Predefined tour sessions
export const TOUR_SESSIONS: TourSession[] = [
  {
    id: 'initial-setup',
    name: 'Initial Setup Guide',
    description: 'Get started with Ship_fix platform configuration',
    category: 'setup',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Ship_fix!',
        content: 'This guided tour will help you set up your supply chain automation platform. Let\'s start with the basics.',
        target: 'body',
        position: 'center'
      },
      {
        id: 'navigation',
        title: 'Navigation Menu',
        content: 'This is your main navigation. Use it to access different sections of the platform.',
        target: '[data-tour="navigation"]',
        position: 'right',
        actionText: 'Take a moment to explore the menu options'
      },
      {
        id: 'configuration',
        title: 'Platform Configuration',
        content: 'Start by setting up your basic platform configuration including company details and preferences.',
        target: '[data-tour="config-link"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Click on Configuration to proceed'
      },
      {
        id: 'company-info',
        title: 'Company Information',
        content: 'Enter your company details here. This information will be used for shipment tracking and automation.',
        target: '[data-tour="company-name"]',
        position: 'right',
        action: 'input',
        actionText: 'Enter your company name'
      },
      {
        id: 'save-config',
        title: 'Save Configuration',
        content: 'Don\'t forget to save your configuration changes.',
        target: '[data-tour="save-button"]',
        position: 'top',
        action: 'click',
        actionText: 'Click Save to continue'
      }
    ]
  },
  {
    id: 'mcp-dashboard',
    name: 'MCP Dashboard Tour',
    description: 'Explore the MCP automation dashboard and its features',
    category: 'features',
    steps: [
      {
        id: 'dashboard-overview',
        title: 'MCP Dashboard Overview',
        content: 'This is your automation control center. Monitor and manage all your supply chain automation from here.',
        target: '[data-tour="mcp-dashboard"]',
        position: 'center'
      },
      {
        id: 'supply-chain-tab',
        title: 'Supply Chain Monitoring',
        content: 'View real-time supply chain metrics including shipment status, delays, and cost optimization.',
        target: '[data-tour="supply-chain-tab"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Click to view supply chain metrics'
      },
      {
        id: 'tariff-monitor',
        title: 'Tariff Monitoring',
        content: 'Track tariff changes and automated cost mitigation strategies. Essential for managing Trump tariff impacts.',
        target: '[data-tour="tariff-tab"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Click to view tariff monitoring'
      },
      {
        id: 'automation-rules',
        title: 'Automation Rules',
        content: 'Configure and monitor your automation rules. These automatically respond to supply chain events.',
        target: '[data-tour="automation-rules"]',
        position: 'right',
        actionText: 'Review the active automation rules'
      }
    ]
  },
  {
    id: 'tariff-automation',
    name: 'Tariff Automation Setup',
    description: 'Learn how to set up automated tariff monitoring and cost mitigation',
    category: 'advanced',
    steps: [
      {
        id: 'tariff-intro',
        title: 'Tariff Automation Introduction',
        content: 'Ship_fix automatically monitors tariff changes and implements cost mitigation strategies.',
        target: '[data-tour="tariff-monitor"]',
        position: 'center'
      },
      {
        id: 'cost-tracking',
        title: 'Cost Impact Tracking',
        content: 'This section shows real-time cost impacts from tariff changes, especially Trump tariff scenarios.',
        target: '[data-tour="cost-tracking"]',
        position: 'right',
        actionText: 'Review the cost impact analysis'
      },
      {
        id: 'mitigation-strategies',
        title: 'Automated Mitigation',
        content: 'View and configure automated responses to tariff changes including route optimization and supplier switching.',
        target: '[data-tour="mitigation-strategies"]',
        position: 'left',
        actionText: 'Explore available mitigation options'
      },
      {
        id: 'alerts-setup',
        title: 'Alert Configuration',
        content: 'Set up alerts for tariff changes and cost thresholds to stay informed of important events.',
        target: '[data-tour="alert-config"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Configure your alert preferences'
      }
    ]
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant Guide',
    description: 'Learn how to use the AI assistant for supply chain optimization',
    category: 'features',
    steps: [
      {
        id: 'ai-intro',
        title: 'AI Assistant Introduction',
        content: 'Your AI assistant can help with supply chain questions, automation setup, and optimization strategies.',
        target: '[data-tour="ai-assistant"]',
        position: 'center'
      },
      {
        id: 'ask-question',
        title: 'Ask Questions',
        content: 'Type your supply chain questions here. The AI understands tariffs, shipping, automation, and MCP protocols.',
        target: '[data-tour="ai-input"]',
        position: 'top',
        action: 'input',
        actionText: 'Try asking: "How can I optimize shipping costs?"'
      },
      {
        id: 'predefined-scenarios',
        title: 'Predefined Scenarios',
        content: 'Use these quick-start scenarios for common supply chain challenges.',
        target: '[data-tour="ai-scenarios"]',
        position: 'right',
        actionText: 'Click on a scenario to get started'
      }
    ]
  }
];

export const useTourManager = () => {
  const [activeTour, setActiveTour] = useState<TourSession | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedTours, setCompletedTours] = useState<string[]>([]);

  const startTour = useCallback((tourId: string) => {
    const tour = TOUR_SESSIONS.find(t => t.id === tourId);
    if (tour) {
      setActiveTour(tour);
      setCurrentStepIndex(0);
    }
  }, []);

  const stopTour = useCallback(() => {
    setActiveTour(null);
    setCurrentStepIndex(0);
  }, []);

  const completeTour = useCallback(() => {
    if (activeTour) {
      setCompletedTours(prev => [...prev, activeTour.id]);
      setActiveTour(null);
      setCurrentStepIndex(0);
    }
  }, [activeTour]);

  const nextStep = useCallback(() => {
    if (activeTour && currentStepIndex < activeTour.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [activeTour, currentStepIndex, completeTour]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((stepIndex: number) => {
    if (activeTour && stepIndex >= 0 && stepIndex < activeTour.steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  }, [activeTour]);

  const isStepCompleted = useCallback((tourId: string, stepIndex: number) => {
    if (completedTours.includes(tourId)) return true;
    if (activeTour?.id === tourId) {
      return currentStepIndex > stepIndex;
    }
    return false;
  }, [completedTours, activeTour, currentStepIndex]);

  const isTourCompleted = useCallback((tourId: string) => {
    return completedTours.includes(tourId);
  }, [completedTours]);

  const getProgress = useCallback((tourId: string) => {
    if (completedTours.includes(tourId)) return 100;
    if (activeTour?.id === tourId) {
      return Math.round(((currentStepIndex + 1) / activeTour.steps.length) * 100);
    }
    return 0;
  }, [completedTours, activeTour, currentStepIndex]);

  return {
    activeTour,
    currentStepIndex,
    completedTours,
    startTour,
    stopTour,
    completeTour,
    nextStep,
    previousStep,
    goToStep,
    isStepCompleted,
    isTourCompleted,
    getProgress,
    availableTours: TOUR_SESSIONS
  };
};

export default useTourManager;

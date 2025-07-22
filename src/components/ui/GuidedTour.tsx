import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'input' | 'navigate' | 'wait';
  actionText?: string;
  nextCondition?: () => boolean;
}

interface GuidedTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentStepIndex?: number;
  onStepChange?: (index: number) => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
  currentStepIndex = 0,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState(currentStepIndex);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isActive && currentStepData) {
      updatePosition();
      setIsVisible(true);
      highlightElement();
    } else {
      setIsVisible(false);
      removeHighlight();
    }
  }, [isActive, currentStep, currentStepData]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const updatePosition = () => {
    if (!currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target);
    if (!targetElement) {
      console.warn(`Tour target not found: ${currentStepData.target}`);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const popupWidth = 320;
    const popupHeight = 200;
    let x = 0;
    let y = 0;

    switch (currentStepData.position) {
      case 'top':
        x = rect.left + rect.width / 2 - popupWidth / 2;
        y = rect.top - popupHeight - 10;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - popupWidth / 2;
        y = rect.bottom + 10;
        break;
      case 'left':
        x = rect.left - popupWidth - 10;
        y = rect.top + rect.height / 2 - popupHeight / 2;
        break;
      case 'right':
        x = rect.right + 10;
        y = rect.top + rect.height / 2 - popupHeight / 2;
        break;
      case 'center':
        x = window.innerWidth / 2 - popupWidth / 2;
        y = window.innerHeight / 2 - popupHeight / 2;
        break;
    }

    // Keep popup within viewport
    x = Math.max(10, Math.min(x, window.innerWidth - popupWidth - 10));
    y = Math.max(10, Math.min(y, window.innerHeight - popupHeight - 10));

    setPopupPosition({ x, y });
  };

  const highlightElement = () => {
    if (!currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target);
    if (targetElement) {
      targetElement.classList.add('tour-highlight');
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const removeHighlight = () => {
    const highlighted = document.querySelectorAll('.tour-highlight');
    highlighted.forEach(el => el.classList.remove('tour-highlight'));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    removeHighlight();
    onSkip();
  };

  if (!isActive || !isVisible || !currentStepData) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        style={{ pointerEvents: 'none' }}
      />

      {/* Tour Popup */}
      <div
        ref={popupRef}
        className="fixed z-[9999] animate-in fade-in-0 zoom-in-95"
        style={{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y}px`,
          width: '320px',
        }}
      >
        <Card className="shadow-2xl border-2 border-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-blue-600">
                {currentStepData.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 mb-4">
              {currentStepData.content}
            </p>

            {currentStepData.actionText && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center text-sm text-blue-800">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  {currentStepData.actionText}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500"
                >
                  Skip Tour
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                  {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrow pointing to target element */}
        {currentStepData.position !== 'center' && (
          <div
            className={`absolute w-0 h-0 ${getArrowClasses(currentStepData.position)}`}
          />
        )}
      </div>

      {/* Custom CSS for highlighting */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .tour-highlight {
            position: relative !important;
            z-index: 9997 !important;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
            border-radius: 4px !important;
            background-color: rgba(59, 130, 246, 0.1) !important;
            transition: all 0.3s ease !important;
          }
          
          .tour-highlight::after {
            content: '' !important;
            position: absolute !important;
            inset: -4px !important;
            border: 2px solid #3B82F6 !important;
            border-radius: 6px !important;
            pointer-events: none !important;
            animation: pulse 2s infinite !important;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `
      }} />
    </>
  );
};

function getArrowClasses(position: string): string {
  switch (position) {
    case 'top':
      return 'border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white top-full left-1/2 transform -translate-x-1/2';
    case 'bottom':
      return 'border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white bottom-full left-1/2 transform -translate-x-1/2';
    case 'left':
      return 'border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white left-full top-1/2 transform -translate-y-1/2';
    case 'right':
      return 'border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white right-full top-1/2 transform -translate-y-1/2';
    default:
      return '';
  }
}

export default GuidedTour;

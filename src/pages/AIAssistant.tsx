import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SmartAIAgent from '../components/ai/SmartAIAgent';
import { TourSelector } from '@/components/ui/TourSelector';
import { GuidedTour } from '@/components/ui/GuidedTour';
import { useTourManager } from '@/hooks/use-tour-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Navigation, MessageCircle } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const { 
    activeTour, 
    currentStepIndex, 
    stopTour, 
    completeTour,
    nextStep,
    previousStep 
  } = useTourManager();

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-tour="ai-assistant">
            AI Assistant & Guided Tours
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get help from our AI assistant or follow interactive guided tours to master Ship_fix platform
          </p>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="tours" className="flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              Guided Tours
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Supply Chain AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SmartAIAgent />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours">
            <TourSelector />
          </TabsContent>
        </Tabs>

        {/* Active Guided Tour Overlay */}
        {activeTour && (
          <GuidedTour
            steps={activeTour.steps}
            isActive={true}
            currentStepIndex={currentStepIndex}
            onComplete={completeTour}
            onSkip={stopTour}
            onStepChange={(index) => {
              // This could trigger additional logic when step changes
            }}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default AIAssistant;

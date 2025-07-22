import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, Clock, Settings, Zap, Brain } from 'lucide-react';
import { useTourManager, TourSession } from '@/hooks/use-tour-manager';

interface TourSelectorProps {
  onTourSelect?: (tourId: string) => void;
}

export const TourSelector: React.FC<TourSelectorProps> = ({ onTourSelect }) => {
  const { 
    availableTours, 
    startTour, 
    isTourCompleted, 
    getProgress 
  } = useTourManager();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup': return <Settings className="h-4 w-4" />;
      case 'features': return <Zap className="h-4 w-4" />;
      case 'advanced': return <Brain className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'setup': return 'bg-blue-100 text-blue-800';
      case 'features': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTour = (tour: TourSession) => {
    startTour(tour.id);
    if (onTourSelect) {
      onTourSelect(tour.id);
    }
  };

  const groupedTours = availableTours.reduce((acc, tour) => {
    if (!acc[tour.category]) {
      acc[tour.category] = [];
    }
    acc[tour.category].push(tour);
    return acc;
  }, {} as Record<string, TourSession[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interactive Guided Tours
        </h2>
        <p className="text-gray-600">
          Learn Ship_fix with step-by-step interactive tutorials
        </p>
      </div>

      {Object.entries(groupedTours).map(([category, tours]) => (
        <div key={category}>
          <div className="flex items-center mb-4">
            {getCategoryIcon(category)}
            <h3 className="text-lg font-semibold ml-2 capitalize">
              {category} Tours
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((tour) => {
              const isCompleted = isTourCompleted(tour.id);
              const progress = getProgress(tour.id);

              return (
                <Card 
                  key={tour.id} 
                  className={`hover:shadow-lg transition-shadow ${
                    isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium mb-2">
                          {tour.name}
                        </CardTitle>
                        <Badge className={getCategoryColor(tour.category)}>
                          {getCategoryIcon(tour.category)}
                          <span className="ml-1 capitalize">{tour.category}</span>
                        </Badge>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4">
                      {tour.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {tour.steps.length} steps
                        </span>
                        <span className="text-gray-500">
                          {progress}% complete
                        </span>
                      </div>

                      {progress > 0 && (
                        <Progress value={progress} className="h-2" />
                      )}

                      <Button
                        onClick={() => handleStartTour(tour)}
                        className="w-full"
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review Tour
                          </>
                        ) : progress > 0 ? (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Continue Tour
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Tour
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Brain className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              AI-Powered Learning
            </h4>
            <p className="text-sm text-blue-700">
              Each tour is interactive with popups that appear exactly where you need to take action. 
              The AI assistant can also answer questions during any tour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourSelector;

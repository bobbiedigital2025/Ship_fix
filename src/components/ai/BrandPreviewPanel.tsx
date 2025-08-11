import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Eye, 
  Palette, 
  Type, 
  Target, 
  Heart, 
  Users, 
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface BrandInfo {
  name: string;
  tagline: string;
  industry: string;
  targetAudience: string;
  values: string[];
  personality: string[];
  colors: string[];
  completionPercentage: number;
  status: 'draft' | 'in-progress' | 'ready-for-review' | 'approved';
}

interface BrandPreviewPanelProps {
  brandInfo: BrandInfo;
  isLive?: boolean;
}

const BrandPreviewPanel: React.FC<BrandPreviewPanelProps> = ({ 
  brandInfo, 
  isLive = false 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'in-progress':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'ready-for-review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-600';
      case 'in-progress':
        return 'bg-blue-100 text-blue-600';
      case 'ready-for-review':
        return 'bg-yellow-100 text-yellow-600';
      case 'approved':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Live Update Indicator */}
      {isLive && (
        <div className="flex items-center justify-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-600 font-medium">Live Brand Preview</span>
        </div>
      )}

      {/* Brand Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span>Brand Preview</span>
            </div>
            <Badge className={`flex items-center space-x-1 ${getStatusColor(brandInfo.status)}`}>
              {getStatusIcon(brandInfo.status)}
              <span className="capitalize">{brandInfo.status.replace('-', ' ')}</span>
            </Badge>
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completion</span>
              <span className="font-medium">{brandInfo.completionPercentage}%</span>
            </div>
            <Progress value={brandInfo.completionPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Brand Identity */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Palette className="h-5 w-5 text-purple-600" />
            <span>Brand Identity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Brand Name & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Brand Name</span>
            </div>
            <div className="pl-6">
              <p className="text-lg font-bold text-gray-900">
                {brandInfo.name || <span className="text-gray-400 italic">To be defined...</span>}
              </p>
              {brandInfo.tagline && (
                <p className="text-sm text-gray-600 italic">{brandInfo.tagline}</p>
              )}
            </div>
          </div>

          {/* Industry & Target Audience */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Market Focus</span>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Industry:</span> {brandInfo.industry || <span className="text-gray-400 italic">Not specified</span>}
              </p>
              <p className="text-sm">
                <span className="font-medium">Audience:</span> {brandInfo.targetAudience || <span className="text-gray-400 italic">Not specified</span>}
              </p>
            </div>
          </div>

          {/* Brand Values */}
          {brandInfo.values.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Core Values</span>
              </div>
              <div className="pl-6">
                <div className="flex flex-wrap gap-1">
                  {brandInfo.values.map((value, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Brand Personality */}
          {brandInfo.personality.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Personality</span>
              </div>
              <div className="pl-6">
                <div className="flex flex-wrap gap-1">
                  {brandInfo.personality.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Color Palette */}
          {brandInfo.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Color Palette</span>
              </div>
              <div className="pl-6">
                <div className="flex space-x-2">
                  {brandInfo.colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs text-gray-500">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Brand Preview Mockup */}
          {brandInfo.completionPercentage > 50 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Brand Preview</h4>
              <div className="space-y-2">
                <div className="text-center">
                  <h3 className="text-xl font-bold" style={{ color: brandInfo.colors[0] || '#3B82F6' }}>
                    {brandInfo.name || 'Your Brand'}
                  </h3>
                  {brandInfo.tagline && (
                    <p className="text-sm text-gray-600 italic">{brandInfo.tagline}</p>
                  )}
                </div>
                {brandInfo.colors.length > 0 && (
                  <div className="flex justify-center space-x-1 mt-2">
                    {brandInfo.colors.slice(0, 3).map((color, index) => (
                      <div 
                        key={index}
                        className="w-12 h-2 rounded"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandPreviewPanel;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  RotateCcw,
  Palette,
  Target,
  Heart,
  Lightbulb,
  MessageCircle,
  Users,
  Star,
  Eye
} from 'lucide-react';

interface BrandData {
  brandName: string;
  mission: string;
  colorPalette: string[];
  logoStyle: string;
  tagline: string;
  niche: string;
  targetAudience: string;
  emotions: string;
  personality: string;
}

interface BrandPreviewProps {
  brandData: BrandData;
  onApprove: () => void;
  onTryAgain: () => void;
}

export const BrandPreview: React.FC<BrandPreviewProps> = ({ brandData, onApprove, onTryAgain }) => {
  return (
    <Card className="shadow-xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-center justify-center">
          <Eye className="h-5 w-5 mr-2" />
          Brand Preview
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Brand Name */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {brandData.brandName}
          </h2>
          <p className="text-gray-600 italic">"{brandData.tagline}"</p>
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Palette className="h-4 w-4 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-800">Color Palette</span>
          </div>
          <div className="flex gap-2">
            {brandData.colorPalette.map((color, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-800">Mission</span>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg italic">
            {brandData.mission}
          </p>
        </div>

        {/* Logo Concept */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-800">Logo Style</span>
          </div>
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{brandData.brandName.charAt(0)}</span>
              </div>
              <p className="text-sm text-gray-600">{brandData.logoStyle}</p>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-800">Target Audience</span>
          </div>
          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
            {brandData.targetAudience}
          </p>
        </div>

        {/* Niche */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-800">Niche</span>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {brandData.niche}
          </Badge>
        </div>

        {/* Brand Emotions */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-2 text-purple-600" />
            <span className="font-semibold text-gray-800">Brand Emotions</span>
          </div>
          <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
            {brandData.emotions}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t space-y-3">
          <Button 
            onClick={onApprove}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            ✅ Approve - Lock in this Brand
          </Button>
          
          <Button 
            onClick={onTryAgain}
            variant="outline"
            className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold py-3"
            size="lg"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            🔄 Try Again - Refine this Brand
          </Button>
        </div>

        {/* Small disclaimer */}
        <div className="text-xs text-gray-500 text-center pt-2">
          💡 Your brand elements are generated based on our conversation. You can always refine them further.
        </div>
      </CardContent>
    </Card>
  );
};
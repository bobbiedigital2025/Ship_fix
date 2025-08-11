import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Palette, 
  Target, 
  MessageSquare, 
  Lightbulb, 
  Building2, 
  Users,
  Eye,
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react';

interface BrandData {
  name: string;
  mission: string;
  colors: string;
  logoIdea: string;
  tagline: string;
  niche: string;
  targetAudience: string;
}

interface BrandFormProps {
  onSubmit: (data: BrandData) => void;
  onFieldUpdate: (field: keyof BrandData, value: string) => void;
  initialData?: Partial<BrandData>;
  showPreview?: boolean;
}

const BRAND_FIELDS = [
  {
    key: 'name' as keyof BrandData,
    label: 'Brand Name',
    placeholder: 'e.g., EcoTech Solutions',
    icon: Building2,
    description: 'What is your brand called?'
  },
  {
    key: 'mission' as keyof BrandData,
    label: 'Mission Statement',
    placeholder: 'e.g., Making sustainable technology accessible to everyone',
    icon: Target,
    description: 'What is your brand\'s purpose and core mission?',
    multiline: true
  },
  {
    key: 'colors' as keyof BrandData,
    label: 'Brand Colors',
    placeholder: 'e.g., Forest green, white, gold accents',
    icon: Palette,
    description: 'What colors represent your brand?'
  },
  {
    key: 'logoIdea' as keyof BrandData,
    label: 'Logo Concept',
    placeholder: 'e.g., Stylized leaf with tech circuit patterns',
    icon: Lightbulb,
    description: 'Describe your logo concept or visual identity',
    multiline: true
  },
  {
    key: 'tagline' as keyof BrandData,
    label: 'Tagline',
    placeholder: 'e.g., "Green Innovation, Bright Future"',
    icon: MessageSquare,
    description: 'Your memorable brand phrase or slogan'
  },
  {
    key: 'niche' as keyof BrandData,
    label: 'Market Niche',
    placeholder: 'e.g., Sustainable consumer electronics',
    icon: Target,
    description: 'What specific market or industry do you serve?'
  },
  {
    key: 'targetAudience' as keyof BrandData,
    label: 'Target Audience',
    placeholder: 'e.g., Environmentally conscious millennials with tech interest',
    icon: Users,
    description: 'Who is your ideal customer?',
    multiline: true
  }
];

export const BrandForm: React.FC<BrandFormProps> = ({
  onSubmit,
  onFieldUpdate,
  initialData = {},
  showPreview = false
}) => {
  const [brandData, setBrandData] = useState<BrandData>({
    name: '',
    mission: '',
    colors: '',
    logoIdea: '',
    tagline: '',
    niche: '',
    targetAudience: '',
    ...initialData
  });

  const [editingField, setEditingField] = useState<keyof BrandData | null>(null);

  useEffect(() => {
    setBrandData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleFieldChange = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
    onFieldUpdate(field, value);
  };

  const getFieldCompletionStatus = () => {
    const completed = Object.entries(brandData).filter(([_, value]) => value.trim() !== '').length;
    const total = Object.keys(brandData).length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const { completed, total, percentage } = getFieldCompletionStatus();

  const handleSubmit = () => {
    onSubmit(brandData);
  };

  const isEmpty = (value: string) => !value || value.trim() === '';

  if (showPreview) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Brand Preview
            </div>
            <Badge variant={percentage === 100 ? 'default' : 'secondary'}>
              {completed}/{total} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {BRAND_FIELDS.map((field) => {
            const value = brandData[field.key];
            const isComplete = !isEmpty(value);
            
            return (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center text-sm font-medium">
                    <field.icon className="h-4 w-4 mr-2" />
                    {field.label}
                  </Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField(editingField === field.key ? null : field.key)}
                    className="h-6 px-2"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
                
                {editingField === field.key ? (
                  <div className="space-y-2">
                    {field.multiline ? (
                      <Textarea
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                    <Button
                      size="sm"
                      onClick={() => setEditingField(null)}
                      className="w-full"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className={`p-3 rounded-lg border ${isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    {isComplete ? (
                      <p className="text-sm text-gray-700">{value}</p>
                    ) : (
                      <div className="flex items-center text-sm text-gray-500">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Not filled yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            Brand Information Form
          </div>
          <Badge variant={percentage === 100 ? 'default' : 'secondary'}>
            {percentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {BRAND_FIELDS.map((field, index) => {
            const value = brandData[field.key];
            const isComplete = !isEmpty(value);
            
            return (
              <div key={field.key} className="space-y-2">
                <Label className="flex items-center text-sm font-medium">
                  <field.icon className="h-4 w-4 mr-2" />
                  {field.label}
                  {isComplete && <Check className="h-3 w-3 ml-2 text-green-600" />}
                </Label>
                <p className="text-xs text-gray-600">{field.description}</p>
                {field.multiline ? (
                  <Textarea
                    value={value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className={isComplete ? 'border-green-300' : ''}
                  />
                ) : (
                  <Input
                    value={value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={isComplete ? 'border-green-300' : ''}
                  />
                )}
              </div>
            );
          })}
        </div>

        <Separator />
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Progress: {completed} of {total} fields completed</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
          >
            {percentage === 100 ? '✨ Complete Brand Analysis' : `📝 Save Progress (${completed}/${total})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandForm;
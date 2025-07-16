import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Route, RefreshCw, CheckCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'reroute' | 'reorder' | 'supplier_switch';
  title: string;
  description: string;
  impact: string;
  status: 'pending' | 'approved' | 'implemented';
  savings: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'reroute',
    title: 'Alternative Route Suggested',
    description: 'Reroute shipment via Port B to avoid congestion',
    impact: '2 days faster delivery',
    status: 'pending',
    savings: '$1,200'
  },
  {
    id: '2',
    type: 'reorder',
    title: 'Automated Reorder Triggered',
    description: 'Component ABC-123 reordered from backup supplier',
    impact: 'Prevents stockout',
    status: 'implemented',
    savings: '$3,500'
  },
  {
    id: '3',
    type: 'supplier_switch',
    title: 'Supplier Switch Recommended',
    description: 'Switch to Euro Manufacturing for better reliability',
    impact: '15% improvement in on-time delivery',
    status: 'approved',
    savings: '$2,800'
  }
];

const OptimizationPanel: React.FC = () => {
  const getTypeIcon = (type: string) => {
    const icons = {
      reroute: <Route className="w-4 h-4" />,
      reorder: <RefreshCw className="w-4 h-4" />,
      supplier_switch: <ArrowRight className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      implemented: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Optimization Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(suggestion.type)}
                <h4 className="font-medium">{suggestion.title}</h4>
              </div>
              <Badge className={getStatusColor(suggestion.status)}>
                {suggestion.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-green-600">{suggestion.impact}</span>
                <span className="text-sm font-medium text-blue-600">Saves {suggestion.savings}</span>
              </div>
              {suggestion.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                  <Button size="sm">
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OptimizationPanel;
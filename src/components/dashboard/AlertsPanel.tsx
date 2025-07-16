import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Package, Truck } from 'lucide-react';

interface Alert {
  id: string;
  type: 'delay' | 'shortage' | 'quality' | 'route';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'delay',
    title: 'Shipment Delay Detected',
    description: 'Order #12345 from Global Tech Supply is 2 days behind schedule',
    severity: 'high',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'shortage',
    title: 'Low Inventory Alert',
    description: 'Component XYZ-789 inventory below minimum threshold',
    severity: 'medium',
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'quality',
    title: 'Quality Issue Reported',
    description: 'Batch QC-456 failed quality inspection at facility B',
    severity: 'high',
    timestamp: '6 hours ago'
  }
];

const AlertsPanel: React.FC = () => {
  const getAlertIcon = (type: string) => {
    const icons = {
      delay: <Clock className="w-4 h-4" />,
      shortage: <Package className="w-4 h-4" />,
      quality: <AlertTriangle className="w-4 h-4" />,
      route: <Truck className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons];
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[severity as keyof typeof colors];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Active Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockAlerts.map((alert) => (
          <div key={alert.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getAlertIcon(alert.type)}
                <h4 className="font-medium">{alert.title}</h4>
              </div>
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
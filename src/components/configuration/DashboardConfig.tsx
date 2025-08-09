import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, GripVertical, BarChart3, TrendingUp, Package, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Widget {
  id: string;
  name: string;
  type: string;
  metric: string;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
}

interface Report {
  id: string;
  name: string;
  schedule: string;
  recipients: string[];
  enabled: boolean;
}

const DashboardConfig: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      name: 'Shipment Tracking',
      type: 'tracking_card',
      metric: 'active_shipments',
      size: 'medium',
      enabled: true
    },
    {
      id: '2',
      name: 'Supplier Performance',
      type: 'chart',
      metric: 'supplier_on_time_delivery',
      size: 'large',
      enabled: true
    }
  ]);

  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Weekly Supply Chain Summary',
      schedule: 'weekly',
      recipients: ['manager@company.com'],
      enabled: true
    }
  ]);

  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [newWidget, setNewWidget] = useState<Partial<Widget>>({});

  const availableMetrics = [
    { value: 'active_shipments', label: 'Active Shipments', icon: Truck },
    { value: 'supplier_on_time_delivery', label: 'Supplier On-Time Delivery %', icon: TrendingUp },
    { value: 'inventory_turnover_rate', label: 'Inventory Turnover Rate', icon: Package },
    { value: 'cost_per_shipment', label: 'Cost per Shipment', icon: BarChart3 }
  ];

  const widgetTypes = [
    { value: 'card', label: 'Info Card' },
    { value: 'chart', label: 'Chart' },
    { value: 'gauge', label: 'Gauge' },
    { value: 'table', label: 'Table' }
  ];

  const widgetSizes = [
    { value: 'small', label: 'Small (1x1)' },
    { value: 'medium', label: 'Medium (2x1)' },
    { value: 'large', label: 'Large (2x2)' }
  ];

  const handleAddWidget = () => {
    if (newWidget.name && newWidget.type && newWidget.metric) {
      setWidgets([...widgets, { 
        ...newWidget, 
        id: Date.now().toString(), 
        enabled: true 
      } as Widget]);
      setNewWidget({});
      setIsAddWidgetOpen(false);
    }
  };

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="widgets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="widgets">Dashboard Widgets</TabsTrigger>
          <TabsTrigger value="layout">Layout Designer</TabsTrigger>
          <TabsTrigger value="reports">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="widgets">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Widgets</CardTitle>
              <CardDescription>
                Select and configure which metrics and KPIs to display on your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Widgets</h3>
                <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Widget
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Dashboard Widget</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="widgetName">Widget Name</Label>
                        <Input
                          id="widgetName"
                          value={newWidget.name || ''}
                          onChange={(e) => setNewWidget({...newWidget, name: e.target.value})}
                          placeholder="Enter widget name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="widgetType">Widget Type</Label>
                          <Select onValueChange={(value) => setNewWidget({...newWidget, type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {widgetTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="widgetSize">Size</Label>
                          <Select onValueChange={(value) => setNewWidget({...newWidget, size: value as 'small' | 'medium' | 'large'})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {widgetSizes.map(size => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="metric">Metric</Label>
                        <Select onValueChange={(value) => setNewWidget({...newWidget, metric: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select metric" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMetrics.map(metric => (
                              <SelectItem key={metric.value} value={metric.value}>
                                {metric.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleAddWidget}>Add Widget</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {widgets.map((widget) => {
                  const metric = availableMetrics.find(m => m.value === widget.metric);
                  const Icon = metric?.icon || BarChart3;
                  return (
                    <Card key={widget.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          <Icon className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-semibold">{widget.name}</h4>
                            <p className="text-sm text-gray-600">{metric?.label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {widget.size}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {widget.type.replace('_', ' ')}
                          </Badge>
                          <Switch
                            checked={widget.enabled}
                            onCheckedChange={() => toggleWidget(widget.id)}
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout Designer</CardTitle>
              <CardDescription>
                Drag and drop widgets to customize your dashboard layout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 min-h-96 border-2 border-dashed border-gray-200 rounded-lg p-4">
                {widgets.filter(w => w.enabled).map((widget) => (
                  <div 
                    key={widget.id} 
                    className={`bg-white border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow ${
                      widget.size === 'large' ? 'col-span-2 row-span-2' :
                      widget.size === 'medium' ? 'col-span-2' : 'col-span-1'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm">{widget.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {availableMetrics.find(m => m.value === widget.metric)?.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Configure automated reports to be delivered to stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{report.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{report.schedule} delivery</p>
                        <p className="text-sm text-gray-600">{report.recipients.length} recipients</p>
                      </div>
                      <Switch checked={report.enabled} />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardConfig;
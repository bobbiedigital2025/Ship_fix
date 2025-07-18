import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Bell, Mail, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AlertRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  threshold: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  channels: string[];
  recipients: string[];
}

interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'in-app';
  name: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

const AlertConfig: React.FC = () => {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'Shipment Delay Alert',
      trigger: 'shipment_delayed',
      condition: 'greater_than',
      threshold: '4 hours',
      severity: 'high',
      enabled: true,
      channels: ['email', 'in-app'],
      recipients: ['procurement@company.com']
    },
    {
      id: '2',
      name: 'Low Inventory Warning',
      trigger: 'inventory_below_safety',
      condition: 'less_than',
      threshold: 'safety_stock',
      severity: 'medium',
      enabled: true,
      channels: ['email'],
      recipients: ['warehouse@company.com']
    }
  ]);

  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: '1',
      type: 'email',
      name: 'Email Notifications',
      config: { smtp: 'configured' },
      enabled: true
    },
    {
      id: '2',
      type: 'in-app',
      name: 'In-App Notifications',
      config: {},
      enabled: true
    }
  ]);

  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({});

  const triggerTypes = [
    { value: 'shipment_delayed', label: 'Shipment Delayed' },
    { value: 'inventory_below_safety', label: 'Inventory Below Safety Stock' },
    { value: 'supplier_performance_drop', label: 'Supplier Performance Drop' },
    { value: 'cost_threshold_exceeded', label: 'Cost Threshold Exceeded' },
    { value: 'delivery_failure', label: 'Delivery Failure' }
  ];

  const conditions = [
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  const handleAddRule = () => {
    if (newRule.name && newRule.trigger) {
      setAlertRules([...alertRules, { ...newRule, id: Date.now().toString(), enabled: true } as AlertRule]);
      setNewRule({});
      setIsAddRuleOpen(false);
    }
  };

  const toggleRule = (id: string) => {
    setAlertRules(alertRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getSeverityColor = (severity: string) => {
    return severityLevels.find(s => s.value === severity)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>
                Configure custom events that trigger alerts based on your supply chain conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Rules</h3>
                <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Alert Rule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="ruleName">Rule Name</Label>
                        <Input
                          id="ruleName"
                          value={newRule.name || ''}
                          onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                          placeholder="Enter rule name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="trigger">Trigger Event</Label>
                          <Select onValueChange={(value) => setNewRule({...newRule, trigger: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trigger" />
                            </SelectTrigger>
                            <SelectContent>
                              {triggerTypes.map(trigger => (
                                <SelectItem key={trigger.value} value={trigger.value}>
                                  {trigger.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="condition">Condition</Label>
                          <Select onValueChange={(value) => setNewRule({...newRule, condition: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditions.map(condition => (
                                <SelectItem key={condition.value} value={condition.value}>
                                  {condition.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="threshold">Threshold</Label>
                          <Input
                            id="threshold"
                            value={newRule.threshold || ''}
                            onChange={(e) => setNewRule({...newRule, threshold: e.target.value})}
                            placeholder="e.g., 4 hours, 100 units"
                          />
                        </div>
                        <div>
                          <Label htmlFor="severity">Severity</Label>
                          <Select onValueChange={(value: string) => setNewRule({...newRule, severity: value as 'low' | 'medium' | 'high' | 'critical'})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              {severityLevels.map(severity => (
                                <SelectItem key={severity.value} value={severity.value}>
                                  {severity.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleAddRule}>Create Rule</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{rule.name}</h4>
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity.toUpperCase()}
                          </Badge>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          When {triggerTypes.find(t => t.value === rule.trigger)?.label} is {rule.condition} {rule.threshold}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Channels:</span>
                            <div className="flex gap-1">
                              {rule.channels.map(channel => (
                                <Badge key={channel} variant="outline" className="text-xs">
                                  {channel}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Recipients:</span>
                            <span className="font-medium">{rule.recipients.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>
                Configure how alerts are delivered to your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => {
                  const Icon = channel.type === 'email' ? Mail : 
                              channel.type === 'sms' ? MessageSquare : Bell;
                  return (
                    <Card key={channel.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-semibold">{channel.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{channel.type} notifications</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={channel.enabled}
                            onCheckedChange={() => {
                              setChannels(channels.map(c => 
                                c.id === channel.id ? { ...c, enabled: !c.enabled } : c
                              ));
                            }}
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

        <TabsContent value="recipients">
          <Card>
            <CardHeader>
              <CardTitle>Alert Recipients</CardTitle>
              <CardDescription>
                Manage who receives different types of alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Procurement Team</Label>
                    <Input placeholder="procurement@company.com" />
                  </div>
                  <div>
                    <Label>Warehouse Manager</Label>
                    <Input placeholder="warehouse@company.com" />
                  </div>
                  <div>
                    <Label>Operations Manager</Label>
                    <Input placeholder="operations@company.com" />
                  </div>
                  <div>
                    <Label>Supply Chain Director</Label>
                    <Input placeholder="director@company.com" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertConfig;
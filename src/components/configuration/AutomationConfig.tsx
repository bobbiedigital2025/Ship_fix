import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Zap, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: string;
    condition: string;
    value: string;
  };
  actions: {
    type: string;
    config: Record<string, unknown>;
  }[];
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

const AutomationConfig: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-Reorder Low Stock',
      trigger: {
        type: 'inventory_below_threshold',
        condition: 'less_than',
        value: 'reorder_point'
      },
      actions: [
        {
          type: 'generate_purchase_order',
          config: { supplierId: 'preferred', quantity: 'auto' }
        },
        {
          type: 'send_notification',
          config: { recipients: ['procurement@company.com'] }
        }
      ],
      enabled: true,
      lastRun: '2024-01-15T10:30:00Z',
      runCount: 42
    },
    {
      id: '2',
      name: 'Delayed Shipment Response',
      trigger: {
        type: 'shipment_delayed',
        condition: 'greater_than',
        value: '24_hours'
      },
      actions: [
        {
          type: 'notify_stakeholders',
          config: { severity: 'high' }
        },
        {
          type: 'search_alternative_supplier',
          config: { criteria: 'fastest_delivery' }
        }
      ],
      enabled: true,
      lastRun: '2024-01-14T15:45:00Z',
      runCount: 8
    }
  ]);

  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({});

  const triggerTypes = [
    { value: 'inventory_below_threshold', label: 'Inventory Below Threshold' },
    { value: 'shipment_delayed', label: 'Shipment Delayed' },
    { value: 'supplier_performance_drop', label: 'Supplier Performance Drop' },
    { value: 'cost_increase', label: 'Cost Increase' },
    { value: 'quality_issue', label: 'Quality Issue Detected' }
  ];

  const actionTypes = [
    { value: 'generate_purchase_order', label: 'Generate Purchase Order' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'search_alternative_supplier', label: 'Search Alternative Supplier' },
    { value: 'update_inventory_status', label: 'Update Inventory Status' },
    { value: 'recommend_route', label: 'Recommend Alternative Route' },
    { value: 'escalate_to_manager', label: 'Escalate to Manager' }
  ];

  const conditions = [
    { value: 'less_than', label: 'Less Than' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' }
  ];

  const handleAddRule = () => {
    if (newRule.name && newRule.trigger) {
      setRules([...rules, {
        ...newRule,
        id: Date.now().toString(),
        enabled: true,
        runCount: 0,
        actions: newRule.actions || []
      } as AutomationRule]);
      setNewRule({});
      setIsAddRuleOpen(false);
    }
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="builder">Rule Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Create "If This, Then That" logic to automate your supply chain processes
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
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Create Automation Rule</DialogTitle>
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
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3">IF (Trigger)</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Event Type</Label>
                            <Select onValueChange={(value: string) => setNewRule({
                              ...newRule, 
                              trigger: { ...newRule.trigger, type: value }
                            })}>
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
                            <Label>Condition</Label>
                            <Select onValueChange={(value: string) => setNewRule({
                              ...newRule,
                              trigger: { ...newRule.trigger, condition: value }
                            })}>
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
                          <div>
                            <Label>Value</Label>
                            <Input
                              value={newRule.trigger?.value || ''}
                              onChange={(e) => setNewRule({
                                ...newRule,
                                trigger: { ...newRule.trigger, value: e.target.value }
                              })}
                              placeholder="Enter value"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3">THEN (Actions)</h4>
                        <div className="space-y-2">
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypes.map(action => (
                                <SelectItem key={action.value} value={action.value}>
                                  {action.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Action
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleAddRule}>Create Rule</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {rules.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-blue-500" />
                          <h4 className="font-semibold">{rule.name}</h4>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">IF</span>
                            <Badge variant="outline">
                              {triggerTypes.find(t => t.value === rule.trigger.type)?.label}
                            </Badge>
                            <span>{rule.trigger.condition}</span>
                            <Badge variant="secondary">{rule.trigger.value}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-2">
                            <span className="font-medium">THEN</span>
                            {rule.actions.map((action, index) => (
                              <div key={index} className="flex items-center gap-1">
                                {index > 0 && <ArrowRight className="h-3 w-3 text-gray-400" />}
                                <Badge variant="default">
                                  {actionTypes.find(a => a.value === action.type)?.label}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <p className="font-medium">{rule.enabled ? 'Active' : 'Inactive'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Run:</span>
                            <p className="font-medium">
                              {rule.lastRun ? formatDate(rule.lastRun) : 'Never'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Run Count:</span>
                            <p className="font-medium">{rule.runCount}</p>
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

        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Step Workflows</CardTitle>
              <CardDescription>
                Create complex workflows with conditional logic and multiple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Workflow builder coming soon</p>
                <Button variant="outline">Create Workflow</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>Visual Rule Builder</CardTitle>
              <CardDescription>
                Drag and drop interface for building automation rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Visual builder coming soon</p>
                <Button variant="outline">Launch Builder</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationConfig;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Truck, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Package, 
  Globe,
  BarChart3,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { mcpAutomationEngine } from '../../lib/mcp-automation-engine';

interface SupplyChainMetrics {
  shipments_processed_today: number;
  cost_savings_percentage: number;
  supply_chain_visibility: string;
  compliance_success_rate: number;
  disruptions_detected: number;
  auto_reroutes_completed: number;
  delivery_accuracy: string;
}

const SupplyChainDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SupplyChainMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      await mcpAutomationEngine.initialize();
      const stats = await mcpAutomationEngine.getAutomationStats();
      setMetrics(stats as SupplyChainMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load supply chain metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateEvent = async () => {
    setIsLoading(true);
    try {
      await mcpAutomationEngine.simulateSupplyChainEvents();
      await loadMetrics();
    } catch (error) {
      console.error('Failed to simulate event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Supply Chain Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Command Center</h1>
          <p className="text-gray-600">Real-time ecommerce logistics automation by Bobbie Digital</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Active
          </Badge>
          <Button onClick={simulateEvent} disabled={isLoading}>
            <Zap className="mr-2 h-4 w-4" />
            Simulate Event
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Shipments Processed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Shipments Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.shipments_processed_today || 0}
            </div>
            <p className="text-xs text-gray-500">+12% from yesterday</p>
          </CardContent>
        </Card>

        {/* Cost Savings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics?.cost_savings_percentage || 0}%
            </div>
            <p className="text-xs text-gray-500">Through route optimization</p>
          </CardContent>
        </Card>

        {/* Supply Chain Visibility */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              Visibility Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics?.supply_chain_visibility || '0%'}
            </div>
            <p className="text-xs text-gray-500">End-to-end tracking</p>
          </CardContent>
        </Card>

        {/* Compliance Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round((metrics?.compliance_success_rate || 0) * 100)}%
            </div>
            <p className="text-xs text-gray-500">Trade regulation adherence</p>
          </CardContent>
        </Card>

      </div>

      {/* Automation Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Automations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Active Automation Rules
            </CardTitle>
            <CardDescription>
              Intelligent supply chain automation workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm">Route Optimization</h4>
                  <p className="text-xs text-gray-600">Auto-optimize shipping routes</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm">Inventory Alerts</h4>
                  <p className="text-xs text-gray-600">Smart reordering triggers</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm">Tariff Analysis</h4>
                  <p className="text-xs text-gray-600">Real-time cost impact</p>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm">Disruption Detection</h4>
                  <p className="text-xs text-gray-600">Proactive issue identification</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Recent Automation Events
            </CardTitle>
            <CardDescription>
              Latest automated actions and optimizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Route optimized for shipment SH-2025-{Math.floor(Math.random() * 999)}</p>
                  <p className="text-xs text-gray-500">Saved $127 in shipping costs • {Math.floor(Math.random() * 60)} min ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Inventory alert triggered for Product #{Math.floor(Math.random() * 999)}</p>
                  <p className="text-xs text-gray-500">Procurement team notified • {Math.floor(Math.random() * 180)} min ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tariff impact analysis completed</p>
                  <p className="text-xs text-gray-500">Price adjustments recommended • {Math.floor(Math.random() * 300)} min ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Shipment auto-rerouted due to delay</p>
                  <p className="text-xs text-gray-500">Alternative route selected • {Math.floor(Math.random() * 420)} min ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Compliance check passed for international shipment</p>
                  <p className="text-xs text-gray-500">Documentation verified • {Math.floor(Math.random() * 600)} min ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Disruption Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Disruption Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disruptions Detected</span>
                <span className="font-semibold">{metrics?.disruptions_detected || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Auto-reroutes</span>
                <span className="font-semibold">{metrics?.auto_reroutes_completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-semibold">2.3 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Cost Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Savings</span>
                <span className="font-semibold text-green-600">$12,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost Variance</span>
                <span className="font-semibold">-23%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Route Efficiency</span>
                <span className="font-semibold text-blue-600">89%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fuel Optimization</span>
                <span className="font-semibold text-green-600">+15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Package className="mr-2 h-5 w-5 text-blue-500" />
              Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-time Delivery</span>
                <span className="font-semibold">{metrics?.delivery_accuracy || '0%'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold text-green-600">4.8/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transit Time Variance</span>
                <span className="font-semibold">±6 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Damage Rate</span>
                <span className="font-semibold text-green-600">0.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 flex items-center justify-center">
          <Clock className="mr-2 h-4 w-4" />
          Last updated: {lastUpdate.toLocaleTimeString()} • 
          <span className="ml-1">Powered by Bobbie Digital MCP Automation</span>
        </p>
      </div>

    </div>
  );
};

export default SupplyChainDashboard;

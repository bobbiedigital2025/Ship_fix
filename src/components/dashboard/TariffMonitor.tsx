import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Globe,
  Shield,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { mcpAutomationEngine } from '@/lib/mcp-automation-engine';

interface TariffEvent {
  id: string;
  event_type: string;
  product_category: string;
  origin_country: string;
  tariff_rate_new: number;
  cost_impact_percentage: number;
  description: string;
  trump_policy_reference: string;
  created_at: string;
}

interface TariffResolution {
  id: string;
  resolution_type: string;
  status: string;
  cost_savings: number;
  automated: boolean;
  created_at: string;
}

export function TariffMonitor() {
  const [recentEvents, setRecentEvents] = useState<TariffEvent[]>([]);
  const [activeResolutions, setActiveResolutions] = useState<TariffResolution[]>([]);
  const [totalCostSavings, setTotalCostSavings] = useState(0);
  const [automationRate, setAutomationRate] = useState(95);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTariffData();
    const interval = setInterval(loadTariffData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadTariffData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading tariff events (in real app, this would query Supabase)
      const mockEvents: TariffEvent[] = [
        {
          id: '1',
          event_type: 'tariff_change',
          product_category: 'electronics',
          origin_country: 'China',
          tariff_rate_new: 25.0,
          cost_impact_percentage: 17.5,
          description: 'Trump administration increased tariffs on Chinese electronics',
          trump_policy_reference: 'Executive Order 2025-001',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          event_type: 'tariff_change',
          product_category: 'textiles',
          origin_country: 'China',
          tariff_rate_new: 35.0,
          cost_impact_percentage: 20.0,
          description: 'Additional tariffs on Chinese textile imports',
          trump_policy_reference: 'Trade War Escalation Act 2025',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          event_type: 'prediction',
          product_category: 'automotive',
          origin_country: 'Mexico',
          tariff_rate_new: 15.0,
          cost_impact_percentage: 12.5,
          description: 'Predicted tariff increase on Mexican automotive parts',
          trump_policy_reference: 'USMCA Renegotiation 2025',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];

      const mockResolutions: TariffResolution[] = [
        {
          id: '1',
          resolution_type: 'a2a_credit',
          status: 'completed',
          cost_savings: 2450.00,
          automated: true,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          resolution_type: 'route_optimization',
          status: 'in_progress',
          cost_savings: 1850.00,
          automated: true,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          resolution_type: 'supplier_switch',
          status: 'pending',
          cost_savings: 0,
          automated: true,
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ];

      setRecentEvents(mockEvents);
      setActiveResolutions(mockResolutions);
      setTotalCostSavings(mockResolutions.reduce((sum, res) => sum + (res.cost_savings || 0), 0));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load tariff data:', error);
      setIsLoading(false);
    }
  };

  const simulateTariffEvent = async () => {
    await mcpAutomationEngine.simulateTrumpTariffImpact();
    setTimeout(loadTariffData, 1000); // Refresh after simulation
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'tariff_change': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'prediction': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'impact': return <DollarSign className="h-4 w-4 text-yellow-500" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Clock className="h-6 w-6 animate-spin mr-2" />
        <span>Loading tariff monitor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trump Tariff Monitor</h2>
          <p className="text-gray-600">
            Automated monitoring and cost mitigation for tariff impacts
          </p>
        </div>
        <Button onClick={simulateTariffEvent} variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          Simulate Event
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalCostSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From automated resolutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rate</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationRate}%</div>
            <Progress value={automationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Resolutions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeResolutions.length}</div>
            <p className="text-xs text-muted-foreground">In progress or pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events and Resolutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tariff Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tariff Events</CardTitle>
            <CardDescription>Trump administration policy changes and impacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {event.product_category} from {event.origin_country}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {event.tariff_rate_new}% tariff
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-red-600 font-medium">
                        +{event.cost_impact_percentage}% cost impact
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Resolutions */}
        <Card>
          <CardHeader>
            <CardTitle>Automated Resolutions</CardTitle>
            <CardDescription>MCP-powered cost mitigation actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeResolutions.map((resolution) => (
                <div key={resolution.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium capitalize">
                        {resolution.resolution_type.replace('_', ' ')}
                      </p>
                      <Badge className={getStatusColor(resolution.status)}>
                        {resolution.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {resolution.cost_savings > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          ${resolution.cost_savings.toLocaleString()} saved
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(resolution.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    {resolution.automated && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Automated
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

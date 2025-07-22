import React from 'react';
import TrackingCard from './TrackingCard';
import SupplierTable from './SupplierTable';
import AlertsPanel from './AlertsPanel';
import OptimizationPanel from './OptimizationPanel';
import SmartAIAgent from '@/components/ai/SmartAIAgent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  CheckCircle,
  Bot
} from 'lucide-react';

const DashboardMain: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* AI Assistant - Main Feature */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            AI-Powered Supply Chain Assistant
          </h2>
          <p className="text-gray-600 mt-1">
            Let our AI agent set up, optimize, and manage your entire shipping platform
          </p>
        </div>
        <SmartAIAgent />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TrackingCard
          title="Active Shipments"
          value="247"
          icon={<Truck className="w-4 h-4 text-white" />}
          status="success"
          subtitle="+12% from last week"
        />
        <TrackingCard
          title="Inventory Items"
          value="1,432"
          icon={<Package className="w-4 h-4 text-white" />}
          status="success"
          progress={78}
          subtitle="78% capacity"
        />
        <TrackingCard
          title="Active Alerts"
          value="8"
          icon={<AlertTriangle className="w-4 h-4 text-white" />}
          status="warning"
          subtitle="3 high priority"
        />
        <TrackingCard
          title="On-Time Delivery"
          value="94.2%"
          icon={<CheckCircle className="w-4 h-4 text-white" />}
          status="success"
          subtitle="+2.1% improvement"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alerts and Optimization */}
        <div className="lg:col-span-1 space-y-6">
          <AlertsPanel />
          <OptimizationPanel />
        </div>

        {/* Right Column - Supplier Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Supplier Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SupplierTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
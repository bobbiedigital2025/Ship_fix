import React from 'react';
import PageLayout from '@/components/PageLayout';
import { AppProvider } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Truck, Package, Bell, BarChart3, Zap } from 'lucide-react';
import SupplierConfig from '@/components/configuration/SupplierConfig';
import ShipperConfig from '@/components/configuration/ShipperConfig';
import InventoryConfig from '@/components/configuration/InventoryConfig';
import AlertConfig from '@/components/configuration/AlertConfig';
import DashboardConfig from '@/components/configuration/DashboardConfig';
import AutomationConfig from '@/components/configuration/AutomationConfig';

const Configuration: React.FC = () => {
  return (
    <AppProvider>
      <PageLayout>
        <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration Center</h1>
        <p className="text-gray-600">Customize your supply chain platform to match your business needs</p>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Suppliers
          </TabsTrigger>
          <TabsTrigger value="shippers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shippers
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          <SupplierConfig />
        </TabsContent>

        <TabsContent value="shippers">
          <ShipperConfig />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryConfig />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertConfig />
        </TabsContent>

        <TabsContent value="dashboard">
          <DashboardConfig />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationConfig />
        </TabsContent>
      </Tabs>
        </div>
      </PageLayout>
    </AppProvider>
  );
};

export default Configuration;
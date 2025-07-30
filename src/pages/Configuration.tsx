import React from 'react';
import PageLayout from '@/components/PageLayout';
import { AppProvider } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Truck, Package, Bell, BarChart3, Zap } from 'lucide-react';
import { usePermissions } from '@/components/auth/RoleGuard';
import SupplierConfig from '@/components/configuration/SupplierConfig';
import ShipperConfig from '@/components/configuration/ShipperConfig';
import InventoryConfig from '@/components/configuration/InventoryConfig';
import AlertConfig from '@/components/configuration/AlertConfig';
import DashboardConfig from '@/components/configuration/DashboardConfig';
import AutomationConfig from '@/components/configuration/AutomationConfig';

const Configuration: React.FC = () => {
  const { isAdmin, isCustomer } = usePermissions();

  // Define tabs based on user role
  const customerTabs = [
    { id: 'suppliers', label: 'Suppliers', icon: Users, component: SupplierConfig },
    { id: 'shippers', label: 'Shippers', icon: Truck, component: ShipperConfig },
    { id: 'inventory', label: 'Inventory', icon: Package, component: InventoryConfig },
  ];

  const adminTabs = [
    { id: 'suppliers', label: 'Suppliers', icon: Users, component: SupplierConfig },
    { id: 'shippers', label: 'Shippers', icon: Truck, component: ShipperConfig },
    { id: 'inventory', label: 'Inventory', icon: Package, component: InventoryConfig },
    { id: 'alerts', label: 'Alerts', icon: Bell, component: AlertConfig },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: DashboardConfig },
    { id: 'automation', label: 'Automation', icon: Zap, component: AutomationConfig },
  ];

  const tabs = isAdmin() ? adminTabs : customerTabs;
  const defaultTab = tabs[0]?.id || 'suppliers';

  return (
    <AppProvider>
      <PageLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isAdmin() ? 'Platform Configuration' : 'Account Setup'}
            </h1>
            <p className="text-muted-foreground">
              {isAdmin() 
                ? 'Manage platform-wide settings and configurations'
                : 'Configure your suppliers, shippers, and inventory settings'
              }
            </p>
          </div>

          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <tab.component />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </PageLayout>
    </AppProvider>
  );
};

export default Configuration;
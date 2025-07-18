import React from 'react';
import PageLayout from '@/components/PageLayout';
import { AppProvider } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users } from 'lucide-react';
import SupportCenter from '@/components/support/SupportCenter';
import AdminSupportDashboard from '@/components/support/AdminSupportDashboard';

const SupportPage: React.FC = () => {
  return (
    <AppProvider>
      <PageLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-gray-600">Get help with your supply chain platform</p>
          </div>

          <Tabs defaultValue="customer" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Customer Support
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <SupportCenter />
            </TabsContent>

            <TabsContent value="admin">
              <AdminSupportDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppProvider>
  );
};

export default SupportPage;

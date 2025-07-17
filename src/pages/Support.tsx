import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BarChart3, ArrowLeft } from 'lucide-react';
import SupportCenter from '@/components/support/SupportCenter';
import AdminSupportDashboard from '@/components/support/AdminSupportDashboard';

const SupportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold">Support Center</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
};

export default SupportPage;

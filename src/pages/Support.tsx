import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { AppProvider } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SupportCenter from '@/components/support/SupportCenter';
import AdminSupportDashboard from '@/components/support/AdminSupportDashboard';
import { NotificationManager } from '@/components/support/TicketNotifications';
import { SupportService } from '@/lib/support-service';

const SupportPage: React.FC = () => {
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  
  useEffect(() => {
    // Load open tickets count for admin badge
    const loadTicketsCount = async () => {
      try {
        const tickets = await SupportService.getTickets();
        const openCount = tickets.filter(t => t.status === 'open').length;
        setOpenTicketsCount(openCount);
      } catch (error) {
        console.error('Error loading tickets count:', error);
      }
    };
    
    loadTicketsCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(loadTicketsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  console.log('🏠 Support page component rendered!');
  return (
    <NotificationManager>
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
                  {openTicketsCount > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 px-2 text-xs">
                      {openTicketsCount}
                    </Badge>
                  )}
                  {openTicketsCount > 0 && (
                    <Bell className="w-3 h-3 text-red-500 animate-pulse ml-1" />
                  )}
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
    </NotificationManager>
  );
};

export default SupportPage;

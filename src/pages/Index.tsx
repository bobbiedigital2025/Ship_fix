
import React from 'react';
import PageLayout from '@/components/PageLayout';
import DashboardMain from '@/components/dashboard/DashboardMain';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <PageLayout>
        <DashboardMain />
      </PageLayout>
    </AppProvider>
  );
};

export default Index;

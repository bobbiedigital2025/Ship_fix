import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import DashboardMain from './dashboard/DashboardMain';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      
      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main Content */}
      <div className="flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1">
          <DashboardMain />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
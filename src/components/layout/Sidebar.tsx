import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  Package, 
  Truck, 
  AlertTriangle, 
  Settings, 
  Users, 
  TrendingUp,
  Network,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: BarChart3, current: true, path: '/' },
  { name: 'Tracking', icon: Truck, current: false, path: '/' },
  { name: 'Inventory', icon: Package, current: false, path: '/' },
  { name: 'Alerts', icon: AlertTriangle, current: false, path: '/' },
  { name: 'Suppliers', icon: Users, current: false, path: '/' },
  { name: 'Analytics', icon: TrendingUp, current: false, path: '/' },
  { name: 'MCP Integration', icon: Network, current: false, path: '/mcp' },
  { name: 'Support Center', icon: HelpCircle, current: false, path: '/support' },
  { name: 'Configuration', icon: Settings, current: false, path: '/configuration' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Supply Chain</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={item.current ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    item.current && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
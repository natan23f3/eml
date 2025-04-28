import { useLocation } from 'wouter';
import { Bell, Mail, Menu } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  toggleSidebar: () => void;
}

export function TopBar({ toggleSidebar }: TopBarProps) {
  const [location] = useLocation();
  const [hasNotifications] = useState(true);
  
  // Convert path to title
  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard';
    
    const formatted = path.replace('/', '');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          id="sidebar-toggle" 
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex-1 px-4 md:px-6">
          <h2 className="text-lg font-heading font-semibold">{getPageTitle(location)}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative">
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

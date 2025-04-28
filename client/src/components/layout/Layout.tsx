import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useSchoolSettings } from '@/providers/SchoolSettingsProvider';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useSchoolSettings();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Bar */}
        <TopBar toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 mt-8">
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {settings.schoolName}. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

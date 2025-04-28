import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Music, Home, Users, UserPlus, Calendar, Banknote, DollarSign, CreditCard, 
  Mail, BarChart3, Settings 
} from 'lucide-react';
import { useAuthContext } from '@/providers/AuthProvider';
import { useSchoolSettings } from '@/providers/SchoolSettingsProvider';

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuthContext();
  const { settings } = useSchoolSettings();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on location change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const toggle = document.getElementById('sidebar-toggle');
      
      if (window.innerWidth < 768 && 
          sidebar && 
          toggle && 
          !sidebar.contains(event.target as Node) && 
          !toggle.contains(event.target as Node) &&
          isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.displayName) return 'U';
    
    const nameParts = user.displayName.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <div 
      id="sidebar" 
      className={`sidebar fixed md:static w-64 h-full bg-white shadow-lg z-10 transition-transform ${isOpen ? 'open' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-100">
          <h1 className="font-heading font-bold text-xl text-primary-700 flex items-center gap-2">
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="w-8 h-8 object-contain" 
              />
            ) : (
              <Music className="w-8 h-8" />
            )}
            {settings.schoolName}
          </h1>
        </div>
        
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Home className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            
            <li className="mt-6 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Gestão de Alunos
            </li>
            
            <li>
              <Link 
                href="/students" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/students' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Users className="w-5 h-5" />
                Alunos
              </Link>
            </li>
            
            <li>
              <Link 
                href="/registration" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/registration' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <UserPlus className="w-5 h-5" />
                Matrículas
              </Link>
            </li>
            
            <li>
              <Link 
                href="/classes" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/classes' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Aulas e Horários
              </Link>
            </li>
            
            <li className="mt-6 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Financeiro
            </li>
            
            <li>
              <Link 
                href="/finance" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/finance' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Banknote className="w-5 h-5" />
                Controle Financeiro
              </Link>
            </li>
            
            <li>
              <Link 
                href="/accounting" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/accounting' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                Contabilidade
              </Link>
            </li>
            
            <li>
              <Link 
                href="/payments" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/payments' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Pagamentos
              </Link>
            </li>
            
            <li className="mt-6 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              CRM
            </li>
            
            <li>
              <Link 
                href="/communications" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/communications' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Mail className="w-5 h-5" />
                Comunicações
              </Link>
            </li>
            
            <li>
              <Link 
                href="/reports" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/reports' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Relatórios
              </Link>
            </li>
            
            <li className="mt-6 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Sistema
            </li>
            
            <li>
              <Link 
                href="/settings" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  location === '/settings' ? 'sidebar-active' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <Settings className="w-5 h-5" />
                Configurações
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
              {getUserInitials()}
            </div>
            <div>
              <p className="text-sm font-medium">
                {user?.displayName || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || 'Administrador'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

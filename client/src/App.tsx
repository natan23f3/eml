import { Switch, Route, Redirect } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/not-found';
import AuthPage from '@/pages/auth-page';
import { useAuth } from '@/providers/AuthProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Componente de proteção de rota
function ProtectedRoute({ component: Component, ...rest }: { component: React.FC<any>, path: string }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }
  
  return <Component {...rest} />;
}

// Dashboard temporário simplificado
function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MusicSchool Pro</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Olá, {user?.name}</span>
            <button 
              onClick={logout}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-600">Bem-vindo ao sistema de gestão para escolas de música.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Alunos', icon: '👥', count: '0', color: 'bg-blue-500' },
              { title: 'Professores', icon: '👨‍🏫', count: '0', color: 'bg-green-500' },
              { title: 'Cursos', icon: '🎵', count: '0', color: 'bg-purple-500' },
              { title: 'Pagamentos', icon: '💰', count: 'R$ 0', color: 'bg-yellow-500' }
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className={`h-2 ${card.color}`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium">{card.title}</p>
                      <p className="text-3xl font-bold mt-2">{card.count}</p>
                    </div>
                    <div className="text-3xl">{card.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Módulos Disponíveis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Alunos', 'Professores', 'Cursos', 'Aulas', 
                'Pagamentos', 'Relatórios', 'Comunicações', 'Configurações'
              ].map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <h4 className="font-medium">{module}</h4>
                  <p className="text-sm text-gray-500 mt-1">Gerenciar {module.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            MusicSchool Pro • Sistema de Gestão para Escolas de Música • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Aplicação principal com roteamento
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Toaster />
        
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route path="/" component={() => <ProtectedRoute path="/" component={Dashboard} />} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;
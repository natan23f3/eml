import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/not-found';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Importar páginas
import Dashboard from '@/pages/Dashboard';
import Alunos from '@/pages/Alunos';
import Professores from '@/pages/Professores';

// Aplicação principal com roteamento
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Toaster />
        
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/alunos" component={Alunos} />
          <Route path="/professores" component={Professores} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;
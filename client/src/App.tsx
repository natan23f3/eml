import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/not-found';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Importar páginas
import Dashboard from '@/pages/Dashboard';
import Alunos from '@/pages/Alunos';
import Professores from '@/pages/Professores';
import Cursos from '@/pages/Cursos';
import Aulas from '@/pages/Aulas';
import Pagamentos from '@/pages/Pagamentos';
import Comunicacoes from '@/pages/Comunicacoes';
import Relatorios from '@/pages/Relatorios';
import MateriaisEducacionais from '@/pages/MateriaisEducacionais';

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
          <Route path="/cursos" component={Cursos} />
          <Route path="/aulas" component={Aulas} />
          <Route path="/pagamentos" component={Pagamentos} />
          <Route path="/comunicacoes" component={Comunicacoes} />
          <Route path="/relatorios" component={Relatorios} />
          <Route path="/materiais" component={MateriaisEducacionais} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;
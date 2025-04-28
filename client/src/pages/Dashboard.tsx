import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  // Estatísticas para o dashboard
  const stats = [
    { title: 'Alunos', icon: '👥', count: '154', color: 'bg-blue-500' },
    { title: 'Professores', icon: '👨‍🏫', count: '12', color: 'bg-green-500' },
    { title: 'Cursos', icon: '🎵', count: '23', color: 'bg-purple-500' },
    { title: 'Pagamentos', icon: '💰', count: 'R$ 24.850', color: 'bg-yellow-500' }
  ];

  // Módulos do sistema
  const modules = [
    { name: 'Alunos', description: 'Cadastro e gestão de alunos', path: '/alunos' },
    { name: 'Professores', description: 'Equipe de professores', path: '/professores' },
    { name: 'Cursos', description: 'Cursos e programas', path: '/cursos' },
    { name: 'Aulas', description: 'Calendário e agendamentos', path: '/aulas' },
    { name: 'Pagamentos', description: 'Controle financeiro', path: '/pagamentos' },
    { name: 'Relatórios', description: 'Análises e estatísticas', path: '/relatorios' },
    { name: 'Comunicações', description: 'Mensagens e avisos', path: '/comunicacoes' },
    { name: 'Configurações', description: 'Preferências do sistema', path: '/configuracoes' }
  ];

  // Atividades recentes (simuladas)
  const activities = [
    { id: 1, user: 'Maria Silva', action: 'matriculou-se no curso', target: 'Violão Avançado', time: 'há 2 horas' },
    { id: 2, user: 'Prof. João Santos', action: 'cadastrou nova aula de', target: 'Piano', time: 'há 4 horas' },
    { id: 3, user: 'Carlos Oliveira', action: 'efetuou pagamento de', target: 'R$ 350,00', time: 'há 1 dia' },
    { id: 4, user: 'Fernanda Lima', action: 'cancelou aula de', target: 'Canto', time: 'há 1 dia' },
    { id: 5, user: 'Admin', action: 'adicionou novo curso de', target: 'Bateria para Iniciantes', time: 'há 2 dias' }
  ];

  return (
    <MainLayout
      title="Dashboard"
      description="Visão geral do sistema de gestão para escolas de música."
    >
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`h-2 ${stat.color}`}></div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.count}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Módulos do sistema */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Módulos do Sistema</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {modules.map((module, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => window.location.href = module.path}
                  >
                    <h4 className="font-medium">{module.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Atividades recentes */}
        <div>
          <Card className="shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Atividades Recentes</h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                          strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
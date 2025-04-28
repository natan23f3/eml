import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, DollarSign, BookOpen, BarChart3, UserPlus, Calendar, Banknote
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ScheduleCard } from '@/components/dashboard/ScheduleCard';
import { StudentTable } from '@/components/dashboard/StudentTable';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { DashboardStats, RecentActivity, ScheduleItem, RecentStudent } from '@/types/schema';

export default function Dashboard() {
  const [revenueTimeframe, setRevenueTimeframe] = useState<'Mensal' | 'Anual'>('Mensal');
  
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    staleTime: 300000, // 5 minutes
  });

  // Fetch recent activities
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/dashboard/activities'],
    staleTime: 60000, // 1 minute
  });

  // Fetch daily schedule
  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ['/api/dashboard/schedule'],
    staleTime: 60000, // 1 minute
  });

  // Fetch recent students
  const { data: recentStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/dashboard/recent-students'],
    staleTime: 60000, // 1 minute
  });

  // Sample data for revenue chart
  const revenueData = [
    { name: 'Jan', receita: 24500, despesa: 18000, lucro: 6500 },
    { name: 'Fev', receita: 26700, despesa: 17800, lucro: 8900 },
    { name: 'Mar', receita: 28900, despesa: 18900, lucro: 10000 },
    { name: 'Abr', receita: 29200, despesa: 19200, lucro: 10000 },
    { name: 'Mai', receita: 30500, despesa: 19800, lucro: 10700 },
    { name: 'Jun', receita: 32450, despesa: 21000, lucro: 11450 },
  ];

  // Sample data for students distribution
  const instrumentData = [
    { name: 'Violão', value: 35 },
    { name: 'Piano', value: 25 },
    { name: 'Bateria', value: 15 },
    { name: 'Canto', value: 12 },
    { name: 'Baixo', value: 8 },
    { name: 'Outros', value: 5 },
  ];

  // Chart legends
  const revenueLegend = [
    { color: '#3b82f6', label: 'Receitas' },
    { color: '#ef4444', label: 'Despesas' },
    { color: '#22c55e', label: 'Lucro' },
  ];

  const instrumentLegend = [
    { color: '#3b82f6', label: 'Violão' },
    { color: '#8b5cf6', label: 'Piano' },
    { color: '#eab308', label: 'Bateria' },
    { color: '#22c55e', label: 'Canto' },
    { color: '#ef4444', label: 'Baixo' },
    { color: '#f97316', label: 'Outros' },
  ];

  return (
    <Layout>
      {/* Dashboard Overview */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Stats Cards */}
          <StatCard
            title="Total de Alunos"
            value={statsLoading ? '...' : stats?.studentCount || 0}
            change={{ value: '12% desde o mês passado', isPositive: true }}
            icon={<Users className="w-5 h-5" />}
            iconBgColor="bg-primary-100"
            iconTextColor="text-primary-700"
          />
          
          <StatCard
            title="Receita Mensal"
            value={statsLoading ? '...' : `R$ ${stats?.monthlyRevenue?.toLocaleString('pt-BR') || 0}`}
            change={{ value: '8% desde o mês passado', isPositive: true }}
            icon={<DollarSign className="w-5 h-5" />}
            iconBgColor="bg-green-100"
            iconTextColor="text-green-700"
          />
          
          <StatCard
            title="Total de Aulas"
            value={statsLoading ? '...' : stats?.classCount || 0}
            change={{ value: '5% desde o mês passado', isPositive: true }}
            icon={<BookOpen className="w-5 h-5" />}
            iconBgColor="bg-purple-100"
            iconTextColor="text-purple-700"
          />
          
          <StatCard
            title="Taxa de Conversão"
            value={statsLoading ? '...' : `${stats?.conversionRate || 0}%`}
            change={{ value: '3% desde o mês passado', isPositive: false }}
            icon={<BarChart3 className="w-5 h-5" />}
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-700"
          />
        </div>
        
        {/* Chart Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Receitas vs Despesas"
            chartType="bar"
            data={revenueData}
            timeframe={revenueTimeframe}
            setTimeframe={setRevenueTimeframe}
            legendItems={revenueLegend}
          />
          
          <ChartCard
            title="Distribuição de Alunos por Instrumento"
            chartType="pie"
            data={instrumentData}
            colors={['#3b82f6', '#8b5cf6', '#eab308', '#22c55e', '#ef4444', '#f97316']}
            legendItems={instrumentLegend}
          />
        </div>
      </div>
      
      {/* Recent Activity & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ActivityFeed 
          activities={activitiesLoading ? [] : (activities as RecentActivity[])} 
          isLoading={activitiesLoading} 
        />
        
        <ScheduleCard 
          scheduleItems={scheduleLoading ? [] : (schedule as ScheduleItem[])}
          isLoading={scheduleLoading}
        />
      </div>
      
      {/* Recent Students */}
      <StudentTable 
        students={studentsLoading ? [] : (recentStudents as RecentStudent[])}
        isLoading={studentsLoading}
      />
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          title="Cadastrar Novo Aluno"
          description="Adicione um novo aluno e configure suas aulas e pagamentos."
          icon={<UserPlus className="w-6 h-6" />}
          iconBgColor="bg-primary-100"
          iconTextColor="text-primary-700"
          buttonText="Iniciar Cadastro"
          buttonBgColor="bg-primary-50"
          buttonTextColor="text-primary-700"
          buttonHoverBgColor="bg-primary-100"
          href="/students/new"
        />
        
        <QuickAction
          title="Agendar Nova Aula"
          description="Crie um novo agendamento para aulas individuais ou em grupo."
          icon={<Calendar className="w-6 h-6" />}
          iconBgColor="bg-purple-100"
          iconTextColor="text-purple-700"
          buttonText="Criar Agendamento"
          buttonBgColor="bg-purple-50"
          buttonTextColor="text-purple-700"
          buttonHoverBgColor="bg-purple-100"
          href="/classes/new"
        />
        
        <QuickAction
          title="Registrar Pagamento"
          description="Registre um novo pagamento de mensalidade ou outros serviços."
          icon={<Banknote className="w-6 h-6" />}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-700"
          buttonText="Registrar Pagamento"
          buttonBgColor="bg-green-50"
          buttonTextColor="text-green-700"
          buttonHoverBgColor="bg-green-100"
          href="/payments/new"
        />
      </div>
    </Layout>
  );
}

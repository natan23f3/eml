import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Importação fictícia de gráficos para exemplificar - usaríamos Recharts na implementação real
const BarChart = ({ data }: { data: any }) => (
  <div className="h-[300px] w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-md flex items-center justify-center">
    <div className="text-center">
      <div className="text-xl font-semibold text-blue-700 mb-2">Gráfico de Barras</div>
      <div className="text-gray-500">Simulação de visualização de dados</div>
    </div>
  </div>
);

const LineChart = ({ data }: { data: any }) => (
  <div className="h-[300px] w-full bg-gradient-to-r from-green-50 to-green-100 rounded-md flex items-center justify-center">
    <div className="text-center">
      <div className="text-xl font-semibold text-green-700 mb-2">Gráfico de Linhas</div>
      <div className="text-gray-500">Simulação de visualização de dados</div>
    </div>
  </div>
);

const PieChart = ({ data }: { data: any }) => (
  <div className="h-[300px] w-full bg-gradient-to-r from-purple-50 to-purple-100 rounded-md flex items-center justify-center">
    <div className="text-center">
      <div className="text-xl font-semibold text-purple-700 mb-2">Gráfico de Pizza</div>
      <div className="text-gray-500">Simulação de visualização de dados</div>
    </div>
  </div>
);

export default function Relatorios() {
  const [reportType, setReportType] = useState('financeiro');
  const [period, setPeriod] = useState('mes');
  
  // Dados simulados para relatórios
  const financialData = {
    summary: {
      revenue: 'R$ 45.850,00',
      expenses: 'R$ 28.320,00',
      profit: 'R$ 17.530,00',
      pendingPayments: 'R$ 5.200,00',
    },
    revenueByMonth: [
      { month: 'Jan', value: 38500 },
      { month: 'Fev', value: 42000 },
      { month: 'Mar', value: 40800 },
      { month: 'Abr', value: 43200 },
      { month: 'Mai', value: 45850 },
    ],
    expensesByCategory: [
      { category: 'Salários', value: 18500 },
      { category: 'Aluguel', value: 4500 },
      { category: 'Equipamentos', value: 2800 },
      { category: 'Marketing', value: 1200 },
      { category: 'Outros', value: 1320 },
    ],
    topCoursesByRevenue: [
      { course: 'Piano Intermediário', value: 12800 },
      { course: 'Violão para Iniciantes', value: 9450 },
      { course: 'Canto Avançado', value: 8100 },
      { course: 'Bateria para Iniciantes', value: 6800 },
      { course: 'Violino Iniciante', value: 4500 },
    ],
  };
  
  const studentsData = {
    summary: {
      totalStudents: 154,
      activeStudents: 142,
      newStudentsThisMonth: 18,
      retentionRate: '92%',
    },
    enrollmentsByMonth: [
      { month: 'Jan', value: 12 },
      { month: 'Fev', value: 15 },
      { month: 'Mar', value: 10 },
      { month: 'Abr', value: 14 },
      { month: 'Mai', value: 18 },
    ],
    studentsByAge: [
      { age: '7-12', count: 34 },
      { age: '13-18', count: 48 },
      { age: '19-25', count: 37 },
      { age: '26-40', count: 25 },
      { age: '40+', count: 10 },
    ],
    topCoursesByEnrollment: [
      { course: 'Violão para Iniciantes', students: 32 },
      { course: 'Piano Intermediário', students: 24 },
      { course: 'Canto Avançado', students: 18 },
      { course: 'Bateria para Iniciantes', students: 15 },
      { course: 'Teoria Musical', students: 12 },
    ],
  };
  
  const classesData = {
    summary: {
      totalClasses: 285,
      activeClasses: 48,
      averageStudentsPerClass: 6.2,
      classesThisMonth: 180,
    },
    classesByDay: [
      { day: 'Segunda', count: 12 },
      { day: 'Terça', count: 10 },
      { day: 'Quarta', count: 11 },
      { day: 'Quinta', count: 9 },
      { day: 'Sexta', count: 8 },
      { day: 'Sábado', count: 6 },
    ],
    classesByTimeSlot: [
      { time: '8h-10h', count: 8 },
      { time: '10h-12h', count: 10 },
      { time: '14h-16h', count: 12 },
      { time: '16h-18h', count: 15 },
      { time: '18h-20h', count: 11 },
    ],
    mostPopularRooms: [
      { room: 'Sala 101', classes: 12 },
      { room: 'Sala 203', classes: 10 },
      { room: 'Sala 102', classes: 9 },
      { room: 'Sala 105', classes: 8 },
      { room: 'Sala 204', classes: 7 },
    ],
  };
  
  // Selecionar os dados corretos com base no tipo de relatório
  const reportData = reportType === 'financeiro' 
    ? financialData 
    : reportType === 'alunos' 
      ? studentsData 
      : classesData;
  
  // Função para exportar relatório
  const exportReport = () => {
    alert('Funcionalidade de exportação de relatório será implementada em breve.');
  };
  
  return (
    <MainLayout
      title="Relatórios"
      description="Análise de dados e geração de relatórios."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-4">
          <div className="w-[180px]">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="alunos">Alunos</SelectItem>
                <SelectItem value="aulas">Aulas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-[180px]">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Mês Atual</SelectItem>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="semestre">Último Semestre</SelectItem>
                <SelectItem value="ano">Último Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={exportReport}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar Relatório
        </Button>
      </div>
      
      {/* Relatório Financeiro */}
      {reportType === 'financeiro' && (
        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{financialData.summary.revenue}</div>
                <p className="text-xs text-gray-500 mt-1">Período: {period === 'mes' ? 'Mês Atual' : 
                  period === 'trimestre' ? 'Último Trimestre' : 
                  period === 'semestre' ? 'Último Semestre' : 'Último Ano'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Despesas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{financialData.summary.expenses}</div>
                <p className="text-xs text-gray-500 mt-1">Período: {period === 'mes' ? 'Mês Atual' : 
                  period === 'trimestre' ? 'Último Trimestre' : 
                  period === 'semestre' ? 'Último Semestre' : 'Último Ano'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{financialData.summary.profit}</div>
                <p className="text-xs text-gray-500 mt-1">Período: {period === 'mes' ? 'Mês Atual' : 
                  period === 'trimestre' ? 'Último Trimestre' : 
                  period === 'semestre' ? 'Último Semestre' : 'Último Ano'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pagamentos Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{financialData.summary.pendingPayments}</div>
                <p className="text-xs text-gray-500 mt-1">Total de pagamentos em aberto</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Mês</CardTitle>
                <CardDescription>Evolução da receita nos últimos 5 meses</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <LineChart data={financialData.revenueByMonth} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>Distribuição de despesas por categoria</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <PieChart data={financialData.expensesByCategory} />
              </CardContent>
            </Card>
          </div>
          
          {/* Tabela de Top Cursos */}
          <Card>
            <CardHeader>
              <CardTitle>Cursos por Receita</CardTitle>
              <CardDescription>Os cursos que mais geraram receita no período</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialData.topCoursesByRevenue.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.course}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Relatório de Alunos */}
      {reportType === 'alunos' && (
        <div className="space-y-6">
          {/* Resumo de Alunos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{studentsData.summary.totalStudents}</div>
                <p className="text-xs text-gray-500 mt-1">Alunos matriculados na escola</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Alunos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{studentsData.summary.activeStudents}</div>
                <p className="text-xs text-gray-500 mt-1">Alunos com matrículas ativas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Novos Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{studentsData.summary.newStudentsThisMonth}</div>
                <p className="text-xs text-gray-500 mt-1">Matrículas novas este mês</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Taxa de Retenção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{studentsData.summary.retentionRate}</div>
                <p className="text-xs text-gray-500 mt-1">Alunos que renovaram matrícula</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Matrículas por Mês</CardTitle>
                <CardDescription>Evolução de novas matrículas nos últimos 5 meses</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <BarChart data={studentsData.enrollmentsByMonth} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alunos por Faixa Etária</CardTitle>
                <CardDescription>Distribuição de alunos por idade</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <PieChart data={studentsData.studentsByAge} />
              </CardContent>
            </Card>
          </div>
          
          {/* Tabela de Top Cursos */}
          <Card>
            <CardHeader>
              <CardTitle>Cursos por Matrícula</CardTitle>
              <CardDescription>Os cursos com mais alunos matriculados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead className="text-right">Alunos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsData.topCoursesByEnrollment.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.course}</TableCell>
                      <TableCell className="text-right">{item.students}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Relatório de Aulas */}
      {reportType === 'aulas' && (
        <div className="space-y-6">
          {/* Resumo de Aulas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Aulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{classesData.summary.totalClasses}</div>
                <p className="text-xs text-gray-500 mt-1">Aulas ministradas no período</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Turmas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{classesData.summary.activeClasses}</div>
                <p className="text-xs text-gray-500 mt-1">Turmas em andamento</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Média de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{classesData.summary.averageStudentsPerClass}</div>
                <p className="text-xs text-gray-500 mt-1">Alunos por turma (média)</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Aulas Este Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{classesData.summary.classesThisMonth}</div>
                <p className="text-xs text-gray-500 mt-1">Total de aulas no mês</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aulas por Dia da Semana</CardTitle>
                <CardDescription>Distribuição de aulas ao longo da semana</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <BarChart data={classesData.classesByDay} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Aulas por Horário</CardTitle>
                <CardDescription>Distribuição de aulas por faixa de horário</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <BarChart data={classesData.classesByTimeSlot} />
              </CardContent>
            </Card>
          </div>
          
          {/* Tabela de Salas Populares */}
          <Card>
            <CardHeader>
              <CardTitle>Salas Mais Utilizadas</CardTitle>
              <CardDescription>As salas com maior número de aulas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sala</TableHead>
                    <TableHead className="text-right">Aulas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classesData.mostPopularRooms.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.room}</TableCell>
                      <TableCell className="text-right">{item.classes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
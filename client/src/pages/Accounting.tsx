import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter, FileText, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#8b5cf6', '#ec4899'];

export default function Accounting() {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  
  // Fetch data for accounting reports
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['/api/expenses'],
  });

  // Sample data for charts - would normally be calculated from the API data
  const monthlyData = [
    { name: 'Jan', revenue: 38000, expenses: 20000 },
    { name: 'Fev', revenue: 35000, expenses: 22000 },
    { name: 'Mar', revenue: 32000, expenses: 19000 },
    { name: 'Abr', revenue: 36000, expenses: 21000 },
    { name: 'Mai', revenue: 34000, expenses: 20000 },
    { name: 'Jun', revenue: 39000, expenses: 22000 },
    { name: 'Jul', revenue: 42000, expenses: 23000 },
    { name: 'Ago', revenue: 41000, expenses: 24000 },
    { name: 'Set', revenue: 45000, expenses: 25000 },
    { name: 'Out', revenue: 43000, expenses: 24000 },
    { name: 'Nov', revenue: 46000, expenses: 26000 },
    { name: 'Dez', revenue: 48000, expenses: 27000 },
  ];

  // Calculate profit for each month
  const dataWithProfit = monthlyData.map(item => ({
    ...item,
    profit: item.revenue - item.expenses,
  }));

  // Category data for the pie chart
  const categoryData = [
    { name: 'Aulas Particulares', value: 45 },
    { name: 'Aulas em Grupo', value: 20 },
    { name: 'Venda de Instrumentos', value: 15 },
    { name: 'Aluguel de Salas', value: 10 },
    { name: 'Eventos', value: 7 },
    { name: 'Outros', value: 3 },
  ];

  // Expense category data for the pie chart
  const expenseCategoryData = [
    { name: 'Salários', value: 55 },
    { name: 'Aluguel', value: 18 },
    { name: 'Utilidades', value: 10 },
    { name: 'Marketing', value: 8 },
    { name: 'Manutenção', value: 6 },
    { name: 'Outros', value: 3 },
  ];

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-heading font-bold">Contabilidade</h1>
        
        <div className="flex gap-2 self-end">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Gerar Demonstrativo
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Período:</span>
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Ano:</span>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros avançados
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Receita Total ({year})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600">
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              ) : (
                `R$ ${monthlyData.reduce((acc, item) => acc + item.revenue, 0).toLocaleString('pt-BR')}`
              )}
            </div>
            <div className="text-xs text-green-600 mt-1">
              +8.7% em relação ao ano anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Despesas Totais ({year})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              ) : (
                `R$ ${monthlyData.reduce((acc, item) => acc + item.expenses, 0).toLocaleString('pt-BR')}`
              )}
            </div>
            <div className="text-xs text-red-600 mt-1">
              +4.2% em relação ao ano anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Lucro Líquido ({year})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              ) : (
                `R$ ${monthlyData.reduce((acc, item) => acc + (item.revenue - item.expenses), 0).toLocaleString('pt-BR')}`
              )}
            </div>
            <div className="text-xs text-green-600 mt-1">
              +12.5% em relação ao ano anterior
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="profitability">Lucratividade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Receitas vs Despesas ({year})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataWithProfit}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Receita" fill="#3b82f6" />
                    <Bar dataKey="expenses" name="Despesas" fill="#ef4444" />
                    <Bar dataKey="profit" name="Lucro" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas por Mês ({year})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                      <Area type="monotone" dataKey="revenue" name="Receita" stroke="#3b82f6" fill="#3b82f6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receitas por Categoria ({year})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Mês ({year})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                      <Area type="monotone" dataKey="expenses" name="Despesas" stroke="#ef4444" fill="#ef4444" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria ({year})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {expenseCategoryData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profitability">
          <Card>
            <CardHeader>
              <CardTitle>Margem de Lucro Mensal ({year})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dataWithProfit.map(item => ({
                      ...item,
                      margin: ((item.profit / item.revenue) * 100).toFixed(2)
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => name === 'margin' ? `${value}%` : `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                    <Area type="monotone" dataKey="profit" name="Lucro" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                    <Area type="monotone" dataKey="margin" name="Margem %" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

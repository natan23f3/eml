import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportCard } from '@/components/reports/ReportCard';
import { Download, FileText, Users, GraduationCap, Calendar, DollarSign, ChevronRight } from 'lucide-react';

export default function Reports() {
  const [period, setPeriod] = useState<string>('month');
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-heading font-bold">Relatórios</h1>
        
        <div className="flex gap-2 self-end">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="classes">Aulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
              title="Crescimento de Alunos"
              icon={<Users className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconTextColor="text-primary-700"
              description="Acompanhe o crescimento da base de alunos"
              value={period === "month" ? "12%" : period === "quarter" ? "18%" : "32%"}
              trend="up"
              path="/reports/students"
            />
            
            <ReportCard 
              title="Desempenho de Receitas"
              icon={<DollarSign className="h-5 w-5" />}
              iconBgColor="bg-green-100"
              iconTextColor="text-green-700"
              description="Analise o desempenho financeiro da escola"
              value={period === "month" ? "R$ 32.450" : period === "quarter" ? "R$ 95.200" : "R$ 380.800"}
              trend="up"
              path="/reports/financial"
            />
            
            <ReportCard 
              title="Ocupação de Salas"
              icon={<Calendar className="h-5 w-5" />}
              iconBgColor="bg-purple-100"
              iconTextColor="text-purple-700"
              description="Veja a taxa de utilização das salas"
              value={period === "month" ? "87%" : period === "quarter" ? "82%" : "79%"}
              trend="up"
              path="/reports/classes"
            />
            
            <ReportCard 
              title="Matrículas Realizadas"
              icon={<GraduationCap className="h-5 w-5" />}
              iconBgColor="bg-blue-100"
              iconTextColor="text-blue-700"
              description="Visualize as matrículas por período"
              value={period === "month" ? "38" : period === "quarter" ? "112" : "345"}
              trend="up"
              path="/reports/enrollments"
            />
            
            <ReportCard 
              title="Taxa de Conversão"
              icon={<Users className="h-5 w-5" />}
              iconBgColor="bg-amber-100"
              iconTextColor="text-amber-700"
              description="Acompanhe a conversão de leads para alunos"
              value={period === "month" ? "64%" : period === "quarter" ? "58%" : "62%"}
              trend="down"
              path="/reports/conversion"
            />
            
            <ReportCard 
              title="Taxa de Evasão"
              icon={<Users className="h-5 w-5" />}
              iconBgColor="bg-red-100"
              iconTextColor="text-red-700"
              description="Monitore a saída de alunos"
              value={period === "month" ? "3.2%" : period === "quarter" ? "5.8%" : "12.4%"}
              trend="down"
              path="/reports/retention"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="students">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Alunos por Instrumento</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                  <span>Gráfico de distribuição por instrumento</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Faixa Etária dos Alunos</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span>Gráfico de barras de faixa etária</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Taxa de Retenção de Alunos</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span>Gráfico de linha de retenção ao longo do tempo</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span>Gráfico de barras comparativo</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Despesas</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                  <span>Gráfico de pizza de categorias</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Evolução da Margem de Lucro</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span>Gráfico de linha de evolução ao longo do tempo</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="classes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ocupação por Sala</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span>Gráfico de ocupação por sala</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Aulas por Dia da Semana</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                  <span>Gráfico de barras por dia da semana</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Desempenho dos Professores</CardTitle>
                <CardDescription>
                  {period === "month" ? "Últimos 30 dias" : period === "quarter" ? "Últimos 3 meses" : "Últimos 12 meses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-gray-400 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span>Tabela comparativa de desempenho</span>
                  <span className="text-sm mt-1">Dados carregados do Firebase em tempo real</span>
                  <Button variant="link" className="mt-4 flex items-center gap-1">
                    Ver detalhes <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-primary-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-primary-700 mb-2">Acesse relatórios avançados</h3>
        <p className="text-sm text-primary-600 mb-4">Exporte relatórios detalhados em PDF ou Excel para análises mais profundas.</p>
        <div className="flex justify-center gap-4">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório Completo
          </Button>
        </div>
      </div>
    </Layout>
  );
}

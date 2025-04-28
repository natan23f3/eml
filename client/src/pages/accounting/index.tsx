import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Download, FileText, PieChart } from 'lucide-react';
import FinancialChart from '@/components/financial/FinancialChart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AccountingPage: React.FC = () => {
  const [view, setView] = useState<'overview' | 'revenue' | 'expenses'>('overview');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  
  // Fetch financial report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: [`/api/reports/financial?startDate=${startDate}&endDate=${endDate}`],
  });
  
  // Format currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };
  
  // Update date range based on period selection
  const updateDateRange = (selectedPeriod: 'month' | 'quarter' | 'year') => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]);
    setPeriod(selectedPeriod);
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Contabilidade</h1>
            <p className="text-neutral-400">Gestão financeira e contábil da escola</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>
      
      {/* Period Selection */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant={period === 'month' ? 'default' : 'outline'} 
                onClick={() => updateDateRange('month')}
              >
                Último Mês
              </Button>
              <Button 
                variant={period === 'quarter' ? 'default' : 'outline'} 
                onClick={() => updateDateRange('quarter')}
              >
                Último Trimestre
              </Button>
              <Button 
                variant={period === 'year' ? 'default' : 'outline'} 
                onClick={() => updateDateRange('year')}
              >
                Último Ano
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="startDate" className="whitespace-nowrap">De:</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-auto"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="endDate" className="whitespace-nowrap">Até:</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="card bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-neutral-500">
                  {isLoading ? "..." : formatCurrency(reportData?.totalRevenue || 0)}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <span className="material-icons text-xs mr-1">Período selecionado</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="text-green-600 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Despesas Totais</p>
                <p className="text-2xl font-bold text-neutral-500">
                  {isLoading ? "..." : formatCurrency(reportData?.totalExpenses || 0)}
                </p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <span className="material-icons text-xs mr-1">Período selecionado</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="text-red-600 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Lucro Líquido</p>
                <p className="text-2xl font-bold text-neutral-500">
                  {isLoading ? "..." : formatCurrency(reportData?.netProfit || 0)}
                </p>
                <p className={`text-xs ${reportData?.netProfit >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                  <span className="material-icons text-xs mr-1">Período selecionado</span>
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full ${reportData?.netProfit >= 0 ? 'bg-blue-100' : 'bg-amber-100'} flex items-center justify-center`}>
                <PieChart className={`${reportData?.netProfit >= 0 ? 'text-blue-600' : 'text-amber-600'} h-6 w-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Receitas x Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-80">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <FinancialChart data={reportData?.monthlyData || []} />
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-60">
                    <div className="loading-spinner"></div>
                  </div>
                ) : reportData?.revenueByCategory?.length > 0 ? (
                  <div className="space-y-4">
                    {reportData?.revenueByCategory?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1} mr-2`}></div>
                          <span className="font-medium">{item.category === 'guitar' ? 'Violão' : 
                                             item.category === 'piano' ? 'Piano' : 
                                             item.category === 'drums' ? 'Bateria' : 
                                             item.category === 'saxophone' ? 'Saxofone' : 
                                             item.category === 'violin' ? 'Violino' : item.category}</span>
                        </div>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum dado de receita disponível para o período selecionado.
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-60">
                    <div className="loading-spinner"></div>
                  </div>
                ) : reportData?.expensesByCategory?.length > 0 ? (
                  <div className="space-y-4">
                    {reportData?.expensesByCategory?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1} mr-2`}></div>
                          <span className="font-medium">{item.category === 'rent' ? 'Aluguel' : 
                                             item.category === 'utilities' ? 'Serviços Públicos' : 
                                             item.category === 'salaries' ? 'Salários' :
                                             item.category === 'marketing' ? 'Marketing' :
                                             item.category === 'equipment' ? 'Equipamentos' : item.category}</span>
                        </div>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum dado de despesa disponível para o período selecionado.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Módulo de análise detalhada de receitas em desenvolvimento.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Módulo de análise detalhada de despesas em desenvolvimento.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingPage;

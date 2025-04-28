import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, BarChart, PieChart, TrendingUp } from 'lucide-react';
import FinancialReportChart from '@/components/reports/FinancialReportChart';
import StudentReportChart from '@/components/reports/StudentReportChart';
import ReportFilters from '@/components/reports/ReportFilters';
import { useQuery } from '@tanstack/react-query';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('financial');
  const [reportPeriod, setReportPeriod] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Fetch financial report data
  const { data: financialReportData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: [`/api/reports/financial?startDate=${reportPeriod.startDate}&endDate=${reportPeriod.endDate}`],
  });
  
  // Fetch student report data (would be implemented in a real app)
  const { data: studentReportData, isLoading: isLoadingStudent } = useQuery({
    queryKey: [`/api/reports/students?startDate=${reportPeriod.startDate}&endDate=${reportPeriod.endDate}`],
    enabled: false, // Disable for now since endpoint might not exist yet
  });
  
  const handleFilterChange = (filters: typeof reportPeriod) => {
    setReportPeriod(filters);
  };
  
  // Mock student data for demonstration
  const mockStudentData = [
    { month: 'Jan', newStudents: 12, totalStudents: 120 },
    { month: 'Fev', newStudents: 15, totalStudents: 135 },
    { month: 'Mar', newStudents: 10, totalStudents: 145 },
    { month: 'Abr', newStudents: 8, totalStudents: 153 },
    { month: 'Mai', newStudents: 14, totalStudents: 167 },
    { month: 'Jun', newStudents: 9, totalStudents: 176 },
    { month: 'Jul', newStudents: 18, totalStudents: 194 },
    { month: 'Ago', newStudents: 13, totalStudents: 207 },
    { month: 'Set', newStudents: 11, totalStudents: 218 },
    { month: 'Out', newStudents: 16, totalStudents: 234 },
    { month: 'Nov', newStudents: 12, totalStudents: 246 },
    { month: 'Dez', newStudents: 6, totalStudents: 252 },
  ];
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Relatórios</h1>
            <p className="text-neutral-400">Análises e relatórios gerenciais</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Report Filters */}
      <ReportFilters 
        filters={reportPeriod}
        onChange={handleFilterChange}
      />
      
      {/* Report Tabs */}
      <Tabs defaultValue="financial" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Alunos
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Aulas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <FinancialReportChart 
                  data={financialReportData?.monthlyData || []}
                  isLoading={isLoadingFinancial}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Receitas por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingFinancial ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="loading-spinner"></div>
                      </div>
                    ) : financialReportData?.revenueByCategory?.length > 0 ? (
                      <div className="space-y-4">
                        {financialReportData?.revenueByCategory?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1} mr-2`}></div>
                              <span className="font-medium">{item.category === 'guitar' ? 'Violão' : 
                                                 item.category === 'piano' ? 'Piano' : 
                                                 item.category === 'drums' ? 'Bateria' : 
                                                 item.category === 'saxophone' ? 'Saxofone' : 
                                                 item.category === 'violin' ? 'Violino' : item.category}</span>
                            </div>
                            <span>R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum dado disponível para o período selecionado.
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Despesas por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingFinancial ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="loading-spinner"></div>
                      </div>
                    ) : financialReportData?.expensesByCategory?.length > 0 ? (
                      <div className="space-y-4">
                        {financialReportData?.expensesByCategory?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1} mr-2`}></div>
                              <span className="font-medium">{item.category === 'rent' ? 'Aluguel' : 
                                                 item.category === 'utilities' ? 'Serviços Públicos' : 
                                                 item.category === 'salaries' ? 'Salários' :
                                                 item.category === 'marketing' ? 'Marketing' :
                                                 item.category === 'equipment' ? 'Equipamentos' : item.category}</span>
                            </div>
                            <span>R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum dado disponível para o período selecionado.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <StudentReportChart 
                  data={mockStudentData}
                  isLoading={isLoadingStudent}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Distribuição por Instrumento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Visualização em desenvolvimento.
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Retenção de Alunos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Visualização em desenvolvimento.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Módulo de relatórios de aulas em desenvolvimento.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;

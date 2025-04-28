import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Plus, Filter, Search, Download } from 'lucide-react';
import PaymentTable from '@/components/financial/PaymentTable';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const PaymentsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Construct query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', currentPage.toString());
  queryParams.append('limit', '10');
  
  if (studentId) {
    queryParams.append('studentId', studentId);
  }
  
  if (status) {
    queryParams.append('status', status);
  }
  
  if (startDate) {
    queryParams.append('startDate', startDate);
  }
  
  if (endDate) {
    queryParams.append('endDate', endDate);
  }
  
  // Fetch payments with filters
  const { data, isLoading } = useQuery({
    queryKey: [`/api/payments?${queryParams.toString()}`],
  });
  
  // Fetch students for filter dropdown
  const { data: studentsData } = useQuery({
    queryKey: ['/api/students?limit=100'],
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const clearFilters = () => {
    setStudentId('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  const applyFilters = () => {
    setCurrentPage(1);
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Pagamentos</h1>
            <p className="text-neutral-400">Gerenciamento de pagamentos de alunos</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
              <Link href="/payments/new" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Novo Pagamento
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label className="block text-sm font-medium text-neutral-400 mb-1">Buscar</Label>
              <div className="relative">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Código, referência..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-300 h-4 w-4" />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-neutral-400 mb-1">Aluno</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os alunos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os alunos</SelectItem>
                  {studentsData?.students?.map((student: any) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-neutral-400 mb-1">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-neutral-400 mb-1">Data Inicial</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-neutral-400 mb-1">Data Final</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-neutral-400">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filtros ativos: {[studentId, status, startDate, endDate, searchTerm].filter(Boolean).length}</span>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={clearFilters}>
                Limpar todos
              </Button>
              <Button type="button" onClick={applyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payments Table */}
      <PaymentTable 
        payments={data?.payments || []} 
        totalCount={data?.total || 0} 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PaymentsPage;

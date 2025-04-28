import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Plus } from 'lucide-react';
import ClassTable from '@/components/classes/ClassTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ClassesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [instrument, setInstrument] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [status, setStatus] = useState('active');
  
  // Construct query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', currentPage.toString());
  queryParams.append('limit', '10');
  
  if (instrument) {
    queryParams.append('instrument', instrument);
  }
  
  if (teacherId) {
    queryParams.append('teacherId', teacherId);
  }
  
  if (status) {
    queryParams.append('status', status);
  }
  
  // Fetch classes with filters
  const { data, isLoading } = useQuery({
    queryKey: [`/api/classes?${queryParams.toString()}`],
  });
  
  // Fetch teachers for filter dropdown
  const { data: teachersData } = useQuery({
    queryKey: ['/api/teachers?limit=100'],
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const instrumentOptions = [
    { value: '', label: 'Todos os instrumentos' },
    { value: 'guitar', label: 'Violão' },
    { value: 'piano', label: 'Piano' },
    { value: 'drums', label: 'Bateria' },
    { value: 'saxophone', label: 'Saxofone' },
    { value: 'violin', label: 'Violino' },
  ];
  
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativa' },
    { value: 'inactive', label: 'Inativa' },
    { value: 'pending', label: 'Pendente' },
  ];
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Aulas</h1>
            <p className="text-neutral-400">Gerenciamento de aulas e turmas</p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
            <Link href="/classes/new" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nova Aula
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Instrumento</label>
              <Select value={instrument} onValueChange={setInstrument}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os instrumentos" />
                </SelectTrigger>
                <SelectContent>
                  {instrumentOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Professor</label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os professores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os professores</SelectItem>
                  {teachersData?.teachers?.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => {
              setInstrument('');
              setTeacherId('');
              setStatus('active');
            }} className="mr-2">
              Limpar Filtros
            </Button>
            <Button onClick={() => setCurrentPage(1)}>
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Classes Table */}
      <ClassTable 
        classes={data?.classes || []} 
        totalCount={data?.total || 0} 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClassesPage;

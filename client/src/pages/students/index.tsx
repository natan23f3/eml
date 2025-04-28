import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { UserPlus } from 'lucide-react';
import StudentFilters, { StudentFilterValues } from '@/components/students/StudentFilters';
import StudentTable from '@/components/students/StudentTable';

const StudentsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<StudentFilterValues>({
    search: '',
    instrument: '',
    status: '',
    teacher: ''
  });
  
  // Construct query params
  const queryParams = new URLSearchParams();
  queryParams.append('page', currentPage.toString());
  queryParams.append('limit', '10');
  
  if (filters.search) {
    queryParams.append('search', filters.search);
  }
  
  if (filters.instrument) {
    queryParams.append('instrument', filters.instrument);
  }
  
  if (filters.status) {
    queryParams.append('status', filters.status);
  }
  
  if (filters.teacher) {
    queryParams.append('teacherId', filters.teacher);
  }
  
  // Fetch students with filters
  const { data, isLoading } = useQuery({
    queryKey: [`/api/students?${queryParams.toString()}`],
  });
  
  const handleFilterChange = (newFilters: StudentFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Cadastro de Alunos</h1>
            <p className="text-neutral-400">Gerenciamento completo de alunos</p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
            <Link href="/students/new" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <StudentFilters onFilterChange={handleFilterChange} />
      
      {/* Students Table */}
      <StudentTable 
        students={data?.students || []} 
        totalCount={data?.total || 0} 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StudentsPage;

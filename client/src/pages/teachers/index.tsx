import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { UserPlus } from 'lucide-react';
import TeacherTable from '@/components/teachers/TeacherTable';
import TeacherFilters from '@/components/teachers/TeacherFilters';

const TeachersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    instrument: '',
    status: ''
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
  
  // Fetch teachers with filters
  const { data, isLoading } = useQuery({
    queryKey: [`/api/teachers?${queryParams.toString()}`],
  });
  
  const handleFilterChange = (newFilters: typeof filters) => {
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
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Professores</h1>
            <p className="text-neutral-400">Gerenciamento de professores da escola</p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
            <Link href="/teachers/new" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Professor
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <TeacherFilters onFilterChange={handleFilterChange} />
      
      {/* Teachers Table */}
      <TeacherTable 
        teachers={data?.teachers || []} 
        totalCount={data?.total || 0} 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TeachersPage;

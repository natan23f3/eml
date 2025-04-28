import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface StudentFiltersProps {
  onFilterChange: (filters: StudentFilterValues) => void;
}

export interface StudentFilterValues {
  search: string;
  instrument: string;
  status: string;
  teacher: string;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<StudentFilterValues>({
    search: '',
    instrument: '',
    status: '',
    teacher: ''
  });
  
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };
  
  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      instrument: '',
      status: '',
      teacher: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="block text-sm font-medium text-neutral-400 mb-1">Buscar</Label>
              <div className="relative">
                <Input
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleInputChange}
                  placeholder="Nome, email ou telefone"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-300 h-4 w-4" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="instrument" className="block text-sm font-medium text-neutral-400 mb-1">Instrumento</Label>
              <Select 
                value={filters.instrument} 
                onValueChange={(value) => handleSelectChange('instrument', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="guitar">Violão</SelectItem>
                  <SelectItem value="piano">Piano</SelectItem>
                  <SelectItem value="drums">Bateria</SelectItem>
                  <SelectItem value="saxophone">Saxofone</SelectItem>
                  <SelectItem value="violin">Violino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status" className="block text-sm font-medium text-neutral-400 mb-1">Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="trial">Em período de teste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="teacher" className="block text-sm font-medium text-neutral-400 mb-1">Professor</Label>
              <Select 
                value={filters.teacher} 
                onValueChange={(value) => handleSelectChange('teacher', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="1">Carlos Oliveira</SelectItem>
                  <SelectItem value="2">Laura Mendes</SelectItem>
                  <SelectItem value="3">Ricardo Nunes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-neutral-400">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filtros ativos: {activeFiltersCount}</span>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={handleClearFilters}>
                Limpar todos
              </Button>
              <Button type="submit">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentFilters;

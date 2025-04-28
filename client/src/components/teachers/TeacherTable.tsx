import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft,
  ChevronRight,
  UnfoldVertical, 
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Music
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';

interface Instrument {
  name: string;
  value: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  instruments: string[];
  hireDate?: string;
  status: 'active' | 'inactive' | 'on_leave';
  hourlyRate?: number;
  avatar?: string;
}

interface TeacherTableProps {
  teachers: Teacher[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const TeacherTable: React.FC<TeacherTableProps> = ({ 
  teachers, 
  totalCount, 
  currentPage, 
  onPageChange,
  isLoading = false
}) => {
  const [, navigate] = useLocation();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return <UnfoldVertical className="ml-1 h-4 w-4 text-muted-foreground" />;
    
    return sortDirection === 'asc' 
      ? <ChevronDown className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4 rotate-180" />;
  };
  
  const formatInstruments = (instruments: string[]) => {
    if (!instruments || instruments.length === 0) return '';
    
    const instrumentNames: { [key: string]: string } = {
      guitar: 'Violão',
      piano: 'Piano',
      drums: 'Bateria',
      saxophone: 'Saxofone',
      violin: 'Violino'
    };
    
    return instruments.map(i => instrumentNames[i] || i).join(', ');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Inativo</Badge>;
      case 'on_leave':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Licença</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="px-6 py-3" onClick={() => handleSort('name')}>
                <div className="flex items-center cursor-pointer">
                  <span>Professor</span>
                  {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('contact')}>
                <div className="flex items-center cursor-pointer">
                  <span>Contato</span>
                  {renderSortIcon('contact')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('instruments')}>
                <div className="flex items-center cursor-pointer">
                  <span>Instrumentos</span>
                  {renderSortIcon('instruments')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('hireDate')}>
                <div className="flex items-center cursor-pointer">
                  <span>Contratação</span>
                  {renderSortIcon('hireDate')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('status')}>
                <div className="flex items-center cursor-pointer">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('hourlyRate')}>
                <div className="flex items-center cursor-pointer">
                  <span>Valor/Hora</span>
                  {renderSortIcon('hourlyRate')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array(7).fill(0).map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`} className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhum professor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id} className="hover:bg-neutral-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        {teacher.avatar ? (
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        ) : null}
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-500">{teacher.name}</div>
                        <div className="text-xs text-neutral-400">ID: #{teacher.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">{teacher.email}</div>
                    <div className="text-xs text-neutral-400">{teacher.phone}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {teacher.instruments.map((instrument, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-800 border-blue-100">
                          {instrument === 'guitar' ? 'Violão' : 
                           instrument === 'piano' ? 'Piano' : 
                           instrument === 'drums' ? 'Bateria' : 
                           instrument === 'saxophone' ? 'Saxofone' : 
                           instrument === 'violin' ? 'Violino' : instrument}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">
                      {teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(teacher.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">
                      {teacher.hourlyRate ? `R$ ${teacher.hourlyRate.toFixed(2)}` : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/teachers/${teacher.id}`)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/teachers/edit/${teacher.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Music className="mr-2 h-4 w-4" />
                          Ver aulas
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Inativar professor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-700">
              Mostrando <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalCount)}
              </span> de <span className="font-medium">{totalCount}</span> professores
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Anterior</span>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page 
                        ? 'bg-primary text-white'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700">
                    ...
                  </span>
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Próximo</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeacherTable;

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
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  instrument: string;
  level: string;
  teacher: string;
  status: 'active' | 'inactive' | 'trial' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'overdue' | 'exempt';
  avatar?: string;
}

interface StudentTableProps {
  students: Student[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
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
  
  const getLevelName = (level: string) => {
    const levels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return levels[level as keyof typeof levels] || level;
  };
  
  const getInstrumentName = (instrument: string) => {
    const instruments = {
      guitar: 'Violão',
      piano: 'Piano',
      drums: 'Bateria',
      saxophone: 'Saxofone',
      violin: 'Violino'
    };
    return instruments[instrument as keyof typeof instruments] || instrument;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Inativo</Badge>;
      case 'trial':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Período de teste</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Em dia</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Atrasado</Badge>;
      case 'exempt':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Isento</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="px-6 py-3" onClick={() => handleSort('name')}>
                <div className="flex items-center cursor-pointer">
                  <span>Aluno</span>
                  {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('contact')}>
                <div className="flex items-center cursor-pointer">
                  <span>Contato</span>
                  {renderSortIcon('contact')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('instrument')}>
                <div className="flex items-center cursor-pointer">
                  <span>Instrumento</span>
                  {renderSortIcon('instrument')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('teacher')}>
                <div className="flex items-center cursor-pointer">
                  <span>Professor</span>
                  {renderSortIcon('teacher')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('status')}>
                <div className="flex items-center cursor-pointer">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('payment')}>
                <div className="flex items-center cursor-pointer">
                  <span>Pagamento</span>
                  {renderSortIcon('payment')}
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
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-neutral-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        {student.avatar ? (
                          <AvatarImage src={student.avatar} alt={student.name} />
                        ) : null}
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-500">{student.name}</div>
                        <div className="text-xs text-neutral-400">ID: #{student.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">{student.email}</div>
                    <div className="text-xs text-neutral-400">{student.phone}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">{getInstrumentName(student.instrument)}</div>
                    <div className="text-xs text-neutral-400">{getLevelName(student.level)}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">{student.teacher}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(student.paymentStatus)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 px-2 text-primary">
                          Detalhes
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/students/${student.id}`)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/students/edit/${student.id}`)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Registrar pagamento</DropdownMenuItem>
                        <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Inativar aluno
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
              </span> de <span className="font-medium">{totalCount}</span> alunos
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
    </div>
  );
};

export default StudentTable;

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ChevronLeft,
  ChevronRight,
  UnfoldVertical, 
  ChevronDown,
  MoreHorizontal,
  FileText,
  Edit,
  Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Payment {
  id: string;
  student: {
    id: string;
    name: string;
  };
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  method: string;
  description: string;
}

interface PaymentTableProps {
  payments: Payment[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ 
  payments, 
  totalCount, 
  currentPage, 
  onPageChange,
  isLoading = false
}) => {
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
  
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Atrasado</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border-neutral-200">Cancelado</Badge>;
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
              <TableHead className="px-6 py-3" onClick={() => handleSort('id')}>
                <div className="flex items-center cursor-pointer">
                  <span>ID</span>
                  {renderSortIcon('id')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('student')}>
                <div className="flex items-center cursor-pointer">
                  <span>Aluno</span>
                  {renderSortIcon('student')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('amount')}>
                <div className="flex items-center cursor-pointer">
                  <span>Valor</span>
                  {renderSortIcon('amount')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('date')}>
                <div className="flex items-center cursor-pointer">
                  <span>Data Pgto.</span>
                  {renderSortIcon('date')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center cursor-pointer">
                  <span>Vencimento</span>
                  {renderSortIcon('dueDate')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('status')}>
                <div className="flex items-center cursor-pointer">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3" onClick={() => handleSort('method')}>
                <div className="flex items-center cursor-pointer">
                  <span>Método</span>
                  {renderSortIcon('method')}
                </div>
              </TableHead>
              <TableHead className="px-6 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array(8).fill(0).map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`} className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Nenhum pagamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-neutral-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-500">#{payment.id}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-500">{payment.student.name}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-500">{formatCurrency(payment.amount)}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-500">{payment.date}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-500">{payment.dueDate}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-500">{payment.method}</span>
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
                        <DropdownMenuItem className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Ver detalhes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
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
              </span> de <span className="font-medium">{totalCount}</span> pagamentos
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

export default PaymentTable;

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format, parseISO, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Tipo para despesa
type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
  status: 'paid' | 'pending' | 'cancelled';
  recurrent: boolean;
  notes?: string;
  attachmentUrl?: string;
};

// Schema para validação do formulário
const expenseSchema = z.object({
  description: z.string().min(3, { message: 'A descrição deve ter pelo menos 3 caracteres' }),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'O valor deve ser um número positivo'
  }),
  category: z.string().min(1, { message: 'Selecione uma categoria' }),
  paymentMethod: z.string().min(1, { message: 'Selecione um método de pagamento' }),
  date: z.string().min(1, { message: 'Selecione uma data' }),
  status: z.string().min(1, { message: 'Selecione um status' }),
  recurrent: z.boolean().default(false),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function Despesas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('current');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Dados de exemplo para categorias
  const categories = [
    'Salários',
    'Aluguel',
    'Equipamentos',
    'Material Didático',
    'Manutenção',
    'Marketing',
    'Impostos',
    'Utilities',
    'Serviços Terceirizados',
    'Outros'
  ];
  
  // Dados de exemplo para métodos de pagamento
  const paymentMethods = [
    'Pix',
    'Cartão de Crédito',
    'Cartão de Débito',
    'Transferência Bancária',
    'Dinheiro',
    'Boleto',
    'Cheque'
  ];
  
  // Dados de exemplo para despesas
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      description: 'Aluguel do Espaço',
      amount: 3500,
      category: 'Aluguel',
      paymentMethod: 'Transferência Bancária',
      date: '2023-07-01T10:00:00.000Z',
      status: 'paid',
      recurrent: true,
      notes: 'Pagamento referente ao mês de julho'
    },
    {
      id: '2',
      description: 'Salário Professor Roberto Almeida',
      amount: 2800,
      category: 'Salários',
      paymentMethod: 'Pix',
      date: '2023-07-05T14:30:00.000Z',
      status: 'paid',
      recurrent: true
    },
    {
      id: '3',
      description: 'Compra de 2 Violões para Aulas',
      amount: 1200,
      category: 'Equipamentos',
      paymentMethod: 'Cartão de Crédito',
      date: '2023-07-10T16:45:00.000Z',
      status: 'paid',
      recurrent: false,
      notes: 'Compra de 2 violões Yamaha modelo C40'
    },
    {
      id: '4',
      description: 'Material Didático - Partituras',
      amount: 450,
      category: 'Material Didático',
      paymentMethod: 'Cartão de Débito',
      date: '2023-07-12T11:20:00.000Z',
      status: 'paid',
      recurrent: false
    },
    {
      id: '5',
      description: 'Manutenção do Ar Condicionado',
      amount: 350,
      category: 'Manutenção',
      paymentMethod: 'Dinheiro',
      date: '2023-07-15T09:30:00.000Z',
      status: 'paid',
      recurrent: false,
      notes: 'Serviço de limpeza e manutenção dos aparelhos'
    },
    {
      id: '6',
      description: 'Campanha de Marketing no Instagram',
      amount: 500,
      category: 'Marketing',
      paymentMethod: 'Cartão de Crédito',
      date: '2023-07-18T13:10:00.000Z',
      status: 'paid',
      recurrent: false
    },
    {
      id: '7',
      description: 'Impostos Municipais',
      amount: 950,
      category: 'Impostos',
      paymentMethod: 'Boleto',
      date: '2023-07-20T10:45:00.000Z',
      status: 'pending',
      recurrent: true,
      notes: 'Vencimento dia 25/07'
    },
    {
      id: '8',
      description: 'Conta de Energia',
      amount: 680,
      category: 'Utilities',
      paymentMethod: 'Boleto',
      date: '2023-07-22T09:15:00.000Z',
      status: 'pending',
      recurrent: true,
      notes: 'Vencimento dia 28/07'
    },
    {
      id: '9',
      description: 'Serviço de Limpeza',
      amount: 1200,
      category: 'Serviços Terceirizados',
      paymentMethod: 'Pix',
      date: '2023-07-25T16:30:00.000Z',
      status: 'pending',
      recurrent: true
    },
    {
      id: '10',
      description: 'Manutenção do Piano de Cauda',
      amount: 800,
      category: 'Manutenção',
      paymentMethod: 'Cheque',
      date: '2023-08-02T11:00:00.000Z',
      status: 'pending',
      recurrent: false,
      notes: 'Agendado para o início do próximo mês'
    }
  ]);
  
  // Configuração do formulário
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: '',
      category: '',
      paymentMethod: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending',
      recurrent: false,
      notes: '',
    },
  });
  
  // Função para filtrar despesas por data
  const getFilteredByDateExpenses = () => {
    const now = new Date();
    
    if (dateFilter === 'current') {
      const firstDay = startOfMonth(now);
      const lastDay = endOfMonth(now);
      
      return expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= firstDay && expenseDate <= lastDay;
      });
    } else if (dateFilter === 'next') {
      const firstDay = startOfMonth(addMonths(now, 1));
      const lastDay = endOfMonth(addMonths(now, 1));
      
      return expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= firstDay && expenseDate <= lastDay;
      });
    } else if (dateFilter === 'previous') {
      const firstDay = startOfMonth(addMonths(now, -1));
      const lastDay = endOfMonth(addMonths(now, -1));
      
      return expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= firstDay && expenseDate <= lastDay;
      });
    }
    
    return expenses;
  };
  
  // Filtrar despesas
  const filteredExpenses = getFilteredByDateExpenses()
    .filter(expense => {
      if (categoryFilter && expense.category !== categoryFilter) {
        return false;
      }
      
      if (statusFilter && expense.status !== statusFilter) {
        return false;
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower) ||
          expense.notes?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  
  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Função para obter o texto do status
  const getStatusText = (status: Expense['status']) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  // Função para obter a cor do status
  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para calcular totais
  const calculateTotals = () => {
    const totals = {
      all: 0,
      paid: 0,
      pending: 0
    };
    
    filteredExpenses.forEach(expense => {
      totals.all += expense.amount;
      
      if (expense.status === 'paid') {
        totals.paid += expense.amount;
      } else if (expense.status === 'pending') {
        totals.pending += expense.amount;
      }
    });
    
    return totals;
  };
  
  const totals = calculateTotals();
  
  // Função para editar despesa
  const handleEdit = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setIsEditMode(true);
    
    form.reset({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      date: format(parseISO(expense.date), 'yyyy-MM-dd'),
      status: expense.status,
      recurrent: expense.recurrent,
      notes: expense.notes || '',
    });
    
    setIsDialogOpen(true);
  };
  
  // Função para excluir despesa
  const handleDelete = (expenseId: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      
      toast({
        title: 'Despesa excluída',
        description: 'A despesa foi excluída com sucesso.',
      });
    }
  };
  
  // Função para enviar o formulário
  const onSubmit = (values: ExpenseFormValues) => {
    if (isEditMode && editingExpenseId) {
      // Atualizar despesa existente
      const updatedExpenses = expenses.map(expense => {
        if (expense.id === editingExpenseId) {
          return {
            ...expense,
            description: values.description,
            amount: Number(values.amount),
            category: values.category,
            paymentMethod: values.paymentMethod,
            date: new Date(values.date).toISOString(),
            status: values.status as Expense['status'],
            recurrent: values.recurrent,
            notes: values.notes,
          };
        }
        return expense;
      });
      
      setExpenses(updatedExpenses);
      
      toast({
        title: 'Despesa atualizada',
        description: `A despesa "${values.description}" foi atualizada com sucesso.`,
      });
    } else {
      // Criar nova despesa
      const newExpense: Expense = {
        id: (expenses.length + 1).toString(),
        description: values.description,
        amount: Number(values.amount),
        category: values.category,
        paymentMethod: values.paymentMethod,
        date: new Date(values.date).toISOString(),
        status: values.status as Expense['status'],
        recurrent: values.recurrent,
        notes: values.notes,
      };
      
      setExpenses([...expenses, newExpense]);
      
      toast({
        title: 'Despesa adicionada',
        description: `A despesa "${values.description}" foi adicionada com sucesso.`,
      });
    }
    
    // Fechar diálogo e resetar formulário
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingExpenseId(null);
    form.reset();
  };
  
  return (
    <MainLayout
      title="Despesas"
      description="Gerenciamento de despesas da escola de música."
    >
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative w-full sm:w-auto sm:min-w-[240px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar despesas..."
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous">Mês Anterior</SelectItem>
                  <SelectItem value="current">Mês Atual</SelectItem>
                  <SelectItem value="next">Próximo Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Editar Despesa' : 'Adicionar Nova Despesa'}</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição da despesa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0.01" 
                              step="0.01" 
                              placeholder="0,00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Método de Pagamento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um método" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method} value={method}>{method}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="paid">Pago</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recurrent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-8">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Despesa recorrente
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Observações adicionais..." 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => {
                      setIsDialogOpen(false);
                      setIsEditMode(false);
                      setEditingExpenseId(null);
                      form.reset();
                    }}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {isEditMode ? 'Atualizar Despesa' : 'Adicionar Despesa'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totals.all)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {filteredExpenses.length} despesas no período
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.paid)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {filteredExpenses.filter(e => e.status === 'paid').length} despesas pagas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Pendente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totals.pending)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {filteredExpenses.filter(e => e.status === 'pending').length} despesas pendentes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Despesas</CardTitle>
          <CardDescription>
            {dateFilter === 'current' ? 'Mês atual' : 
             dateFilter === 'next' ? 'Próximo mês' : 'Mês anterior'}
            {categoryFilter && ` • Categoria: ${categoryFilter}`}
            {statusFilter && ` • Status: ${getStatusText(statusFilter as any)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recorrente</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {getStatusText(expense.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {expense.recurrent ? (
                        <span className="text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" 
                          onClick={() => handleEdit(expense)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          <span className="sr-only">Editar</span>
                        </Button>
                        
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" 
                          onClick={() => handleDelete(expense.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      Nenhuma despesa encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
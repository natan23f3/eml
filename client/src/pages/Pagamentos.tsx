import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para aluno (simplificado)
type Student = {
  id: string;
  name: string;
  email: string;
};

// Tipo para curso (simplificado)
type Course = {
  id: string;
  name: string;
  price: string;
};

// Tipo para pagamento
type Payment = {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'pix';
  paymentDate: string;
  dueDate: string;
  notes?: string;
};

// Schema para validação do formulário
const paymentSchema = z.object({
  studentId: z.string().min(1, { message: 'Selecione um aluno' }),
  courseId: z.string().min(1, { message: 'Selecione um curso' }),
  amount: z.string().min(1, { message: 'Informe o valor' }),
  status: z.string().min(1, { message: 'Selecione o status' }),
  paymentMethod: z.string().min(1, { message: 'Selecione um método de pagamento' }),
  paymentDate: z.string().optional(),
  dueDate: z.string().min(1, { message: 'Informe a data de vencimento' }),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function Pagamentos() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Dados de exemplo para alunos
  const students: Student[] = [
    { id: '1', name: 'Maria Silva', email: 'maria.silva@email.com' },
    { id: '2', name: 'João Oliveira', email: 'joao.oliveira@email.com' },
    { id: '3', name: 'Ana Souza', email: 'ana.souza@email.com' },
    { id: '4', name: 'Pedro Santos', email: 'pedro.santos@email.com' },
    { id: '5', name: 'Luiza Costa', email: 'luiza.costa@email.com' },
  ];
  
  // Dados de exemplo para cursos
  const courses: Course[] = [
    { id: '1', name: 'Violão para Iniciantes', price: 'R$ 450,00' },
    { id: '2', name: 'Piano Intermediário', price: 'R$ 800,00' },
    { id: '3', name: 'Canto Avançado', price: 'R$ 900,00' },
    { id: '4', name: 'Bateria para Iniciantes', price: 'R$ 600,00' },
  ];
  
  // Dados de exemplo para pagamentos
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      studentId: '1',
      courseId: '1',
      amount: 450,
      status: 'paid',
      paymentMethod: 'credit_card',
      paymentDate: '2023-06-05',
      dueDate: '2023-06-10',
      notes: 'Pagamento da mensalidade de junho',
    },
    {
      id: '2',
      studentId: '2',
      courseId: '2',
      amount: 800,
      status: 'paid',
      paymentMethod: 'bank_transfer',
      paymentDate: '2023-06-08',
      dueDate: '2023-06-15',
      notes: 'Pagamento da mensalidade de junho',
    },
    {
      id: '3',
      studentId: '3',
      courseId: '3',
      amount: 900,
      status: 'pending',
      paymentMethod: 'cash',
      paymentDate: '',
      dueDate: '2023-06-20',
      notes: 'Aguardando pagamento',
    },
    {
      id: '4',
      studentId: '4',
      courseId: '4',
      amount: 600,
      status: 'cancelled',
      paymentMethod: 'pix',
      paymentDate: '2023-06-01',
      dueDate: '2023-06-05',
      notes: 'Cancelado a pedido do aluno',
    },
    {
      id: '5',
      studentId: '5',
      courseId: '1',
      amount: 450,
      status: 'paid',
      paymentMethod: 'credit_card',
      paymentDate: '2023-05-10',
      dueDate: '2023-05-15',
      notes: 'Pagamento da mensalidade de maio',
    },
  ]);
  
  // Configuração do formulário
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
      amount: '',
      status: '',
      paymentMethod: '',
      paymentDate: '',
      dueDate: '',
      notes: '',
    },
  });
  
  // Filtrar pagamentos com base na aba ativa e no termo de pesquisa
  const filteredPayments = payments
    .filter(payment => {
      if (activeTab === 'todos') return true;
      return payment.status === activeTab;
    })
    .filter(payment => {
      if (!searchTerm) return true;
      
      const student = students.find(s => s.id === payment.studentId);
      const course = courses.find(c => c.id === payment.courseId);
      
      return (
        student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.includes(searchTerm) ||
        payment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
  // Função para obter o nome do aluno
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Aluno não encontrado';
  };
  
  // Função para obter o nome do curso
  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Curso não encontrado';
  };
  
  // Função para obter a cor do status
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter o texto do status
  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };
  
  // Função para obter o texto do método de pagamento
  const getPaymentMethodText = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'bank_transfer':
        return 'Transferência Bancária';
      case 'cash':
        return 'Dinheiro';
      case 'pix':
        return 'PIX';
      default:
        return method;
    }
  };
  
  // Função para enviar o formulário
  const onSubmit = (values: PaymentFormValues) => {
    // Criar o novo pagamento
    const newPayment: Payment = {
      id: (payments.length + 1).toString(),
      studentId: values.studentId,
      courseId: values.courseId,
      amount: Number(values.amount),
      status: values.status as Payment['status'],
      paymentMethod: values.paymentMethod as Payment['paymentMethod'],
      paymentDate: values.paymentDate || '',
      dueDate: values.dueDate,
      notes: values.notes,
    };
    
    // Adicionar o novo pagamento à lista
    setPayments([...payments, newPayment]);
    
    // Fechar o diálogo e resetar o formulário
    setIsDialogOpen(false);
    form.reset();
    
    // Mostrar mensagem de sucesso
    toast({
      title: 'Pagamento registrado',
      description: `O pagamento foi registrado com sucesso.`,
    });
  };
  
  // Função para formatar valores como moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  return (
    <MainLayout
      title="Pagamentos"
      description="Gerenciamento de pagamentos da escola de música."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 relative max-w-sm">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar pagamentos..."
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Novo Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Pagamento</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluno</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curso</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um curso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name} - {course.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Vencimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Pagamento</FormLabel>
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="paid">Pago</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                            <SelectItem value="refunded">Reembolsado</SelectItem>
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
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                            <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                            <SelectItem value="cash">Dinheiro</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                        <Input placeholder="Observações sobre o pagamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Pagamento</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Pagamentos</CardTitle>
          
          <Tabs defaultValue="todos" className="mt-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="paid">Pagos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>#{payment.id}</TableCell>
                    <TableCell className="font-medium">{getStudentName(payment.studentId)}</TableCell>
                    <TableCell>{getCourseName(payment.courseId)}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.paymentDate || '-'}</TableCell>
                    <TableCell>{getPaymentMethodText(payment.paymentMethod)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      Nenhum pagamento encontrado
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
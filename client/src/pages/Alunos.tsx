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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Esquema de validação para o formulário
const studentSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Forneça um e-mail válido' }),
  phone: z.string().min(10, { message: 'Forneça um telefone válido' }),
  course: z.string().min(1, { message: 'Selecione um curso' }),
  status: z.string().min(1, { message: 'Selecione um status' }),
  address: z.string().optional(),
  document: z.string().optional(),
  monthlyFee: z.string().optional(),
  paymentDay: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

// Tipo para aluno
type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  address?: string;
  document?: string;
  monthlyFee?: string;
  paymentDay?: string;
  paymentMethod?: string;
  notes?: string;
};

export default function Alunos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Dados de exemplo
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      phone: '(11) 98765-4321',
      course: 'Violão',
      status: 'active',
      registrationDate: '2023-05-10'
    },
    {
      id: '2',
      name: 'João Oliveira',
      email: 'joao.oliveira@email.com',
      phone: '(11) 91234-5678',
      course: 'Piano',
      status: 'active',
      registrationDate: '2023-04-15'
    },
    {
      id: '3',
      name: 'Ana Souza',
      email: 'ana.souza@email.com',
      phone: '(11) 99876-5432',
      course: 'Canto',
      status: 'inactive',
      registrationDate: '2023-01-20'
    },
    {
      id: '4',
      name: 'Pedro Santos',
      email: 'pedro.santos@email.com',
      phone: '(11) 95678-1234',
      course: 'Bateria',
      status: 'active',
      registrationDate: '2023-06-05'
    },
    {
      id: '5',
      name: 'Luiza Costa',
      email: 'luiza.costa@email.com',
      phone: '(11) 94321-8765',
      course: 'Violino',
      status: 'pending',
      registrationDate: '2023-06-25'
    }
  ]);
  
  // Lista de cursos disponíveis
  const courses = [
    'Violão',
    'Piano',
    'Canto',
    'Bateria',
    'Violino',
    'Guitarra',
    'Flauta',
    'Saxofone',
    'Contrabaixo',
    'Teclado'
  ];

  // Configuração do formulário
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      course: '',
      status: 'active',
    },
  });

  // Função para editar aluno
  const handleEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setIsEditMode(true);
    
    form.reset({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      status: student.status,
    });
    
    setIsDialogOpen(true);
  };
  
  // Função para excluir aluno
  const handleDeleteStudent = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      const studentToDelete = students.find(s => s.id === id);
      setStudents(students.filter(student => student.id !== id));
      
      toast({
        title: 'Aluno excluído',
        description: `O aluno ${studentToDelete?.name} foi removido com sucesso.`,
        variant: 'destructive',
      });
    }
  };
  
  // Função para salvar um novo aluno ou atualizar um existente
  const onSubmit = (values: StudentFormValues) => {
    if (isEditMode && editingStudentId) {
      // Atualizar aluno existente
      const updatedStudents = students.map(student => {
        if (student.id === editingStudentId) {
          return {
            ...student,
            name: values.name,
            email: values.email,
            phone: values.phone,
            course: values.course,
            status: values.status as 'active' | 'inactive' | 'pending',
          };
        }
        return student;
      });
      
      setStudents(updatedStudents);
      
      toast({
        title: 'Aluno atualizado',
        description: `As informações de ${values.name} foram atualizadas com sucesso.`,
      });
    } else {
      // Criar novo aluno
      const newStudent: Student = {
        id: (students.length + 1).toString(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        course: values.course,
        status: values.status as 'active' | 'inactive' | 'pending',
        registrationDate: new Date().toISOString().split('T')[0],
      };
      
      setStudents([...students, newStudent]);
      
      toast({
        title: 'Aluno adicionado',
        description: `${values.name} foi adicionado com sucesso.`,
      });
    }
    
    // Fechar diálogo e limpar formulário
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingStudentId(null);
    form.reset();
  };
  
  // Filtrar alunos com base no termo de pesquisa e status
  const filteredStudents = students.filter(student => {
    // Filtro por termo de busca
    const matchesSearchTerm = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status
    const matchesStatus = statusFilter && statusFilter !== 'all' ? student.status === statusFilter : true;
    
    return matchesSearchTerm && matchesStatus;
  });
  
  // Função para obter a cor de status
  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter o texto de status
  const getStatusText = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };
  
  return (
    <MainLayout
      title="Alunos"
      description="Gerenciamento de alunos da escola de música."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative w-full sm:w-auto sm:min-w-[240px]">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar alunos..."
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
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditMode(false);
              form.reset({
                name: '',
                email: '',
                phone: '',
                course: '',
                status: 'active',
              });
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="course"
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
                              <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-medium mb-4">Informações Financeiras</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="monthlyFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensalidade (R$)</FormLabel>
                          <FormControl>
                            <Input placeholder="0,00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dia de Pagamento</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="31" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forma de Pagamento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pix">Pix</SelectItem>
                              <SelectItem value="creditCard">Cartão de Crédito</SelectItem>
                              <SelectItem value="bankSlip">Boleto Bancário</SelectItem>
                              <SelectItem value="bankTransfer">Transferência</SelectItem>
                              <SelectItem value="cash">Dinheiro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Informações adicionais sobre o aluno..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditMode ? 'Salvar Alterações' : 'Adicionar Aluno'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Total de {filteredStudents.length} alunos encontrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto max-h-[70vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="min-w-[140px]">Nome</TableHead>
                    <TableHead className="min-w-[180px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Telefone</TableHead>
                    <TableHead className="min-w-[100px]">Curso</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[130px]">Data de Registro</TableHead>
                    <TableHead className="text-right min-w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {getStatusText(student.status)}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(student.registrationDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditStudent(student)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                              strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" 
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                              strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" 
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        Nenhum aluno encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
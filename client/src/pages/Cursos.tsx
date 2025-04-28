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
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Esquema de validação para o formulário
const courseSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  instrument: z.string().min(1, { message: 'Selecione um instrumento' }),
  description: z.string().optional(),
  duration: z.string().min(1, { message: 'Informe a duração do curso' }),
  price: z.string().min(1, { message: 'Informe o preço do curso' }),
  level: z.string().min(1, { message: 'Selecione o nível do curso' }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

// Tipo para curso
type Course = {
  id: string;
  name: string;
  instrument: string;
  description?: string;
  duration: string;
  price: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  students: number;
};

export default function Cursos() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Violão para Iniciantes',
      instrument: 'Violão',
      description: 'Curso introdutório de violão para absolutos iniciantes.',
      duration: '3 meses',
      price: 'R$ 450,00',
      level: 'beginner',
      students: 12
    },
    {
      id: '2',
      name: 'Piano Intermediário',
      instrument: 'Piano',
      description: 'Técnicas de piano para alunos com conhecimento básico.',
      duration: '6 meses',
      price: 'R$ 800,00',
      level: 'intermediate',
      students: 8
    },
    {
      id: '3',
      name: 'Canto Avançado',
      instrument: 'Voz',
      description: 'Aperfeiçoamento vocal para cantores com experiência.',
      duration: '4 meses',
      price: 'R$ 900,00',
      level: 'advanced',
      students: 5
    },
    {
      id: '4',
      name: 'Bateria para Iniciantes',
      instrument: 'Bateria',
      description: 'Primeiros passos na bateria e percussão.',
      duration: '3 meses',
      price: 'R$ 600,00',
      level: 'beginner',
      students: 6
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Configuração do formulário com validação
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      instrument: '',
      description: '',
      duration: '',
      price: '',
      level: '',
    },
  });
  
  // Filtrar cursos com base no termo de pesquisa
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Função para enviar o formulário
  const onSubmit = (values: CourseFormValues) => {
    // Criar um novo curso
    const newCourse: Course = {
      id: (courses.length + 1).toString(),
      name: values.name,
      instrument: values.instrument,
      description: values.description,
      duration: values.duration,
      price: values.price.startsWith('R$') ? values.price : `R$ ${values.price}`,
      level: values.level as 'beginner' | 'intermediate' | 'advanced',
      students: 0
    };
    
    // Adicionar o novo curso à lista
    setCourses([...courses, newCourse]);
    
    // Fechar o diálogo e resetar o formulário
    setIsDialogOpen(false);
    form.reset();
    
    // Exibir mensagem de sucesso
    toast({
      title: 'Curso adicionado',
      description: `O curso ${values.name} foi adicionado com sucesso.`,
    });
  };
  
  // Função para excluir um curso
  const deleteCourse = (id: string) => {
    const courseToDelete = courses.find(c => c.id === id);
    if (courseToDelete) {
      setCourses(courses.filter(c => c.id !== id));
      toast({
        title: 'Curso excluído',
        description: `O curso ${courseToDelete.name} foi removido.`,
        variant: 'destructive',
      });
    }
  };
  
  // Função para obter a cor do nível
  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter o texto do nível
  const getLevelText = (level: Course['level']) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return level;
    }
  };
  
  return (
    <MainLayout
      title="Cursos"
      description="Gerenciamento de cursos e programas de música."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 relative max-w-sm">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cursos..."
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
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Curso</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Curso</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Violão para Iniciantes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instrumento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um instrumento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Violão">Violão</SelectItem>
                          <SelectItem value="Piano">Piano</SelectItem>
                          <SelectItem value="Bateria">Bateria</SelectItem>
                          <SelectItem value="Guitarra">Guitarra</SelectItem>
                          <SelectItem value="Violino">Violino</SelectItem>
                          <SelectItem value="Flauta">Flauta</SelectItem>
                          <SelectItem value="Voz">Canto / Voz</SelectItem>
                          <SelectItem value="Saxofone">Saxofone</SelectItem>
                          <SelectItem value="Baixo">Baixo</SelectItem>
                          <SelectItem value="Teclado">Teclado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o curso..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 3 meses" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 450,00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Iniciante</SelectItem>
                          <SelectItem value="intermediate">Intermediário</SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Curso</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Curso</TableHead>
                <TableHead>Instrumento</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.instrument}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                        strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" 
                          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <span>{course.students}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                          strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteCourse(course.id)}
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
              {filteredCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    Nenhum curso encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
}
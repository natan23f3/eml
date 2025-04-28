import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, User, UserPlus, Calendar, GraduationCap, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Enrollment, Student, Course } from '@/types/schema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Enrollment form schema
const enrollmentSchema = z.object({
  studentId: z.number(),
  courseId: z.number(),
  status: z.string(),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export default function Registration() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch enrollments
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['/api/enrollments'],
  });

  // Fetch students for the form
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
  });

  // Fetch courses for the form
  const { data: courses } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Create enrollment form
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: undefined,
      courseId: undefined,
      status: "active",
    },
  });

  // Create enrollment mutation
  const createEnrollment = useMutation({
    mutationFn: async (values: EnrollmentFormValues) => {
      return apiRequest('POST', '/api/enrollments', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
      toast({
        title: "Matrícula criada",
        description: "A matrícula foi criada com sucesso.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar matrícula",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission
  const onSubmit = (values: EnrollmentFormValues) => {
    createEnrollment.mutate(values);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inativa</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Concluída</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Find student name by ID
  const getStudentName = (studentId: number): string => {
    if (!students) return `Aluno #${studentId}`;
    
    const student = students.find((s: Student) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Aluno #${studentId}`;
  };

  // Find course name by ID
  const getCourseName = (courseId: number): string => {
    if (!courses) return `Curso #${courseId}`;
    
    const course = courses.find((c: Course) => c.id === courseId);
    return course ? course.name : `Curso #${courseId}`;
  };

  // Filter enrollments based on search term and status filter
  const filteredEnrollments = enrollments
    ? enrollments.filter((enrollment: Enrollment) => {
        const studentName = getStudentName(enrollment.studentId).toLowerCase();
        const courseName = getCourseName(enrollment.courseId).toLowerCase();
        
        const searchMatch = studentName.includes(searchTerm.toLowerCase()) || 
          courseName.includes(searchTerm.toLowerCase());
        
        const statusMatch = statusFilter 
          ? enrollment.status === statusFilter 
          : true;
        
        return searchMatch && statusMatch;
      })
    : [];

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-heading font-bold">Matrículas</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Matrícula
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova Matrícula</DialogTitle>
              <DialogDescription>
                Crie uma nova matrícula para um aluno em um curso.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluno</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o aluno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students?.map((student: Student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.firstName} {student.lastName}
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
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o curso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses?.map((course: Course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.name} - {course.level}
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="inactive">Inativa</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end mt-4">
                  <Button type="submit" disabled={createEnrollment.isPending}>
                    {createEnrollment.isPending ? "Criando..." : "Criar Matrícula"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="active" className="mb-6">
        <TabsList>
          <TabsTrigger value="active" onClick={() => setStatusFilter('active')}>Ativas</TabsTrigger>
          <TabsTrigger value="inactive" onClick={() => setStatusFilter('inactive')}>Inativas</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setStatusFilter('completed')}>Concluídas</TabsTrigger>
          <TabsTrigger value="all" onClick={() => setStatusFilter(null)}>Todas</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Matrículas</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar matrículas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <GraduationCap className="w-10 h-10 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Nenhuma matrícula encontrada</h3>
              <p className="text-sm">Crie uma nova matrícula clicando no botão acima.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEnrollments.map((enrollment: Enrollment) => (
                <div 
                  key={enrollment.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{getStudentName(enrollment.studentId)}</h3>
                        <p className="text-sm text-gray-500">ID: {enrollment.id}</p>
                      </div>
                    </div>
                    {getStatusBadge(enrollment.status)}
                  </div>
                  
                  <div className="pl-13 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span>{getCourseName(enrollment.courseId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Matriculado em: {formatDate(enrollment.enrollmentDate.toString())}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t flex justify-end">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      Detalhes <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}

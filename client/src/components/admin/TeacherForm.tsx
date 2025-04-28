import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Schema for form validation
const teacherSchema = z.object({
  firstName: z.string().min(2, { message: 'Nome é obrigatório' }),
  lastName: z.string().min(2, { message: 'Sobrenome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
  specialization: z.string().min(2, { message: 'Especialização é obrigatória' }),
  bio: z.string().optional(),
  status: z.enum(['active', 'inactive'], { 
    required_error: 'Status é obrigatório' 
  }),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  teacherId?: number;
  isEditMode?: boolean;
  onComplete: () => void;
}

// List of possible specializations
const specializations = [
  'Violão',
  'Piano',
  'Teclado',
  'Bateria',
  'Violino',
  'Viola',
  'Violoncelo',
  'Flauta',
  'Saxofone',
  'Trompete',
  'Baixo',
  'Guitarra',
  'Ukulele',
  'Cavaquinho',
  'Canto',
  'Teoria Musical',
  'Harmonia',
  'Composição',
  'Outro',
];

export function TeacherForm({ teacherId, isEditMode = false, onComplete }: TeacherFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default form values
  const defaultValues: TeacherFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    bio: '',
    status: 'active',
  };

  // Initialize form
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues,
  });

  // Fetch teacher data if in edit mode
  const { data: teacherData, isLoading: isLoadingTeacher } = useQuery({
    queryKey: ['/api/teachers', teacherId],
    enabled: isEditMode && !!teacherId,
  });

  // Set form values when teacher data is loaded
  useEffect(() => {
    if (isEditMode && teacherData) {
      // Set each field value from the fetched data
      form.reset({
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        phone: teacherData.phone,
        specialization: teacherData.specialization,
        bio: teacherData.bio || '',
        status: teacherData.status,
      });
    }
  }, [form, isEditMode, teacherData]);

  // Create teacher mutation
  const createTeacher = useMutation({
    mutationFn: async (values: TeacherFormValues) => {
      return apiRequest('/api/teachers', {
        method: 'POST',
        data: {
          ...values,
          hireDate: new Date(),
        },
      });
    },
    onSuccess: () => {
      toast({
        title: 'Professor adicionado com sucesso!',
        description: 'O novo professor foi cadastrado no sistema.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar professor',
        description: 'Ocorreu um erro ao salvar. Tente novamente.',
        variant: 'destructive',
      });
      console.error(error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Update teacher mutation
  const updateTeacher = useMutation({
    mutationFn: async (values: TeacherFormValues) => {
      return apiRequest(`/api/teachers/${teacherId}`, {
        method: 'PATCH',
        data: values,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Professor atualizado com sucesso!',
        description: 'As informações do professor foram atualizadas.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teachers', teacherId] });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar professor',
        description: 'Ocorreu um erro ao salvar. Tente novamente.',
        variant: 'destructive',
      });
      console.error(error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: TeacherFormValues) => {
    setIsSubmitting(true);
    
    if (isEditMode) {
      updateTeacher.mutate(values);
    } else {
      createTeacher.mutate(values);
    }
  };

  if (isEditMode && isLoadingTeacher) {
    return <div className="p-4 text-center">Carregando dados do professor...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Sobrenome" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    {...field} 
                    disabled={isSubmitting} 
                  />
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
                  <Input 
                    placeholder="(XX) XXXXX-XXXX" 
                    {...field} 
                    disabled={isSubmitting}
                    onChange={(e) => {
                      // Optional: Format phone number as the user types
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialização</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma especialização" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações sobre formação, experiência..." 
                  {...field} 
                  rows={4}
                  disabled={isSubmitting} 
                />
              </FormControl>
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
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onComplete}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

// Extend the teacher schema for the form
const teacherFormSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "Telefone inválido.",
  }),
  instruments: z.array(z.string()).min(1, {
    message: "Selecione pelo menos um instrumento.",
  }),
  biography: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  hireDate: z.string().optional(),
  status: z.string({
    required_error: "Por favor selecione um status.",
  }),
  hourlyRate: z.string().min(1, {
    message: "Valor por hora é obrigatório.",
  }).transform((val) => parseFloat(val.replace(',', '.'))),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

interface TeacherFormProps {
  defaultValues?: Partial<TeacherFormValues>;
  id?: string;
}

const instrumentOptions = [
  { id: "guitar", label: "Violão" },
  { id: "piano", label: "Piano" },
  { id: "drums", label: "Bateria" },
  { id: "saxophone", label: "Saxofone" },
  { id: "violin", label: "Violino" },
];

const TeacherForm: React.FC<TeacherFormProps> = ({ defaultValues, id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: defaultValues || {
      name: '',
      email: '',
      phone: '',
      instruments: [],
      biography: '',
      address: '',
      city: '',
      state: '',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active',
      hourlyRate: '',
    },
  });
  
  const isEditing = !!id;
  
  const onSubmit = async (data: TeacherFormValues) => {
    try {
      if (isEditing) {
        await apiRequest('PUT', `/api/teachers/${id}`, data);
        toast({
          title: "Professor atualizado",
          description: "As informações do professor foram atualizadas com sucesso.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/teachers', id] });
      } else {
        await apiRequest('POST', '/api/teachers', data);
        toast({
          title: "Professor cadastrado",
          description: "O professor foi cadastrado com sucesso.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
        navigate('/teachers');
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o professor. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Professor' : 'Novo Professor'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do professor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
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
              
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor por Hora (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0,00" 
                        {...field} 
                        onChange={(e) => {
                          // Allow only numbers and one decimal point
                          const value = e.target.value.replace(/[^0-9,.]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="instruments"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Instrumentos</FormLabel>
                      <FormDescription>
                        Selecione os instrumentos que o professor ensina
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {instrumentOptions.map((instrument) => (
                        <FormField
                          key={instrument.id}
                          control={form.control}
                          name="instruments"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={instrument.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(instrument.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, instrument.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== instrument.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {instrument.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="biography"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografia</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Breve biografia e experiência do professor" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
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
                      <Input placeholder="Rua, número, bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Contratação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="on_leave">Em licença</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="flex justify-end gap-2 px-0">
              <Button type="button" variant="outline" onClick={() => navigate('/teachers')}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Cadastrar'} Professor
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TeacherForm;

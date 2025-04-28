import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

// Expense form schema
const expenseFormSchema = z.object({
  category: z.string({
    required_error: "Por favor selecione uma categoria.",
  }),
  amount: z.string().min(1, {
    message: "O valor é obrigatório.",
  }).transform((val) => parseFloat(val.replace(',', '.'))),
  date: z.string().min(1, {
    message: "A data é obrigatória.",
  }),
  description: z.string().optional(),
  payee: z.string().min(3, {
    message: "O beneficiário deve ter pelo menos 3 caracteres.",
  }),
  paymentMethod: z.string({
    required_error: "Por favor selecione um método de pagamento.",
  }),
  receiptUrl: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormValues>;
  id?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ defaultValues, id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: defaultValues || {
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      payee: '',
      paymentMethod: '',
      receiptUrl: '',
    },
  });
  
  const isEditing = !!id;
  
  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      if (isEditing) {
        await apiRequest('PUT', `/api/expenses/${id}`, data);
        toast({
          title: "Despesa atualizada",
          description: "A despesa foi atualizada com sucesso.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/expenses', id] });
      } else {
        await apiRequest('POST', '/api/expenses', data);
        toast({
          title: "Despesa registrada",
          description: "A despesa foi registrada com sucesso.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
        navigate('/expenses');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a despesa. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const categoryOptions = [
    { value: 'rent', label: 'Aluguel' },
    { value: 'utilities', label: 'Serviços Públicos (Água, Luz, etc)' },
    { value: 'salaries', label: 'Salários' },
    { value: 'equipment', label: 'Equipamentos' },
    { value: 'marketing', label: 'Marketing e Publicidade' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'supplies', label: 'Materiais e Suprimentos' },
    { value: 'taxes', label: 'Impostos e Taxas' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'travel', label: 'Viagens' },
    { value: 'other', label: 'Outros' },
  ];
  
  const paymentMethodOptions = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'bank_transfer', label: 'Transferência Bancária' },
    { value: 'pix', label: 'PIX' },
    { value: 'check', label: 'Cheque' },
    { value: 'other', label: 'Outro' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Despesa' : 'Nova Despesa'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
              
              <FormField
                control={form.control}
                name="payee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiário</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do beneficiário" {...field} />
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
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethodOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="receiptUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprovante</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="URL ou referência do comprovante" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription>
                      Opcional - referência do comprovante
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição detalhada da despesa" 
                        className="min-h-[100px]" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="flex justify-end gap-2 px-0">
              <Button type="button" variant="outline" onClick={() => navigate('/expenses')}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Registrar'} Despesa
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;

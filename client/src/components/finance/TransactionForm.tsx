import { useState } from 'react';
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
const transactionSchema = z.object({
  amount: z.string().min(1, { message: 'Valor é obrigatório' }),
  description: z.string().optional(),
  date: z.string().min(1, { message: 'Data é obrigatória' }),
  category: z.string().min(1, { message: 'Categoria é obrigatória' }),
  method: z.string().min(1, { message: 'Método de pagamento é obrigatório' }),
  status: z.string().min(1, { message: 'Status é obrigatório' }),
  studentId: z.string().optional(),
  payee: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  type: 'income' | 'expense';
  onComplete: () => void;
}

export function TransactionForm({ type, onComplete }: TransactionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get students for the dropdown if type is income
  const { data: students } = useQuery({
    queryKey: ['/api/students'],
    enabled: type === 'income',
  });

  // Income categories
  const incomeCategories = [
    { value: 'tuition', label: 'Mensalidade' },
    { value: 'enrollment', label: 'Matrícula' },
    { value: 'private_lesson', label: 'Aula Particular' },
    { value: 'material', label: 'Material Didático' },
    { value: 'event', label: 'Evento' },
    { value: 'other', label: 'Outro' },
  ];

  // Expense categories
  const expenseCategories = [
    { value: 'salary', label: 'Salário' },
    { value: 'rent', label: 'Aluguel' },
    { value: 'utilities', label: 'Serviços (Água/Luz/Internet)' },
    { value: 'equipment', label: 'Equipamentos' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'supplies', label: 'Materiais e Suprimentos' },
    { value: 'other', label: 'Outro' },
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'bank_transfer', label: 'Transferência Bancária' },
    { value: 'pix', label: 'PIX' },
    { value: 'other', label: 'Outro' },
  ];

  // Form status options
  const statusOptions = [
    { value: 'completed', label: 'Concluído' },
    { value: 'pending', label: 'Pendente' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  // Default form values
  const defaultValues = {
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    method: '',
    status: 'completed',
    studentId: '',
    payee: '',
  };

  // Initialize form
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      // Convert amount to number
      const formattedValues = {
        ...values,
        amount: parseFloat(values.amount.replace(',', '.')),
      };

      if (type === 'income') {
        return apiRequest('/api/payments', {
          method: 'POST',
          data: {
            studentId: parseInt(values.studentId || '0'),
            amount: formattedValues.amount,
            description: values.description,
            paymentDate: new Date(values.date),
            method: values.method,
            status: values.status,
          },
        });
      } else {
        return apiRequest('/api/expenses', {
          method: 'POST',
          data: {
            category: values.category,
            amount: formattedValues.amount,
            description: values.description,
            expenseDate: new Date(values.date),
            payee: values.payee || 'Não especificado',
          },
        });
      }
    },
    onSuccess: () => {
      toast({
        title: 'Transação criada com sucesso!',
        description: type === 'income' 
          ? 'Receita registrada no sistema.' 
          : 'Despesa registrada no sistema.',
      });
      
      // Invalidate queries to refresh data
      if (type === 'income') {
        queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      }
      
      onComplete();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar transação',
        description: 'Ocorreu um erro ao salvar. Tente novamente.',
        variant: 'destructive',
      });
      console.error(error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (values: TransactionFormValues) => {
    setIsSubmitting(true);
    createTransaction.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {type === 'income' && (
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
                    {students?.map((student) => (
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
        )}

        {type === 'expense' && (
          <FormField
            control={form.control}
            name="payee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiário</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Fornecedor, Funcionário..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      // Only allow numbers and comma/dot
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={`Descreva esta ${type === 'income' ? 'receita' : 'despesa'}...`} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    {(type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
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
            name="method"
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
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
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
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
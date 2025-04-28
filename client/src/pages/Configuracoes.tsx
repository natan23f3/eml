import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Schema para validação do formulário de configurações gerais
const generalSettingsSchema = z.object({
  schoolName: z.string().min(3, { message: 'O nome da escola deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Forneça um e-mail válido' }),
  phone: z.string().min(10, { message: 'Forneça um telefone válido' }),
  address: z.string().min(5, { message: 'Forneça um endereço válido' }),
  city: z.string().min(2, { message: 'Forneça uma cidade válida' }),
  state: z.string().min(2, { message: 'Forneça um estado válido' }),
  zipCode: z.string().min(8, { message: 'Forneça um CEP válido' }),
  website: z.string().url({ message: 'Forneça uma URL válida' }).optional().or(z.literal('')),
  description: z.string().optional(),
  logo: z.string().optional(),
});

// Schema para validação do formulário de configurações financeiras
const financialSettingsSchema = z.object({
  currency: z.string().min(1, { message: 'Selecione uma moeda' }),
  taxId: z.string().min(14, { message: 'Forneça um CNPJ válido' }),
  paymentDueDay: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 31, {
    message: 'Dia deve ser entre 1 e 31'
  }),
  gracePeriod: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'O período de carência deve ser um número positivo'
  }),
  lateFee: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'A multa deve ser um número positivo'
  }),
  interestRate: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'A taxa de juros deve ser um número positivo'
  }),
  acceptedPaymentMethods: z.array(z.string()).min(1, { message: 'Selecione pelo menos um método de pagamento' }),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankBranch: z.string().optional(),
  pixKey: z.string().optional(),
});

// Schema para validação do formulário de configurações de e-mail
const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, { message: 'Forneça um servidor SMTP' }),
  smtpPort: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'A porta deve ser um número positivo'
  }),
  smtpUsername: z.string().min(1, { message: 'Forneça um usuário' }),
  smtpPassword: z.string().min(1, { message: 'Forneça uma senha' }),
  fromEmail: z.string().email({ message: 'Forneça um e-mail válido' }),
  fromName: z.string().min(1, { message: 'Forneça um nome' }),
  enableSsl: z.boolean().default(true),
  enableReceipts: z.boolean().default(true),
  enableReminders: z.boolean().default(true),
  reminderDaysBefore: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'O número de dias deve ser positivo'
  }),
});

// Tipos derivados dos schemas
type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
type FinancialSettingsFormValues = z.infer<typeof financialSettingsSchema>;
type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('geral');
  const { toast } = useToast();
  
  // Configuração do formulário para configurações gerais
  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      schoolName: 'Escola de Música Harmonia',
      email: 'contato@harmoniamusica.com.br',
      phone: '(11) 3456-7890',
      address: 'Rua das Notas, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      website: 'https://www.harmoniamusica.com.br',
      description: 'Escola de música especializada em diversos instrumentos, com foco em qualidade de ensino e desenvolvimento artístico.',
      logo: '/uploads/logo.png',
    },
  });
  
  // Configuração do formulário para configurações financeiras
  const financialForm = useForm<FinancialSettingsFormValues>({
    resolver: zodResolver(financialSettingsSchema),
    defaultValues: {
      currency: 'BRL',
      taxId: '12.345.678/0001-90',
      paymentDueDay: '10',
      gracePeriod: '5',
      lateFee: '2',
      interestRate: '1',
      acceptedPaymentMethods: ['pix', 'creditCard', 'bankTransfer', 'cash'],
      bankName: 'Banco do Brasil',
      bankAccount: '12345-6',
      bankBranch: '1234',
      pixKey: 'contato@harmoniamusica.com.br',
    },
  });
  
  // Configuração do formulário para configurações de e-mail
  const emailForm = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: 'smtp.harmoniamusica.com.br',
      smtpPort: '587',
      smtpUsername: 'no-reply@harmoniamusica.com.br',
      smtpPassword: '******',
      fromEmail: 'no-reply@harmoniamusica.com.br',
      fromName: 'Escola de Música Harmonia',
      enableSsl: true,
      enableReceipts: true,
      enableReminders: true,
      reminderDaysBefore: '3',
    },
  });
  
  // Função para enviar formulário de configurações gerais
  const onGeneralSubmit = (values: GeneralSettingsFormValues) => {
    console.log('Configurações Gerais:', values);
    
    // Em uma implementação real, enviaríamos para o backend
    // Por enquanto, apenas simulamos o sucesso
    
    toast({
      title: 'Configurações atualizadas',
      description: 'As configurações gerais foram salvas com sucesso.',
    });
  };
  
  // Função para enviar formulário de configurações financeiras
  const onFinancialSubmit = (values: FinancialSettingsFormValues) => {
    console.log('Configurações Financeiras:', values);
    
    toast({
      title: 'Configurações atualizadas',
      description: 'As configurações financeiras foram salvas com sucesso.',
    });
  };
  
  // Função para enviar formulário de configurações de e-mail
  const onEmailSubmit = (values: EmailSettingsFormValues) => {
    console.log('Configurações de E-mail:', values);
    
    toast({
      title: 'Configurações atualizadas',
      description: 'As configurações de e-mail foram salvas com sucesso.',
    });
  };
  
  // Função para enviar e-mail de teste
  const sendTestEmail = () => {
    // Em uma implementação real, enviaríamos um e-mail de teste
    
    toast({
      title: 'E-mail de teste enviado',
      description: 'Um e-mail de teste foi enviado para o endereço configurado.',
    });
  };
  
  return (
    <MainLayout
      title="Configurações"
      description="Configurações e personalização do sistema."
    >
      <Tabs defaultValue="geral" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="geral">Gerais</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiras</TabsTrigger>
          <TabsTrigger value="email">E-mail</TabsTrigger>
        </TabsList>
        
        {/* Configurações Gerais */}
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua escola de música.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Escola</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={generalForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva sua escola de música..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4">
                    <FormLabel>Logo</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="h-24 w-24 bg-gray-100 border rounded-md flex items-center justify-center overflow-hidden">
                        {generalForm.getValues('logo') ? (
                          <img 
                            src={generalForm.getValues('logo')}
                            alt="Logo" 
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <Input type="file" className="mb-2" />
                        <p className="text-xs text-gray-500">
                          Formatos aceitos: JPG, PNG. Tamanho máximo: 1MB.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Salvar Configurações</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Configurações Financeiras */}
        <TabsContent value="financeiro">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>
                Configure as opções financeiras e de pagamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...financialForm}>
                <form onSubmit={financialForm.handleSubmit(onFinancialSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={financialForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Moeda</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma moeda" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BRL">Real (R$)</SelectItem>
                              <SelectItem value="USD">Dólar (US$)</SelectItem>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium mb-4">Configurações de Pagamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={financialForm.control}
                      name="paymentDueDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dia de Vencimento</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="31" {...field} />
                          </FormControl>
                          <FormDescription>
                            Dia do mês para vencimento das mensalidades
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="gracePeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Período de Carência (dias)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Dias adicionais sem multa após o vencimento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="lateFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Multa por Atraso (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Percentual de multa por atraso no pagamento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <FormField
                      control={financialForm.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Juros ao Mês (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Percentual de juros ao mês para pagamentos em atraso
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <FormField
                    control={financialForm.control}
                    name="acceptedPaymentMethods"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Métodos de Pagamento Aceitos</FormLabel>
                          <FormDescription>
                            Selecione todos os métodos de pagamento que sua escola aceita
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                          <FormField
                            control={financialForm.control}
                            name="acceptedPaymentMethods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes('pix')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, 'pix'])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== 'pix'
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Pix
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                          
                          <FormField
                            control={financialForm.control}
                            name="acceptedPaymentMethods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes('creditCard')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, 'creditCard'])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== 'creditCard'
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Cartão de Crédito
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                          
                          <FormField
                            control={financialForm.control}
                            name="acceptedPaymentMethods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes('debitCard')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, 'debitCard'])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== 'debitCard'
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Cartão de Débito
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                          
                          <FormField
                            control={financialForm.control}
                            name="acceptedPaymentMethods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes('bankTransfer')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, 'bankTransfer'])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== 'bankTransfer'
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Transferência Bancária
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                          
                          <FormField
                            control={financialForm.control}
                            name="acceptedPaymentMethods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes('bankSlip')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, 'bankSlip'])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== 'bankSlip'
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Boleto Bancário
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                          
                          <FormField
                            control={financialForm.control}
                            name="acceptedPaymentMethods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes('cash')}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, 'cash'])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== 'cash'
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Dinheiro
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium mb-4">Dados Bancários</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={financialForm.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banco</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="bankBranch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agência</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={financialForm.control}
                      name="bankAccount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conta</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="pixKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave Pix</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Salvar Configurações</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Configurações de E-mail */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de E-mail</CardTitle>
              <CardDescription>
                Configure o envio de e-mails automáticos e notificações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Servidor SMTP</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Servidor SMTP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porta</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="65535" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={emailForm.control}
                    name="enableSsl"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Usar SSL/TLS
                          </FormLabel>
                          <FormDescription>
                            Habilitar conexão segura com o servidor de e-mail
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium mb-4">Configurações de Envio</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail de Envio</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Endereço que aparecerá como remetente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome de Exibição</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Nome que aparecerá como remetente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium mb-4">Notificações</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="enableReceipts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Recibos Automáticos
                            </FormLabel>
                            <FormDescription>
                              Enviar e-mails de confirmação quando pagamentos forem processados
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="enableReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Lembretes de Pagamento
                            </FormLabel>
                            <FormDescription>
                              Enviar lembretes de pagamentos próximos do vencimento
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {emailForm.watch('enableReminders') && (
                      <div className="ml-7 mt-2">
                        <FormField
                          control={emailForm.control}
                          name="reminderDaysBefore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dias de Antecedência</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="30" 
                                  className="w-24"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Quantos dias antes do vencimento enviar o lembrete
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-8">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="order-2 sm:order-1"
                      onClick={sendTestEmail}
                    >
                      Enviar E-mail de Teste
                    </Button>
                    <Button type="submit" className="order-1 sm:order-2">
                      Salvar Configurações
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
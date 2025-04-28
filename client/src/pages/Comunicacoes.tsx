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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para comunicação
type Communication = {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'notice' | 'reminder' | 'alert';
  priority: 'high' | 'medium' | 'low';
  recipients: string[]; // Pode ser 'all', 'students', 'teachers', ou IDs específicos
  sentBy: string;
  sentDate: string;
  status: 'sent' | 'draft' | 'scheduled';
  scheduledDate?: string;
  read: number;
  unread: number;
};

// Tipo para destinatário
type Recipient = {
  id: string;
  name: string;
  type: 'student' | 'teacher' | 'group';
};

// Schema para validação do formulário
const communicationSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' }),
  type: z.string().min(1, { message: 'Selecione um tipo de comunicação' }),
  priority: z.string().min(1, { message: 'Selecione uma prioridade' }),
  recipients: z.array(z.string()).min(1, { message: 'Selecione pelo menos um destinatário' }),
  status: z.string().min(1, { message: 'Selecione um status' }),
  scheduledDate: z.string().optional(),
});

type CommunicationFormValues = z.infer<typeof communicationSchema>;

export default function Comunicacoes() {
  const [activeTab, setActiveTab] = useState('enviados');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Dados de exemplo para destinatários
  const recipients: Recipient[] = [
    { id: 'all', name: 'Todos', type: 'group' },
    { id: 'students', name: 'Todos os Alunos', type: 'group' },
    { id: 'teachers', name: 'Todos os Professores', type: 'group' },
    { id: 'student-1', name: 'Maria Silva', type: 'student' },
    { id: 'student-2', name: 'João Oliveira', type: 'student' },
    { id: 'student-3', name: 'Ana Souza', type: 'student' },
    { id: 'teacher-1', name: 'Roberto Almeida', type: 'teacher' },
    { id: 'teacher-2', name: 'Carla Ferreira', type: 'teacher' },
  ];
  
  // Dados de exemplo para comunicações
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: '1',
      title: 'Recesso de Férias',
      message: 'Informamos que a escola estará fechada para recesso de férias entre os dias 15/07 e 30/07. As aulas serão retomadas normalmente a partir do dia 31/07.',
      type: 'announcement',
      priority: 'high',
      recipients: ['all'],
      sentBy: 'Direção',
      sentDate: '2023-06-30T10:00:00.000Z',
      status: 'sent',
      read: 45,
      unread: 12
    },
    {
      id: '2',
      title: 'Alteração de Horário - Aulas de Piano',
      message: 'Informamos que as aulas de piano do professor Roberto Almeida serão transferidas de terça para quinta-feira a partir da próxima semana.',
      type: 'notice',
      priority: 'medium',
      recipients: ['students'],
      sentBy: 'Coordenação',
      sentDate: '2023-07-01T14:30:00.000Z',
      status: 'sent',
      read: 18,
      unread: 5
    },
    {
      id: '3',
      title: 'Lembrete: Apresentação de Fim de Semestre',
      message: 'Lembramos que a apresentação de fim de semestre será realizada no dia 10/07 às 19h no auditório central. Todos os alunos devem chegar com 1 hora de antecedência.',
      type: 'reminder',
      priority: 'medium',
      recipients: ['students', 'teachers'],
      sentBy: 'Coordenação',
      sentDate: '2023-07-03T09:15:00.000Z',
      status: 'sent',
      read: 32,
      unread: 20
    },
    {
      id: '4',
      title: 'Manutenção no Sistema',
      message: 'O sistema de matrículas estará em manutenção no dia 05/07 das 22h às 06h. Pedimos desculpas pelo inconveniente.',
      type: 'alert',
      priority: 'low',
      recipients: ['all'],
      sentBy: 'Suporte Técnico',
      sentDate: '2023-07-04T17:00:00.000Z',
      status: 'sent',
      read: 8,
      unread: 49
    },
    {
      id: '5',
      title: 'Reunião Pedagógica',
      message: 'Convocamos todos os professores para reunião pedagógica no dia 07/07 às 14h na sala de reuniões.',
      type: 'notice',
      priority: 'high',
      recipients: ['teachers'],
      sentBy: 'Direção',
      sentDate: '',
      status: 'draft',
      read: 0,
      unread: 0
    },
    {
      id: '6',
      title: 'Novas Turmas de Violão',
      message: 'Informamos que serão abertas novas turmas de violão iniciante no próximo mês. As inscrições já estão abertas.',
      type: 'announcement',
      priority: 'medium',
      recipients: ['all'],
      sentBy: 'Coordenação',
      sentDate: '',
      status: 'scheduled',
      scheduledDate: '2023-07-10T09:00:00.000Z',
      read: 0,
      unread: 0
    }
  ]);
  
  // Configuração do formulário
  const form = useForm<CommunicationFormValues>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: '',
      priority: '',
      recipients: [],
      status: 'sent',
      scheduledDate: '',
    },
  });
  
  // Filtrar comunicações com base na aba ativa e no termo de pesquisa
  const filteredCommunications = communications
    .filter(comm => {
      if (activeTab === 'enviados') return comm.status === 'sent';
      if (activeTab === 'rascunhos') return comm.status === 'draft';
      if (activeTab === 'agendados') return comm.status === 'scheduled';
      return true;
    })
    .filter(comm => {
      if (!searchTerm) return true;
      
      return (
        comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.sentBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
  // Função para obter a cor do tipo
  const getTypeColor = (type: Communication['type']) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800';
      case 'notice':
        return 'bg-purple-100 text-purple-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter o texto do tipo
  const getTypeText = (type: Communication['type']) => {
    switch (type) {
      case 'announcement':
        return 'Comunicado';
      case 'notice':
        return 'Aviso';
      case 'reminder':
        return 'Lembrete';
      case 'alert':
        return 'Alerta';
      default:
        return type;
    }
  };
  
  // Função para obter a cor da prioridade
  const getPriorityColor = (priority: Communication['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter o texto da prioridade
  const getPriorityText = (priority: Communication['priority']) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };
  
  // Função para obter texto de destinatários
  const getRecipientsText = (recipientIds: string[]) => {
    if (recipientIds.includes('all')) {
      return 'Todos';
    }
    
    const recipientNames = recipientIds.map(id => {
      const recipient = recipients.find(r => r.id === id);
      return recipient ? recipient.name : id;
    });
    
    if (recipientNames.length <= 2) {
      return recipientNames.join(', ');
    }
    
    return `${recipientNames[0]}, ${recipientNames[1]} +${recipientNames.length - 2}`;
  };
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };
  
  // Função para enviar o formulário
  const onSubmit = (values: CommunicationFormValues) => {
    // Criar a nova comunicação
    const newCommunication: Communication = {
      id: (communications.length + 1).toString(),
      title: values.title,
      message: values.message,
      type: values.type as Communication['type'],
      priority: values.priority as Communication['priority'],
      recipients: values.recipients,
      sentBy: 'Usuário Atual',
      sentDate: values.status === 'sent' ? new Date().toISOString() : '',
      status: values.status as Communication['status'],
      scheduledDate: values.scheduledDate,
      read: 0,
      unread: values.recipients.includes('all') ? 57 : 
              values.recipients.includes('students') ? 37 :
              values.recipients.includes('teachers') ? 10 : 
              values.recipients.length
    };
    
    // Adicionar a nova comunicação à lista
    setCommunications([...communications, newCommunication]);
    
    // Fechar o diálogo e resetar o formulário
    setIsDialogOpen(false);
    form.reset();
    setSelectedRecipients([]);
    
    // Mostrar mensagem de sucesso
    const actionText = values.status === 'sent' ? 'enviada' : 
                      values.status === 'draft' ? 'salva como rascunho' : 'agendada';
    
    toast({
      title: 'Comunicação ' + actionText,
      description: `A comunicação "${values.title}" foi ${actionText} com sucesso.`,
    });
  };
  
  return (
    <MainLayout
      title="Comunicações"
      description="Gerenciamento de comunicações da escola de música."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 relative max-w-sm">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar comunicações..."
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
              Nova Comunicação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Comunicação</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título da comunicação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite o conteúdo da mensagem..." 
                          className="min-h-[120px]"
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="announcement">Comunicado</SelectItem>
                            <SelectItem value="notice">Aviso</SelectItem>
                            <SelectItem value="reminder">Lembrete</SelectItem>
                            <SelectItem value="alert">Alerta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="recipients"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Destinatários</FormLabel>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto border rounded-md p-4">
                        {recipients.map((recipient) => (
                          <FormField
                            key={recipient.id}
                            control={form.control}
                            name="recipients"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={recipient.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(recipient.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, recipient.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== recipient.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {recipient.name}
                                    {recipient.type !== 'group' && (
                                      <span className="ml-2 text-xs text-gray-500">
                                        ({recipient.type === 'student' ? 'Aluno' : 'Professor'})
                                      </span>
                                    )}
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
                          <SelectItem value="sent">Enviar agora</SelectItem>
                          <SelectItem value="draft">Salvar como rascunho</SelectItem>
                          <SelectItem value="scheduled">Agendar envio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('status') === 'scheduled' && (
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Envio</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {form.watch('status') === 'sent' ? 'Enviar' : 
                     form.watch('status') === 'draft' ? 'Salvar Rascunho' : 'Agendar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Comunicações</CardTitle>
          
          <Tabs defaultValue="enviados" className="mt-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="enviados">Enviados</TabsTrigger>
              <TabsTrigger value="rascunhos">Rascunhos</TabsTrigger>
              <TabsTrigger value="agendados">Agendados</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Destinatários</TableHead>
                  <TableHead>Enviado por</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommunications.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell className="font-medium">{comm.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(comm.type)}`}>
                        {getTypeText(comm.type)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(comm.priority)}`}>
                        {getPriorityText(comm.priority)}
                      </span>
                    </TableCell>
                    <TableCell>{getRecipientsText(comm.recipients)}</TableCell>
                    <TableCell>{comm.sentBy}</TableCell>
                    <TableCell>
                      {comm.status === 'sent' ? formatDate(comm.sentDate) : 
                       comm.status === 'scheduled' ? formatDate(comm.scheduledDate || '') : '-'}
                    </TableCell>
                    <TableCell>
                      {comm.status === 'sent' && (
                        <div className="flex items-center space-x-1 text-sm">
                          <span className="text-green-500 font-medium">{comm.read}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-red-500 font-medium">{comm.unread}</span>
                        </div>
                      )}
                      {comm.status === 'draft' && (
                        <span className="text-gray-500">Rascunho</span>
                      )}
                      {comm.status === 'scheduled' && (
                        <span className="text-blue-500">Agendado</span>
                      )}
                    </TableCell>
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
                        {(comm.status === 'draft' || comm.status === 'scheduled') && (
                          <Button variant="outline" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                              strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" 
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCommunications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      Nenhuma comunicação encontrada
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
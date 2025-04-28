import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Users, Send, Check, CalendarClock, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const massCommunicationSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  templateId: z.string().min(1, { message: 'Selecione um template' }),
  recipientType: z.enum(['all', 'course', 'status', 'custom']),
  courseFilter: z.string().optional(),
  statusFilter: z.string().optional(),
  customRecipients: z.array(z.string()).optional(),
  scheduledDate: z.string().optional(),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' }),
  includeVariables: z.boolean().default(true),
});

type MassCommunicationFormValues = z.infer<typeof massCommunicationSchema>;

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: 'active' | 'inactive' | 'pending';
};

type Template = {
  id: string;
  name: string;
  type: string;
  content: string;
};

export default function WhatsAppMassCommunication() {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Maria Silva', email: 'maria@email.com', phone: '5511987654321', course: 'Violão', status: 'active' },
    { id: '2', name: 'João Oliveira', email: 'joao@email.com', phone: '5511912345678', course: 'Piano', status: 'active' },
    { id: '3', name: 'Ana Souza', email: 'ana@email.com', phone: '5511998765432', course: 'Canto', status: 'inactive' },
    { id: '4', name: 'Pedro Santos', email: 'pedro@email.com', phone: '5511956781234', course: 'Bateria', status: 'active' },
    { id: '5', name: 'Luiza Costa', email: 'luiza@email.com', phone: '5511943218765', course: 'Violino', status: 'pending' },
    { id: '6', name: 'Carlos Mendes', email: 'carlos@email.com', phone: '5511977778888', course: 'Violão', status: 'active' },
    { id: '7', name: 'Juliana Alves', email: 'juliana@email.com', phone: '5511966665555', course: 'Piano', status: 'pending' },
    { id: '8', name: 'Ricardo Pereira', email: 'ricardo@email.com', phone: '5511955554444', course: 'Violino', status: 'active' },
  ]);
  
  const [templates, setTemplates] = useState<Template[]>([
    { id: '1', name: 'Lembrete de Aula Padrão', type: 'class_reminder', content: 'Olá {nome}, não esqueça da sua aula de {curso} amanhã às {horario}. Atenciosamente, Escola de Música.' },
    { id: '2', name: 'Lembrete de Pagamento', type: 'payment_reminder', content: 'Olá {nome}, o pagamento da sua mensalidade no valor de R$ {valor} vence em {dias_restantes} dias. Atenciosamente, Escola de Música.' },
    { id: '3', name: 'Comunicado Importante', type: 'announcement', content: 'Olá {nome}, informamos que {mensagem}. Para mais informações, entre em contato conosco. Atenciosamente, Escola de Música.' },
    { id: '4', name: 'Promoção Especial', type: 'marketing', content: 'Olá {nome}! Temos uma oferta especial para você: {oferta}. Válido até {data_validade}. Atenciosamente, Escola de Música.' },
  ]);
  
  const [isSending, setIsSending] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [sentProgress, setSentProgress] = useState(0);
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'completed' | 'error'>('idle');
  const [sentResults, setSentResults] = useState<{success: number, failed: number, total: number}>({
    success: 0,
    failed: 0,
    total: 0
  });
  
  const form = useForm<MassCommunicationFormValues>({
    resolver: zodResolver(massCommunicationSchema),
    defaultValues: {
      title: '',
      templateId: '',
      recipientType: 'all',
      includeVariables: true,
      message: ''
    },
  });
  
  const watchRecipientType = form.watch('recipientType');
  const watchTemplateId = form.watch('templateId');
  const watchMessage = form.watch('message');
  
  // Update message when template changes
  const onTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      form.setValue('message', template.content);
    }
  };
  
  // Filter students based on selection criteria
  const updateFilteredStudents = () => {
    const recipientType = form.getValues('recipientType');
    let filtered = [...students];
    
    if (recipientType === 'course') {
      const courseFilter = form.getValues('courseFilter');
      if (courseFilter) {
        filtered = filtered.filter(student => student.course === courseFilter);
      }
    } else if (recipientType === 'status') {
      const statusFilter = form.getValues('statusFilter');
      if (statusFilter) {
        filtered = filtered.filter(student => student.status === statusFilter);
      }
    } else if (recipientType === 'custom') {
      const customRecipients = form.getValues('customRecipients') || [];
      filtered = filtered.filter(student => customRecipients.includes(student.id));
    }
    
    setFilteredStudents(filtered);
    return filtered;
  };
  
  const handlePreview = () => {
    updateFilteredStudents();
    setIsPreviewMode(true);
  };
  
  const cancelPreview = () => {
    setIsPreviewMode(false);
  };
  
  // Format message with student data
  const formatMessageForStudent = (message: string, student: Student) => {
    let formattedMessage = message;
    
    // Replace variables with actual values
    formattedMessage = formattedMessage.replace(/{nome}/g, student.name);
    formattedMessage = formattedMessage.replace(/{curso}/g, student.course);
    
    // Add more replacements as needed
    formattedMessage = formattedMessage.replace(/{horario}/g, '14:00'); // Example value
    formattedMessage = formattedMessage.replace(/{valor}/g, '150,00'); // Example value
    formattedMessage = formattedMessage.replace(/{dias_restantes}/g, '5'); // Example value
    formattedMessage = formattedMessage.replace(/{mensagem}/g, form.getValues('title')); // Use title as message
    formattedMessage = formattedMessage.replace(/{oferta}/g, '20% de desconto em seu próximo mês'); // Example value
    formattedMessage = formattedMessage.replace(/{data_validade}/g, '30/05/2023'); // Example value
    
    return formattedMessage;
  };
  
  // Simulate sending message via WhatsApp API
  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    console.log(`Enviando mensagem para ${phoneNumber}: ${message}`);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would make a request to the WhatsApp Business API
      // const response = await fetch('/api/student-interactions/send-whatsapp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     phoneNumber, 
      //     message,
      //     templateName: selectedTemplate?.type 
      //   })
      // });
      // return await response.json();
      
      // Return simulated response
      return { success: Math.random() > 0.1 }; // 90% success rate
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return { success: false };
    }
  };
  
  const onSubmit = async (values: MassCommunicationFormValues) => {
    setIsSending(true);
    setSendingStatus('sending');
    
    const recipients = updateFilteredStudents();
    let successCount = 0;
    let failedCount = 0;
    
    setSentResults({
      success: 0,
      failed: 0,
      total: recipients.length
    });
    
    for (let i = 0; i < recipients.length; i++) {
      const student = recipients[i];
      let messageToSend = values.message;
      
      // Replace variables if enabled
      if (values.includeVariables) {
        messageToSend = formatMessageForStudent(messageToSend, student);
      }
      
      // Send message via WhatsApp API
      const result = await sendWhatsAppMessage(student.phone, messageToSend);
      
      if (result.success) {
        successCount++;
      } else {
        failedCount++;
      }
      
      // Update progress
      const progress = Math.round(((i + 1) / recipients.length) * 100);
      setSentProgress(progress);
      setSentResults({
        success: successCount,
        failed: failedCount,
        total: recipients.length
      });
      
      // Small delay to simulate real-world sending
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsSending(false);
    setSendingStatus('completed');
  };
  
  // List of available courses (extracted from students)
  const coursesSet = new Set(students.map(s => s.course));
  const courses = Array.from(coursesSet);
  
  // If in preview mode, show preview screen
  if (isPreviewMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Pré-visualização do Envio
          </CardTitle>
          <CardDescription>
            Confirme os detalhes antes de enviar as mensagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Detalhes do Envio</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Título:</span>
                  <p className="text-sm text-muted-foreground">{form.getValues('title')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Template Usado:</span>
                  <p className="text-sm text-muted-foreground">{selectedTemplate?.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Tipo de Destinatários:</span>
                  <p className="text-sm text-muted-foreground">
                    {watchRecipientType === 'all' && 'Todos os alunos'}
                    {watchRecipientType === 'course' && `Alunos do curso: ${form.getValues('courseFilter')}`}
                    {watchRecipientType === 'status' && `Alunos com status: ${form.getValues('statusFilter')}`}
                    {watchRecipientType === 'custom' && 'Alunos selecionados manualmente'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Total de Destinatários:</span>
                  <p className="text-sm text-muted-foreground">{filteredStudents.length} alunos</p>
                </div>
                {form.getValues('scheduledDate') && (
                  <div>
                    <span className="text-sm font-medium">Data Agendada:</span>
                    <p className="text-sm text-muted-foreground">
                      {form.getValues('scheduledDate') 
                        ? new Date(form.getValues('scheduledDate') as string).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Envio imediato'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Exemplo de Mensagem</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <p className="whitespace-pre-wrap">
                  {filteredStudents.length > 0 
                    ? formatMessageForStudent(watchMessage, filteredStudents[0])
                    : watchMessage
                  }
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Lista de Destinatários ({filteredStudents.length})</h3>
              <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          Nenhum destinatário encontrado com os filtros selecionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.phone}</TableCell>
                          <TableCell>{student.course}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                student.status === 'active' ? "bg-green-100 text-green-800" :
                                student.status === 'inactive' ? "bg-red-100 text-red-800" :
                                "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {student.status === 'active' ? "Ativo" : 
                               student.status === 'inactive' ? "Inativo" : "Pendente"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" onClick={cancelPreview}>
            Voltar e Editar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={filteredStudents.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            Enviar para {filteredStudents.length} alunos
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // If currently sending, show progress screen
  if (sendingStatus === 'sending' || sendingStatus === 'completed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {sendingStatus === 'sending' ? (
              <>
                <Send className="h-5 w-5 animate-pulse" />
                Enviando Mensagens
              </>
            ) : (
              <>
                <Check className="h-5 w-5 text-green-600" />
                Envio Concluído
              </>
            )}
          </CardTitle>
          <CardDescription>
            {sendingStatus === 'sending' 
              ? 'Enviando mensagens via WhatsApp...'
              : 'Todas as mensagens foram processadas'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Progress value={sentProgress} className="h-2 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processando: {sentResults.success + sentResults.failed} de {sentResults.total}</span>
                <span>{sentProgress}% concluído</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Enviadas com Sucesso
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <span className="text-2xl font-bold text-green-700">{sentResults.success}</span>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50 border-red-200">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Falhas no Envio
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <span className="text-2xl font-bold text-red-700">{sentResults.failed}</span>
                </CardContent>
              </Card>
            </div>
            
            {sendingStatus === 'sending' && (
              <div className="text-center text-sm text-muted-foreground animate-pulse">
                Por favor, aguarde enquanto as mensagens são enviadas...
              </div>
            )}
            
            {sendingStatus === 'completed' && (
              <Alert className={
                sentResults.failed === 0 
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-yellow-50 border-yellow-200 text-yellow-800"
              }>
                <AlertTitle>
                  {sentResults.failed === 0 
                    ? "Envio concluído com sucesso!" 
                    : "Envio concluído com alguns problemas"}
                </AlertTitle>
                <AlertDescription>
                  {sentResults.failed === 0 
                    ? `Todas as ${sentResults.total} mensagens foram enviadas com sucesso.`
                    : `${sentResults.success} mensagens enviadas com sucesso e ${sentResults.failed} falhas.`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          {sendingStatus === 'completed' && (
            <Button 
              onClick={() => {
                setSendingStatus('idle');
                form.reset();
              }}
            >
              Novo Envio
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  // Standard form view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Envio em Massa via WhatsApp
        </CardTitle>
        <CardDescription>
          Envie mensagens para grupos de alunos via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePreview)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Comunicado</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Início das aulas de verão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template de Mensagem</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        onTemplateChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
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
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite a mensagem a ser enviada..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Use variáveis como {"{nome}"}, {"{curso}"}, etc. para personalizar a mensagem.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includeVariables"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Substituir variáveis</FormLabel>
                      <FormDescription>
                        Substituir automaticamente {"{nome}"}, {"{curso}"} e outras variáveis pelos dados dos alunos.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Destinatários</h3>
              
              <FormField
                control={form.control}
                name="recipientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Para quem enviar?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Todos os alunos ({students.length})
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="course" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Alunos de um curso específico
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="status" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Alunos com um status específico
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="custom" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Seleção personalizada
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {watchRecipientType === 'course' && (
                <FormField
                  control={form.control}
                  name="courseFilter"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Selecione o Curso</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um curso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course} ({students.filter(s => s.course === course).length} alunos)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {watchRecipientType === 'status' && (
                <FormField
                  control={form.control}
                  name="statusFilter"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Selecione o Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">
                            Ativo ({students.filter(s => s.status === 'active').length})
                          </SelectItem>
                          <SelectItem value="inactive">
                            Inativo ({students.filter(s => s.status === 'inactive').length})
                          </SelectItem>
                          <SelectItem value="pending">
                            Pendente ({students.filter(s => s.status === 'pending').length})
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {watchRecipientType === 'custom' && (
                <div className="mt-4 border rounded-md max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue('customRecipients', students.map(s => s.id));
                              } else {
                                form.setValue('customRecipients', []);
                              }
                            }} 
                          />
                        </TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox 
                              checked={form.watch('customRecipients')?.includes(student.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = form.watch('customRecipients') || [];
                                
                                if (checked) {
                                  form.setValue('customRecipients', [...currentValues, student.id]);
                                } else {
                                  form.setValue('customRecipients', 
                                    currentValues.filter(id => id !== student.id)
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.course}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                student.status === 'active' ? "bg-green-100 text-green-800" :
                                student.status === 'inactive' ? "bg-red-100 text-red-800" :
                                "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {student.status === 'active' ? "Ativo" : 
                               student.status === 'inactive' ? "Inativo" : "Pendente"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Agendamento (Opcional)</h3>
              
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora de Envio</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Deixe em branco para enviar imediatamente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full mt-6">
              <CalendarClock className="h-4 w-4 mr-2" />
              Pré-visualizar e Enviar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
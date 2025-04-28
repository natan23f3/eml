import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Send, CalendarClock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const reminderSchema = z.object({
  studentId: z.string().min(1, { message: 'Selecione um aluno' }),
  templateId: z.string().min(1, { message: 'Selecione um template' }),
  phoneNumber: z.string().min(10, { message: 'Telefone inválido' }),
  scheduledDate: z.string().optional(),
  customMessage: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

const autoConfigSchema = z.object({
  type: z.enum(['class_reminder', 'payment_reminder']),
  daysBefore: z.string().transform(value => parseInt(value)),
  templateId: z.string().min(1, { message: 'Selecione um template' }),
});

type AutoConfigFormValues = z.infer<typeof autoConfigSchema>;

export default function WhatsAppReminder() {
  const [students, setStudents] = useState([
    { id: '1', name: 'Maria Silva', phone: '5511987654321' },
    { id: '2', name: 'João Oliveira', phone: '5511912345678' },
    { id: '3', name: 'Ana Souza', phone: '5511998765432' },
    { id: '4', name: 'Pedro Santos', phone: '5511956781234' },
    { id: '5', name: 'Luiza Costa', phone: '5511943218765' },
  ]);
  
  const [templates, setTemplates] = useState([
    { id: '1', name: 'Lembrete de Aula Padrão', type: 'class_reminder' },
    { id: '2', name: 'Lembrete de Pagamento', type: 'payment_reminder' },
    { id: '3', name: 'Confirmação de Pagamento', type: 'payment_confirmation' },
  ]);
  
  const [isSending, setIsSending] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const reminderForm = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      studentId: '',
      templateId: '',
      phoneNumber: '',
      scheduledDate: '',
      customMessage: '',
    },
  });
  
  const autoConfigForm = useForm<AutoConfigFormValues>({
    resolver: zodResolver(autoConfigSchema),
    defaultValues: {
      type: 'class_reminder',
      daysBefore: '1',
      templateId: '',
    },
  });
  
  // Quando seleciona um aluno, preenche o telefone automaticamente
  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      reminderForm.setValue('phoneNumber', student.phone);
    }
  };
  
  const onReminderSubmit = async (values: ReminderFormValues) => {
    setIsSending(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simular envio de lembrete via API
      console.log('Enviando lembrete:', values);
      
      // Aqui seria feito o fetch real para a API
      // const response = await fetch('/api/student-interactions/class-reminder', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     studentId: values.studentId,
      //     message: values.customMessage || 'Mensagem padrão do template',
      //     scheduledDate: values.scheduledDate,
      //     phoneNumber: values.phoneNumber,
      //   }),
      // });
      
      // Simular sucesso após um breve intervalo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Lembrete enviado com sucesso via WhatsApp!');
      reminderForm.reset();
    } catch (err) {
      console.error('Erro ao enviar lembrete:', err);
      setError('Não foi possível enviar o lembrete. Por favor, tente novamente.');
    } finally {
      setIsSending(false);
    }
  };
  
  const onAutoConfigSubmit = async (values: AutoConfigFormValues) => {
    setIsConfiguring(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simular configuração de lembretes automáticos
      console.log('Configurando lembretes automáticos:', values);
      
      // Aqui seria feito o fetch real para a API
      // const response = await fetch('/api/student-interactions/auto-reminders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(values),
      // });
      
      // Simular sucesso após um breve intervalo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Configuração de lembretes automáticos salva com sucesso!');
    } catch (err) {
      console.error('Erro ao configurar lembretes automáticos:', err);
      setError('Não foi possível salvar a configuração. Por favor, tente novamente.');
    } finally {
      setIsConfiguring(false);
    }
  };
  
  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="manual">Envio Manual</TabsTrigger>
        <TabsTrigger value="automatic">Configurações Automáticas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="manual">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send size={20} />
              Enviar Lembrete via WhatsApp
            </CardTitle>
            <CardDescription>
              Envie lembretes de aula ou pagamento para os alunos via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <Form {...reminderForm}>
              <form onSubmit={reminderForm.handleSubmit(onReminderSubmit)} className="space-y-4">
                <FormField
                  control={reminderForm.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluno</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleStudentChange(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={reminderForm.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  control={reminderForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input placeholder="551199999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={reminderForm.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Envio (opcional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={reminderForm.control}
                  name="customMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem Personalizada (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Mensagem personalizada..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isSending}
                >
                  {isSending ? 'Enviando...' : 'Enviar Lembrete via WhatsApp'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="automatic">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock size={20} />
              Lembretes Automáticos
            </CardTitle>
            <CardDescription>
              Configure lembretes para serem enviados automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <Form {...autoConfigForm}>
              <form onSubmit={autoConfigForm.handleSubmit(onAutoConfigSubmit)} className="space-y-4">
                <FormField
                  control={autoConfigForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Lembrete</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="class_reminder">Lembrete de Aula</SelectItem>
                          <SelectItem value="payment_reminder">Lembrete de Pagamento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={autoConfigForm.control}
                  name="daysBefore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias de Antecedência</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione os dias" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 dia antes</SelectItem>
                          <SelectItem value="2">2 dias antes</SelectItem>
                          <SelectItem value="3">3 dias antes</SelectItem>
                          <SelectItem value="5">5 dias antes</SelectItem>
                          <SelectItem value="7">7 dias antes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={autoConfigForm.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template a Utilizar</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                
                <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
                  <AlertTitle>Informações</AlertTitle>
                  <AlertDescription>
                    Com esta configuração, os lembretes serão enviados automaticamente para todos os alunos:
                    <ul className="list-disc pl-5 mt-2">
                      <li>Para aulas: {autoConfigForm.watch('daysBefore')} dia(s) antes de cada aula agendada</li>
                      <li>Para pagamentos: {autoConfigForm.watch('daysBefore')} dia(s) antes da data de vencimento</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isConfiguring}
                >
                  {isConfiguring ? 'Salvando...' : 'Salvar Configuração'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
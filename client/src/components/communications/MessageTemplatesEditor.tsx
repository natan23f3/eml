import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Save, Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const templateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Nome do template deve ter pelo menos 3 caracteres' }),
  type: z.enum(['class_reminder', 'payment_reminder', 'payment_confirmation', 'welcome', 'other']),
  content: z.string().min(10, { message: 'Conteúdo deve ter pelo menos 10 caracteres' }).max(500, { message: 'Conteúdo não pode exceder 500 caracteres' }),
});

type Template = z.infer<typeof templateSchema>;

const tempTemplates = [
  {
    id: '1',
    name: 'Lembrete de Aula Padrão',
    type: 'class_reminder' as const,
    content: 'Olá {nome}, não esqueça da sua aula de {curso} amanhã às {horario}. Atenciosamente, Escola de Música.',
    isDefault: true
  },
  {
    id: '2',
    name: 'Lembrete de Pagamento',
    type: 'payment_reminder' as const,
    content: 'Olá {nome}, o pagamento da sua mensalidade no valor de R$ {valor} vence em {dias_restantes} dias. Atenciosamente, Escola de Música.',
    isDefault: true
  },
  {
    id: '3',
    name: 'Confirmação de Pagamento',
    type: 'payment_confirmation' as const,
    content: 'Olá {nome}, seu pagamento no valor de R$ {valor} foi recebido com sucesso. Agradecemos a preferência! Atenciosamente, Escola de Música.',
    isDefault: true
  }
];

export default function MessageTemplatesEditor() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<Template>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      type: 'class_reminder',
      content: '',
    },
  });

  useEffect(() => {
    // Função para carregar os templates da API
    const fetchTemplates = async () => {
      try {
        // Em um ambiente real, usaria fetch para obter os dados da API
        // const response = await fetch('/api/student-interactions/message-templates');
        // const data = await response.json();
        // if (data.success) {
        //   setTemplates(data.data);
        // }
        
        // Dados simulados para este exemplo
        setTemplates(tempTemplates);
      } catch (err) {
        console.error('Erro ao carregar templates:', err);
        setError('Não foi possível carregar os templates de mensagens.');
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (editingTemplate) {
      form.reset({
        id: editingTemplate.id,
        name: editingTemplate.name,
        type: editingTemplate.type,
        content: editingTemplate.content
      });
    } else {
      form.reset({
        name: '',
        type: 'class_reminder',
        content: ''
      });
    }
  }, [editingTemplate, form]);

  const onSubmit = async (values: Template) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Em um ambiente real, enviaria os dados para a API
      // const response = await fetch('/api/student-interactions/message-templates', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(values)
      // });
      // const data = await response.json();
      
      // Simulação de resposta
      const updatedTemplate = {
        ...values,
        id: values.id || Date.now().toString(),
        isDefault: false
      };

      if (editingTemplate) {
        // Atualizar template existente
        setTemplates(templates.map(t => (t.id === updatedTemplate.id ? updatedTemplate : t)));
        setSuccess('Template atualizado com sucesso!');
      } else {
        // Adicionar novo template
        setTemplates([...templates, updatedTemplate]);
        setSuccess('Novo template criado com sucesso!');
      }

      setEditingTemplate(null);
      form.reset({
        name: '',
        type: 'class_reminder',
        content: ''
      });
    } catch (err) {
      console.error('Erro ao salvar template:', err);
      setError('Não foi possível salvar o template. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    form.reset({
      name: '',
      type: 'class_reminder',
      content: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    try {
      // Em um ambiente real, enviaria a solicitação de exclusão para a API
      // await fetch(`/api/student-interactions/message-templates/${id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulação de exclusão
      setTemplates(templates.filter(t => t.id !== id));
      setSuccess('Template excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir template:', err);
      setError('Não foi possível excluir o template. Por favor, tente novamente.');
    }
  };

  const getTemplateTypeName = (type: string) => {
    const types = {
      'class_reminder': 'Lembrete de Aula',
      'payment_reminder': 'Lembrete de Pagamento',
      'payment_confirmation': 'Confirmação de Pagamento',
      'welcome': 'Boas-vindas',
      'other': 'Outro'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todos os Templates</TabsTrigger>
        <TabsTrigger value="edit">Editar Template</TabsTrigger>
        <TabsTrigger value="help">Ajuda</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Templates de Mensagens</h2>
          <Button onClick={() => setEditingTemplate(null)} className="flex items-center gap-2">
            <Plus size={16} />
            Novo Template
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="my-4 bg-green-50 border-green-200 text-green-800">
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Templates Disponíveis</CardTitle>
            <CardDescription>
              Templates que podem ser usados para enviar mensagens aos alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Conteúdo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        Nenhum template encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{getTemplateTypeName(template.type)}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[300px] overflow-hidden text-ellipsis">
                          {template.content.length > 50 
                            ? `${template.content.substring(0, 50)}...` 
                            : template.content}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleEdit(template)}
                            >
                              <Pencil size={14} />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                              onClick={() => template.id && handleDelete(template.id)}
                              disabled={template.isDefault}
                            >
                              <Trash2 size={14} />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="edit">
        <Card>
          <CardHeader>
            <CardTitle>{editingTemplate ? 'Editar Template' : 'Novo Template'}</CardTitle>
            <CardDescription>
              {editingTemplate
                ? 'Edite os detalhes do template selecionado'
                : 'Crie um novo template para mensagens automáticas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Template</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Lembrete de Aula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Mensagem</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="class_reminder">Lembrete de Aula</SelectItem>
                          <SelectItem value="payment_reminder">Lembrete de Pagamento</SelectItem>
                          <SelectItem value="payment_confirmation">Confirmação de Pagamento</SelectItem>
                          <SelectItem value="welcome">Boas-vindas</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo da Mensagem</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escreva o conteúdo da mensagem aqui..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1">
                        Use as variáveis {"{nome}"}, {"{curso}"}, {"{horario}"}, {"{valor}"}, {"{dias_restantes}"} 
                        para personalizar a mensagem.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="flex gap-2">
                    {isSubmitting ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save size={16} />
                        Salvar Template
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="help">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Ajuda sobre Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Variáveis Disponíveis</h3>
                <p className="text-muted-foreground mb-2">
                  Use estas variáveis para personalizar suas mensagens:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>{"{nome}"}</strong> - Nome do aluno</li>
                  <li><strong>{"{curso}"}</strong> - Nome do curso</li>
                  <li><strong>{"{horario}"}</strong> - Horário da aula</li>
                  <li><strong>{"{valor}"}</strong> - Valor do pagamento</li>
                  <li><strong>{"{dias_restantes}"}</strong> - Dias restantes até o vencimento</li>
                  <li><strong>{"{data_vencimento}"}</strong> - Data de vencimento do pagamento</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Tipos de Templates</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Lembrete de Aula</strong> - Enviados antes das aulas agendadas</li>
                  <li><strong>Lembrete de Pagamento</strong> - Enviados antes da data de vencimento</li>
                  <li><strong>Confirmação de Pagamento</strong> - Enviados após a confirmação do pagamento</li>
                  <li><strong>Boas-vindas</strong> - Enviados para novos alunos</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Dicas</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mantenha as mensagens curtas e diretas</li>
                  <li>Use uma linguagem amigável e profissional</li>
                  <li>Inclua o nome do aluno para personalizar a comunicação</li>
                  <li>Especifique claramente datas, horários e valores quando necessário</li>
                  <li>Inclua o nome da escola e formas de contato quando apropriado</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
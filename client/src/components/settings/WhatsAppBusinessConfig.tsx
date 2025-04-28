import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Lock, SendHorizonal, UploadCloud, Smartphone, AlertTriangle, BrainCircuit, Loader2, KeyRound, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Definição dos schemas de validação
const apiConfigSchema = z.object({
  whatsappBusinessId: z.string().min(1, "O ID da conta do WhatsApp Business é obrigatório"),
  whatsappApiToken: z.string().min(1, "O token de acesso é obrigatório"),
  phoneNumberId: z.string().min(1, "O ID do número de telefone é obrigatório"),
  phoneNumber: z.string().min(10, "O número de telefone precisa ser válido"),
  webhookVerifyToken: z.string().min(6, "O token de verificação do webhook deve ter pelo menos 6 caracteres"),
  apiVersion: z.string().default("v18.0"),
  isEnabled: z.boolean().default(true),
});

const messageTemplateConfigSchema = z.object({
  templateName: z.string().min(1, "O nome do template é obrigatório"),
  templateLanguage: z.string().default("pt_BR"),
  templateCategory: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"]),
  templateContent: z.string().min(10, "O conteúdo do template deve ter pelo menos 10 caracteres"),
  hasMedia: z.boolean().default(false),
  mediaType: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "NONE"]).default("NONE"),
});

type ApiConfigFormValues = z.infer<typeof apiConfigSchema>;
type MessageTemplateFormValues = z.infer<typeof messageTemplateConfigSchema>;

export default function WhatsAppBusinessConfig() {
  const { toast } = useToast();
  const [isTestingSend, setIsTestingSend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTemplateSubmitting, setIsTemplateSubmitting] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [activeTab, setActiveTab] = useState("api-config");
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking' | null>(null);

  // Formulário para configuração da API
  const apiConfigForm = useForm<ApiConfigFormValues>({
    resolver: zodResolver(apiConfigSchema),
    defaultValues: {
      whatsappBusinessId: "",
      whatsappApiToken: "",
      phoneNumberId: "",
      phoneNumber: "",
      webhookVerifyToken: "",
      apiVersion: "v18.0",
      isEnabled: true,
    }
  });

  // Formulário para configuração dos templates de mensagem
  const templateForm = useForm<MessageTemplateFormValues>({
    resolver: zodResolver(messageTemplateConfigSchema),
    defaultValues: {
      templateName: "",
      templateLanguage: "pt_BR",
      templateCategory: "UTILITY",
      templateContent: "",
      hasMedia: false,
      mediaType: "NONE",
    }
  });

  // Estado para monitorar se o template tem media
  const hasMedia = templateForm.watch("hasMedia");

  // Função para verificar a conexão com a API do WhatsApp
  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em uma implementação real, isso seria uma chamada fetch para a API do WhatsApp
      // const response = await fetch('/api/whatsapp/check-connection', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     whatsappBusinessId: apiConfigForm.getValues('whatsappBusinessId'),
      //     whatsappApiToken: apiConfigForm.getValues('whatsappApiToken'),
      //     phoneNumberId: apiConfigForm.getValues('phoneNumberId'),
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Falha na conexão');
      
      setConnectionStatus('connected');
      toast({
        title: "Conexão estabelecida com sucesso!",
        description: "Sua integração com o WhatsApp Business API está funcionando corretamente.",
      });
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: "Falha ao conectar",
        description: "Não foi possível estabelecer uma conexão com a API do WhatsApp. Verifique suas credenciais.",
        variant: "destructive",
      });
    }
  };

  // Função para enviar uma mensagem de teste
  const sendTestMessage = async () => {
    if (!testPhoneNumber) {
      toast({
        title: "Número de telefone obrigatório",
        description: "Digite um número de telefone para enviar a mensagem de teste.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingSend(true);
    try {
      // Simulando envio (em uma implementação real, seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em uma implementação real
      // const response = await fetch('/api/whatsapp/send-test', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     whatsappBusinessId: apiConfigForm.getValues('whatsappBusinessId'),
      //     whatsappApiToken: apiConfigForm.getValues('whatsappApiToken'),
      //     phoneNumberId: apiConfigForm.getValues('phoneNumberId'),
      //     recipientPhone: testPhoneNumber,
      //     message: "Esta é uma mensagem de teste da sua Escola de Música."
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Falha no envio');
      
      toast({
        title: "Mensagem enviada com sucesso!",
        description: `A mensagem de teste foi enviada para ${testPhoneNumber}.`,
      });
    } catch (error) {
      toast({
        title: "Falha no envio",
        description: "Não foi possível enviar a mensagem de teste. Verifique as configurações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTestingSend(false);
    }
  };

  // Função para salvar as configurações da API
  const onSubmitApiConfig = async (values: ApiConfigFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em uma implementação real, seria uma chamada fetch
      // const response = await fetch('/api/settings/whatsapp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(values),
      // });
      
      // if (!response.ok) throw new Error('Falha ao salvar');

      toast({
        title: "Configurações salvas com sucesso!",
        description: "As configurações do WhatsApp Business API foram atualizadas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para enviar um template para aprovação
  const onSubmitTemplate = async (values: MessageTemplateFormValues) => {
    setIsTemplateSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em uma implementação real, seria uma chamada fetch
      // const response = await fetch('/api/whatsapp/templates', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(values),
      // });
      
      // if (!response.ok) throw new Error('Falha ao enviar template');

      toast({
        title: "Template enviado com sucesso!",
        description: "Seu template foi enviado para aprovação do WhatsApp. Esse processo pode levar de algumas horas até dias.",
      });
      
      templateForm.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar template",
        description: "Não foi possível enviar o template para aprovação. Verifique as informações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTemplateSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-config">
            <KeyRound className="h-4 w-4 mr-2" />
            Configuração da API
          </TabsTrigger>
          <TabsTrigger value="message-templates">
            <SendHorizonal className="h-4 w-4 mr-2" />
            Templates de Mensagem
          </TabsTrigger>
        </TabsList>

        {/* Aba de configuração da API */}
        <TabsContent value="api-config" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Card de configuração principal */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do WhatsApp Business API
                </CardTitle>
                <CardDescription>
                  Configure as credenciais de acesso à API do WhatsApp Business para enviar mensagens automáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...apiConfigForm}>
                  <form onSubmit={apiConfigForm.handleSubmit(onSubmitApiConfig)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={apiConfigForm.control}
                        name="whatsappBusinessId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID da Conta WhatsApp Business</FormLabel>
                            <FormControl>
                              <Input placeholder="Exemplo: 123456789012345" {...field} />
                            </FormControl>
                            <FormDescription>
                              ID único da sua conta do WhatsApp Business
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={apiConfigForm.control}
                        name="phoneNumberId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID do Número de Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="Exemplo: 9876543210123" {...field} />
                            </FormControl>
                            <FormDescription>
                              ID do número de telefone registrado no WhatsApp Business
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={apiConfigForm.control}
                        name="whatsappApiToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token de Acesso</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="password" 
                                  placeholder="Seu token de acesso ao WhatsApp Business API" 
                                  className="pr-10" 
                                  {...field} 
                                />
                                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Token permanente de acesso à API do WhatsApp
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={apiConfigForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Telefone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Exemplo: +5511987654321" 
                                  {...field}
                                  className="pl-10" 
                                />
                                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Número de telefone completo com código do país
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={apiConfigForm.control}
                        name="webhookVerifyToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token de Verificação do Webhook</FormLabel>
                            <FormControl>
                              <Input placeholder="Token personalizado para verificação do webhook" {...field} />
                            </FormControl>
                            <FormDescription>
                              Token para verificar as chamadas de webhook
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={apiConfigForm.control}
                        name="apiVersion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Versão da API</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a versão da API" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="v18.0">v18.0 (Recomendada)</SelectItem>
                                <SelectItem value="v17.0">v17.0</SelectItem>
                                <SelectItem value="v16.0">v16.0</SelectItem>
                                <SelectItem value="v15.0">v15.0</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Versão da API do WhatsApp Cloud
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={apiConfigForm.control}
                      name="isEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Ativar Integração</FormLabel>
                            <FormDescription>
                              Ative ou desative temporariamente a integração com o WhatsApp Business
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-2 pt-4 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={checkConnection}
                        disabled={connectionStatus === 'checking'}
                        className="flex items-center"
                      >
                        {connectionStatus === 'checking' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          <>
                            <CircleCheck className="mr-2 h-4 w-4" />
                            Testar Conexão
                          </>
                        )}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          "Salvar Configurações"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Card de status da conexão */}
            <Card>
              <CardHeader>
                <CardTitle>Status da Conexão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge
                      variant="outline"
                      className={
                        connectionStatus === 'connected'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : connectionStatus === 'disconnected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    >
                      {connectionStatus === 'connected'
                        ? 'Conectado'
                        : connectionStatus === 'disconnected'
                        ? 'Desconectado'
                        : connectionStatus === 'checking'
                        ? 'Verificando...'
                        : 'Não verificado'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Último teste:</span>
                    <span className="text-sm text-muted-foreground">
                      {connectionStatus ? 'Agora' : 'Nunca testado'}
                    </span>
                  </div>

                  {connectionStatus === 'connected' && (
                    <Alert className="mt-4 bg-green-50 border-green-200">
                      <CircleCheck className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-700">Conexão estabelecida</AlertTitle>
                      <AlertDescription className="text-green-600">
                        Sua integração com o WhatsApp Business API está funcionando corretamente.
                      </AlertDescription>
                    </Alert>
                  )}

                  {connectionStatus === 'disconnected' && (
                    <Alert className="mt-4 bg-red-50 border-red-200" variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Falha na conexão</AlertTitle>
                      <AlertDescription>
                        Não foi possível estabelecer conexão com a API do WhatsApp. Verifique suas credenciais e tente novamente.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card de teste de envio */}
            <Card>
              <CardHeader>
                <CardTitle>Teste de Envio</CardTitle>
                <CardDescription>
                  Envie uma mensagem de teste para verificar a integração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <FormLabel htmlFor="test-phone">Número de Telefone para Teste</FormLabel>
                    <div className="flex space-x-2 mt-1.5">
                      <Input
                        id="test-phone"
                        placeholder="+5511987654321"
                        value={testPhoneNumber}
                        onChange={(e) => setTestPhoneNumber(e.target.value)}
                      />
                      <Button
                        onClick={sendTestMessage}
                        disabled={isTestingSend || !testPhoneNumber}
                      >
                        {isTestingSend ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <SendHorizonal className="mr-2 h-4 w-4" />
                            Enviar
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Digite um número de telefone com código do país para receber a mensagem de teste
                    </p>
                  </div>

                  <Alert>
                    <BrainCircuit className="h-4 w-4" />
                    <AlertTitle>Observação importante</AlertTitle>
                    <AlertDescription>
                      Apenas números verificados podem receber mensagens durante o período de teste. Para números não verificados, será necessário usar templates aprovados.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de templates de mensagem */}
        <TabsContent value="message-templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SendHorizonal className="h-5 w-5" />
                Criar Novo Template de Mensagem
              </CardTitle>
              <CardDescription>
                Configure templates de mensagem para envio automatizado através do WhatsApp Business API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...templateForm}>
                <form onSubmit={templateForm.handleSubmit(onSubmitTemplate)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={templateForm.control}
                      name="templateName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Template</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: boas_vindas_aluno" {...field} />
                          </FormControl>
                          <FormDescription>
                            Use apenas letras minúsculas, números e underscore (_)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={templateForm.control}
                      name="templateLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idioma</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o idioma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pt_BR">Português (Brasil)</SelectItem>
                              <SelectItem value="en_US">Inglês (EUA)</SelectItem>
                              <SelectItem value="es_ES">Espanhol</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Idioma principal do template
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={templateForm.control}
                      name="templateCategory"
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
                              <SelectItem value="UTILITY">Utilidade</SelectItem>
                              <SelectItem value="MARKETING">Marketing</SelectItem>
                              <SelectItem value="AUTHENTICATION">Autenticação</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Categoria do template conforme diretrizes do WhatsApp
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={templateForm.control}
                      name="hasMedia"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Incluir Mídia</FormLabel>
                            <FormDescription>
                              O template inclui imagem, vídeo ou documento?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {hasMedia && (
                      <FormField
                        control={templateForm.control}
                        name="mediaType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Mídia</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de mídia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="IMAGE">Imagem</SelectItem>
                                <SelectItem value="VIDEO">Vídeo</SelectItem>
                                <SelectItem value="DOCUMENT">Documento</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Tipo de mídia que será incluído no template
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={templateForm.control}
                    name="templateContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo do Template</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Digite o conteúdo do template. Exemplo: Olá {{1}}, bem-vindo à nossa escola de música! Sua primeira aula de {{2}} está agendada para {{3}}."
                            className="min-h-32 font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use {{1}}, {{2}}, etc. para parâmetros dinâmicos que serão substituídos ao enviar a mensagem.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Importante</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      <p>Os templates precisam ser aprovados pelo WhatsApp antes de serem utilizados. O processo de aprovação pode levar de algumas horas até dias.</p>
                      <p className="mt-2">Certifique-se de seguir as diretrizes de conteúdo do WhatsApp para aumentar as chances de aprovação.</p>
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      disabled={isTemplateSubmitting} 
                      className="flex items-center"
                    >
                      {isTemplateSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="mr-2 h-4 w-4" />
                          Enviar para Aprovação
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diretrizes para Templates do WhatsApp</CardTitle>
              <CardDescription>
                Requisitos importantes para aprovação de templates
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Categorias de Templates</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start space-x-2">
                      <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-200">Utilidade</Badge>
                      <p className="text-sm">Para lembretes, confirmações, atualizações e informações relacionadas a transações ou serviços.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge className="mt-1 bg-blue-100 text-blue-800 hover:bg-blue-200">Marketing</Badge>
                      <p className="text-sm">Para promoções, ofertas, descontos ou atualizações não relacionadas a transações específicas.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Badge className="mt-1 bg-purple-100 text-purple-800 hover:bg-purple-200">Autenticação</Badge>
                      <p className="text-sm">Apenas para códigos de verificação e autenticação de dois fatores.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Diretrizes de Conteúdo</h3>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-sm">
                    <li>Evite linguagem que sugira urgência excessiva ou alarme.</li>
                    <li>Não inclua informações falsas ou enganosas.</li>
                    <li>Não use linguagem abusiva ou ofensiva.</li>
                    <li>Evite símbolos, emoji ou formatação excessiva.</li>
                    <li>Certifique-se de que o conteúdo esteja claro e compreensível.</li>
                    <li>Para templates de utilidade ou autenticação, mantenha o foco estritamente na finalidade.</li>
                    <li>Para templates de marketing, inclua uma maneira clara de cancelar a inscrição.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Parâmetros Dinâmicos</h3>
                  <p className="mt-2 text-sm">
                    Utilize parâmetros dinâmicos para personalizar suas mensagens. Os parâmetros são representados por {'{{'} 1 {'}}'}, {'{{'} 2 {'}}'}, etc., e podem incluir:
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                    <li>Nome do destinatário</li>
                    <li>Informações específicas da transação (número, data, valor)</li>
                    <li>Detalhes da reserva ou agendamento</li>
                    <li>Códigos de verificação (para templates de autenticação)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Exemplos de Templates Aprovados</h3>
                  
                  <div className="mt-2 space-y-4">
                    <div className="rounded-md border p-3">
                      <p className="font-medium text-sm text-green-800">Template de Utilidade - Confirmação de Agendamento</p>
                      <p className="mt-1 text-sm">
                        Olá {'{{'} 1 {'}}'}, estamos confirmando sua aula de {'{{'} 2 {'}}'}  agendada para {'{{'} 3 {'}}'}, com o professor {'{{'} 4 {'}}'}.
                        Para reagendar ou cancelar, entre em contato pelo telefone {'{{'} 5 {'}}'}.
                      </p>
                    </div>
                    
                    <div className="rounded-md border p-3">
                      <p className="font-medium text-sm text-blue-800">Template de Marketing - Promoção</p>
                      <p className="mt-1 text-sm">
                        Olá {'{{'} 1 {'}}'}, temos uma oferta especial para você! Inscreva-se em um segundo curso e ganhe {'{{'} 2 {'}}'}% de desconto.
                        Oferta válida até {'{{'} 3 {'}}'}.
                      </p>
                    </div>
                    
                    <div className="rounded-md border p-3">
                      <p className="font-medium text-sm text-purple-800">Template de Autenticação - Código</p>
                      <p className="mt-1 text-sm">
                        Seu código de verificação para acessar a área do aluno da Escola de Música é {'{{'} 1 {'}}'}.
                        Este código é válido por {'{{'} 2 {'}}'}  minutos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
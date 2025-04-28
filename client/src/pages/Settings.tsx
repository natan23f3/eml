import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useSchoolSettings } from '@/providers/SchoolSettingsProvider';
import { 
  User, Bell, Shield, Building, Database, CreditCard, 
  Mail, LogOut, Cloud, Save, Upload, PaintBucket,
  MessageSquare, Send, MessageCircle
} from 'lucide-react';
import WhatsAppBusinessConfig from '@/components/settings/WhatsAppBusinessConfig';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const { settings, updateSettings, saveSettings, isSaving } = useSchoolSettings();

  const handleSaveSettings = async () => {
    try {
      await saveSettings();
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar a sessão.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-heading font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="school">Escola</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                    {user?.displayName ? user.displayName.charAt(0) : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium">{user?.displayName || 'Usuário'}</h3>
                    <p className="text-sm text-gray-500">{user?.email || 'email@exemplo.com'}</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">Alterar foto</Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input id="fullName" defaultValue={user?.displayName || ''} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Input id="role" defaultValue="Administrador" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="" placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar alterações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="school">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Escola</CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua escola de música
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">Nome da Escola</Label>
                    <Input 
                      id="schoolName" 
                      value={settings.schoolName} 
                      onChange={(e) => updateSettings({ schoolName: e.target.value })}
                      placeholder="Nome da sua escola de música" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schoolEmail">Email de Contato</Label>
                    <Input 
                      id="schoolEmail" 
                      type="email" 
                      value={settings.schoolEmail}
                      onChange={(e) => updateSettings({ schoolEmail: e.target.value })}
                      placeholder="contato@suaescola.com" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schoolPhone">Telefone</Label>
                    <Input 
                      id="schoolPhone" 
                      value={settings.schoolPhone}
                      onChange={(e) => updateSettings({ schoolPhone: e.target.value })}
                      placeholder="(00) 00000-0000" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schoolCnpj">CNPJ</Label>
                    <Input 
                      id="schoolCnpj" 
                      value={settings.schoolCnpj}
                      onChange={(e) => updateSettings({ schoolCnpj: e.target.value })}
                      placeholder="00.000.000/0001-00" 
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="schoolAddress">Endereço</Label>
                    <Input 
                      id="schoolAddress" 
                      value={settings.schoolAddress}
                      onChange={(e) => updateSettings({ schoolAddress: e.target.value })}
                      placeholder="Endereço completo da escola" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Horário de Funcionamento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weekdayHours">Segunda a Sexta</Label>
                      <Input 
                        id="weekdayHours" 
                        value={settings.weekdayHours}
                        onChange={(e) => updateSettings({ weekdayHours: e.target.value })}
                        placeholder="08:00 - 18:00" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weekendHours">Sábados</Label>
                      <Input 
                        id="weekendHours" 
                        value={settings.weekendHours}
                        onChange={(e) => updateSettings({ weekendHours: e.target.value })}
                        placeholder="09:00 - 13:00" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Personalização</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Cor Principal</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="primaryColor" 
                          value={settings.primaryColor}
                          onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                          placeholder="#4f46e5" 
                        />
                        <div 
                          className="w-10 h-10 rounded border" 
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Código hexadecimal (ex: #4f46e5)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="secondaryColor" 
                          value={settings.secondaryColor}
                          onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                          placeholder="#06b6d4" 
                        />
                        <div 
                          className="w-10 h-10 rounded border" 
                          style={{ backgroundColor: settings.secondaryColor }}
                        >
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Código hexadecimal (ex: #06b6d4)
                      </p>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="logoUpload">Logo da Escola</Label>
                      <div className="flex items-center gap-4">
                        {settings.logoUrl ? (
                          <div className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden">
                            <img 
                              src={settings.logoUrl} 
                              alt="Logo da escola" 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded border flex items-center justify-center bg-gray-50 text-gray-400">
                            <PaintBucket className="w-6 h-6" />
                          </div>
                        )}
                        <Button variant="outline" className="flex gap-2 items-center">
                          <Upload className="w-4 h-4" />
                          {settings.logoUrl ? 'Alterar logo' : 'Carregar logo'}
                        </Button>
                        {settings.logoUrl && (
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => updateSettings({ logoUrl: null })}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recomendado: imagem quadrada de pelo menos 200x200 pixels
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="ml-auto flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar alterações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-sm font-medium mb-2">Notificações por Email</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-marketing">Novos alunos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando novos alunos se matricularem
                    </p>
                  </div>
                  <Switch id="email-marketing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-social">Pagamentos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações sobre pagamentos de alunos
                    </p>
                  </div>
                  <Switch id="email-social" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-events">Eventos do calendário</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações sobre aulas e eventos
                    </p>
                  </div>
                  <Switch id="email-events" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-security">Alertas de segurança</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado sobre tentativas de login e alterações de senha
                    </p>
                  </div>
                  <Switch id="email-security" defaultChecked />
                </div>
              </div>
              
              <div className="pt-6 border-t mt-6">
                <h4 className="text-sm font-medium mb-2">Notificações no Sistema</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-everything">Todas as atividades</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações para todas as atividades no sistema
                      </p>
                    </div>
                    <Switch id="push-everything" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-mentions">Menções</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações quando for mencionado em comentários
                      </p>
                    </div>
                    <Switch id="push-mentions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-deployed">Atualizações do sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações sobre atualizações e novos recursos
                      </p>
                    </div>
                    <Switch id="push-deployed" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t mt-6">
                <h4 className="text-sm font-medium mb-2">Alertas WhatsApp</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="whatsapp-classes">Lembretes de aulas</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba lembretes de aulas próximas via WhatsApp
                      </p>
                    </div>
                    <Switch id="whatsapp-classes" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="whatsapp-payments">Lembretes de pagamento</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba lembretes de pagamentos pendentes via WhatsApp
                      </p>
                    </div>
                    <Switch id="whatsapp-payments" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving} className="ml-auto flex items-center gap-2">
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Gerencie as integrações com outros serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Cloud className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Firebase</h4>
                      <p className="text-xs text-gray-500">Conectado como {user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">WhatsApp Business API</h4>
                      <p className="text-xs text-gray-500">Integração para mensagens automáticas</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const whatsappTab = document.getElementById('whatsapp-tab');
                      if (whatsappTab) {
                        whatsappTab.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Configurar
                  </Button>
                </div>
                
                <div id="whatsapp-tab" className="pt-4">
                  <WhatsAppBusinessConfig />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Gateway de Pagamento</h4>
                      <p className="text-xs text-gray-500">Não conectado</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Serviço de Email</h4>
                      <p className="text-xs text-gray-500">Não conectado</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Backup Automático</h4>
                      <p className="text-xs text-gray-500">Não conectado</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie as configurações de segurança da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Autenticação de dois fatores</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Proteja sua conta com autenticação de dois fatores
                      </p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t mt-6">
                  <h4 className="text-sm font-medium mb-4">Sessões ativas</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Este dispositivo</h4>
                          <p className="text-xs text-gray-500">Última atividade: Agora</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" disabled>Atual</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t mt-6">
                  <h4 className="text-sm font-medium mb-4">Permissões</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" defaultChecked />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Aceitar emails sobre uso do sistema
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="security" defaultChecked />
                      <label
                        htmlFor="security"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Receber alertas de segurança
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving} className="ml-auto flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar alterações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
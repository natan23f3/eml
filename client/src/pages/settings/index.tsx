import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, CreditCard, Brush, Lock, Database, Bell } from 'lucide-react';
import GeneralSettings from '@/components/settings/GeneralSettings';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-500 mb-2">Configurações</h1>
        <p className="text-neutral-400">Gerencie as configurações do sistema</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 h-fit">
          <CardContent className="p-4">
            <nav className="flex flex-col space-y-1">
              <Button 
                variant={activeTab === 'general' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('general')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Geral
              </Button>
              <Button 
                variant={activeTab === 'users' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </Button>
              <Button 
                variant={activeTab === 'billing' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Faturamento
              </Button>
              <Button 
                variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('appearance')}
              >
                <Brush className="mr-2 h-4 w-4" />
                Aparência
              </Button>
              <Button 
                variant={activeTab === 'security' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('security')}
              >
                <Lock className="mr-2 h-4 w-4" />
                Segurança
              </Button>
              <Button 
                variant={activeTab === 'database' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('database')}
              >
                <Database className="mr-2 h-4 w-4" />
                Banco de Dados
              </Button>
              <Button 
                variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                className="justify-start"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </Button>
            </nav>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <GeneralSettings />
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Módulo de gerenciamento de usuários em desenvolvimento.
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Faturamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Módulo de configurações de faturamento em desenvolvimento.
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Aparência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Módulo de configurações de aparência em desenvolvimento.
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Módulo de configurações de segurança em desenvolvimento.
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'database' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Banco de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Módulo de configurações de banco de dados em desenvolvimento.
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Módulo de configurações de notificações em desenvolvimento.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

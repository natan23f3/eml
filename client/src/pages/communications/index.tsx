import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Mail, MessageSquare, Search, Filter } from 'lucide-react';
import CommunicationList from '@/components/communication/CommunicationList';
import CommunicationForm from '@/components/communication/CommunicationForm';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const CommunicationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [showNewMessage, setShowNewMessage] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Example query - would be replaced with actual implementation
  const { data: communications, isLoading } = useQuery({
    queryKey: ['/api/communications'],
    enabled: false, // Disable for now since endpoint might not exist yet
  });
  
  // Mock data for demonstration
  const mockCommunications = [
    {
      id: '1',
      type: 'email',
      subject: 'Lembrete de Aula: Violão - Intermediário',
      content: 'Olá, este é um lembrete de que sua aula de violão está agendada para amanhã às 19:00.',
      recipientName: 'João Silva',
      sentAt: '2023-07-10T15:30:00',
      status: 'sent'
    },
    {
      id: '2',
      type: 'sms',
      subject: 'Pagamento Pendente',
      content: 'Prezado(a), seu pagamento referente ao mês de Julho está pendente. Por favor, regularize sua situação.',
      recipientName: 'Mariana Santos',
      sentAt: '2023-07-05T10:15:00',
      status: 'sent'
    },
    {
      id: '3',
      type: 'notification',
      subject: 'Aula Cancelada',
      content: 'Informamos que a aula de bateria do dia 12/07 foi cancelada. Uma nova data será agendada em breve.',
      recipientName: 'Pedro Costa',
      sentAt: '2023-07-08T18:45:00',
      status: 'sent'
    },
    {
      id: '4',
      type: 'email',
      subject: 'Bem-vindo à nossa escola!',
      content: 'Seja bem-vindo à Música Manager! Estamos felizes em tê-lo como aluno. Aqui estão algumas informações importantes...',
      recipientName: 'Ana Ferreira',
      sentAt: '2023-07-01T09:00:00',
      status: 'sent'
    },
    {
      id: '5',
      type: 'email',
      subject: 'Avaliação de Progresso',
      content: 'Prezado(a), gostaríamos de agendar uma avaliação de progresso para discutir seu desenvolvimento nas aulas.',
      recipientName: 'Carlos Mendes',
      sentAt: '2023-07-07T14:20:00',
      status: 'sent'
    }
  ];
  
  // Filter communications by type and search term
  const getFilteredCommunications = () => {
    let filtered = [...mockCommunications];
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(comm => comm.type === selectedType);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(comm => 
        comm.subject.toLowerCase().includes(search) || 
        comm.recipientName.toLowerCase().includes(search) ||
        comm.content.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  };
  
  const handleNewMessageSubmit = (data: any) => {
    console.log('New message data:', data);
    // Would send to API and update cache
    setShowNewMessage(false);
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Comunicações</h1>
            <p className="text-neutral-400">Gerenciamento de comunicações com alunos</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
            onClick={() => setShowNewMessage(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Mensagem
          </Button>
        </div>
      </div>
      
      {showNewMessage ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nova Mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            <CommunicationForm 
              onSubmit={handleNewMessageSubmit}
              onCancel={() => setShowNewMessage(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Mensagens
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Templates
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Buscar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[200px] md:w-[300px]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-300 h-4 w-4" />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="notification">Notificação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Histórico de Mensagens</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {getFilteredCommunications().length} mensagens encontradas
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CommunicationList 
                  communications={getFilteredCommunications()}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Templates de Mensagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Módulo de templates de mensagens em desenvolvimento.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CommunicationsPage;

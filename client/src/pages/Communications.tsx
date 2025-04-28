import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { CommunicationList } from '@/components/communications/CommunicationList';
import { CommunicationForm } from '@/components/communications/CommunicationForm';
import MessageTemplatesEditor from '@/components/communications/MessageTemplatesEditor';
import WhatsAppReminder from '@/components/communications/WhatsAppReminder';
import WhatsAppMassCommunication from '@/components/communications/WhatsAppMassCommunication';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, MessageSquare, PhoneCall, FileEdit, BellRing, Users, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Communications() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communicationType, setCommunicationType] = useState<'email' | 'sms' | 'call'>('email');

  // Mock data for testing
  const mockCommunications = [
    {
      id: '1',
      type: 'email',
      subject: 'Aviso de aula amanhã',
      content: 'Olá! Lembramos que você tem aula amanhã às 14:00. Não se atrase!',
      studentId: '1',
      status: 'sent',
      sentDate: new Date().toISOString(),
      priority: 'medium'
    },
    {
      id: '2',
      type: 'sms',
      subject: 'Lembrete de pagamento',
      content: 'Sua mensalidade vence em 3 dias. Por favor, realize o pagamento.',
      studentId: '2',
      status: 'sent',
      sentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      priority: 'high'
    },
    {
      id: '3',
      type: 'whatsapp',
      subject: 'Confirmação de matrícula',
      content: 'Sua matrícula no curso de Violão foi confirmada! Bem-vindo à nossa escola de música.',
      studentId: '3',
      status: 'sent',
      sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      priority: 'medium'
    },
    {
      id: '4',
      type: 'email',
      subject: 'Material de estudo',
      content: 'Segue em anexo o material de estudo para a próxima aula.',
      studentId: '1',
      status: 'pending',
      sentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      priority: 'low'
    },
    {
      id: '5',
      type: 'call',
      subject: 'Confirmação de reagendamento',
      content: 'Ligação realizada para confirmar o reagendamento da aula para sexta-feira às 16:00.',
      studentId: '4',
      status: 'failed',
      sentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      priority: 'high'
    },
    {
      id: '6',
      type: 'whatsapp',
      subject: 'Lembrete de aula',
      content: 'Olá! Não esqueça da sua aula de Canto hoje às 18:00.',
      studentId: '5',
      status: 'sent',
      sentDate: new Date().toISOString(),
      priority: 'medium'
    }
  ];
  
  // Fetch communications data from API in real app
  // const { data: communications, isLoading } = useQuery({
  //   queryKey: ['/api/communications'],
  // });
  
  // Using mock data for testing
  const communications = mockCommunications;
  const isLoading = false;

  // Handle new email button click
  const handleNewEmail = () => {
    setCommunicationType('email');
    setIsDialogOpen(true);
  };

  // Handle new SMS button click
  const handleNewSMS = () => {
    setCommunicationType('sms');
    setIsDialogOpen(true);
  };

  // Handle new call button click
  const handleNewCall = () => {
    setCommunicationType('call');
    setIsDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <MainLayout
      title="Comunicações"
      description="Gerencie comunicações e notificações para alunos e professores"
    >
      <div className="space-y-6">
        {/* Tabs para os diferentes tipos de comunicação */}
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          {/* Aba de mensagens diretas */}
          <TabsContent value="messages">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-xl font-semibold">Envio de Mensagens</h2>
              
              <div className="flex flex-wrap gap-2 self-end">
                <Button onClick={handleNewEmail} variant="outline" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Novo Email
                </Button>
                <Button onClick={handleNewSMS} variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Novo SMS
                </Button>
                <Button onClick={handleNewCall} className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  Agendar Ligação
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="email">Emails</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="call">Ligações</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <CommunicationList 
                  communications={communications || []} 
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="email">
                <CommunicationList 
                  communications={(communications || []).filter(comm => comm.type === 'email')}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="sms">
                <CommunicationList 
                  communications={(communications || []).filter(comm => comm.type === 'sms')}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="call">
                <CommunicationList 
                  communications={(communications || []).filter(comm => comm.type === 'call')}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {/* Aba de templates de mensagens */}
          <TabsContent value="templates">
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileEdit className="w-5 h-5" />
                Templates de Mensagens
              </h2>
              <p className="text-muted-foreground">
                Crie e gerencie templates para mensagens automáticas
              </p>
            </div>
            
            <MessageTemplatesEditor />
          </TabsContent>
          
          {/* Aba de comunicações via WhatsApp */}
          <TabsContent value="whatsapp">
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BellRing className="w-5 h-5" />
                Comunicações via WhatsApp
              </h2>
              <p className="text-muted-foreground">
                Envie lembretes e notificações para alunos via WhatsApp
              </p>
            </div>
            
            <Tabs defaultValue="reminders">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="reminders" className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  Lembretes Automáticos
                </TabsTrigger>
                <TabsTrigger value="mass" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Envio em Massa
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="reminders">
                <WhatsAppReminder />
              </TabsContent>
              
              <TabsContent value="mass">
                <WhatsAppMassCommunication />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {/* Aba de histórico de comunicações */}
          <TabsContent value="history">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Histórico de Comunicações</h2>
              <p className="text-muted-foreground">
                Visualize todas as comunicações enviadas
              </p>
            </div>
            
            <CommunicationList 
              communications={communications || []} 
              isLoading={isLoading}
              showFilters={true}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {communicationType === 'email' ? 'Novo Email' : 
               communicationType === 'sms' ? 'Novo SMS' : 'Agendar Ligação'}
            </DialogTitle>
          </DialogHeader>
          <CommunicationForm 
            type={communicationType} 
            onComplete={handleDialogClose} 
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

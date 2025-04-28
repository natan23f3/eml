import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { CommunicationList } from '@/components/communications/CommunicationList';
import { CommunicationForm } from '@/components/communications/CommunicationForm';
import MessageTemplatesEditor from '@/components/communications/MessageTemplatesEditor';
import WhatsAppReminder from '@/components/communications/WhatsAppReminder';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, MessageSquare, PhoneCall, FileEdit, BellRing } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function Communications() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communicationType, setCommunicationType] = useState<'email' | 'sms' | 'call'>('email');

  // Fetch communications data
  const { data: communications, isLoading } = useQuery({
    queryKey: ['/api/communications'],
  });

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
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-heading font-bold">Comunicações</h1>
        
        <div className="flex gap-2 self-end">
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
            Nova Ligação
          </Button>
        </div>
      </div>

      <div className="mt-8">
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {communicationType === 'email' ? 'Novo Email' : 
               communicationType === 'sms' ? 'Novo SMS' : 'Registrar Ligação'}
            </DialogTitle>
          </DialogHeader>
          <CommunicationForm 
            type={communicationType} 
            onComplete={handleDialogClose} 
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Megaphone, Users, TrendingUp, Calendar } from 'lucide-react';
import CampaignList from '@/components/marketing/CampaignList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/dashboard/StatCard';

const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('campaigns');
  
  // Example query - would be replaced with actual implementation
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['/api/marketing/campaigns'],
    enabled: false, // Disable for now since endpoint might not exist yet
  });
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Marketing</h1>
            <p className="text-neutral-400">Gestão de campanhas e ações de marketing</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </div>
      
      {/* Marketing Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Novos Leads" 
          value="24" 
          icon={<Users className="h-6 w-6" />} 
          change={{
            type: 'increase',
            value: '12% este mês'
          }}
          iconBgColor="bg-primary bg-opacity-10"
          iconColor="text-primary"
        />
        
        <StatCard 
          title="Taxa de Conversão" 
          value="8.5%" 
          icon={<TrendingUp className="h-6 w-6" />} 
          change={{
            type: 'increase',
            value: '2% em relação ao mês anterior'
          }}
          iconBgColor="bg-secondary bg-opacity-10"
          iconColor="text-secondary"
        />
        
        <StatCard 
          title="Campanhas Ativas" 
          value="3" 
          icon={<Megaphone className="h-6 w-6" />} 
          change={{
            type: 'neutral',
            value: 'Mesmo do mês anterior'
          }}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        
        <StatCard 
          title="Eventos Planejados" 
          value="2" 
          icon={<Calendar className="h-6 w-6" />} 
          change={{
            type: 'increase',
            value: '1 novo evento'
          }}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>
      
      <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas de Marketing</CardTitle>
              <CardDescription>Gerencie suas campanhas ativas e planejadas</CardDescription>
            </CardHeader>
            <CardContent>
              <CampaignList isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Leads</CardTitle>
              <CardDescription>Acompanhe e gerencie leads potenciais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Módulo de gestão de leads em desenvolvimento.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Eventos</CardTitle>
              <CardDescription>Planeje e gerencie eventos promocionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Módulo de gestão de eventos em desenvolvimento.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Análises de Marketing</CardTitle>
              <CardDescription>Métricas e análises de desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Módulo de análises de marketing em desenvolvimento.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingPage;

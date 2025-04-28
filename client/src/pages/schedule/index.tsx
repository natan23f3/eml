import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar, ClockIcon, Printer } from 'lucide-react';
import ClassSchedule from '@/components/classes/ClassSchedule';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const SchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Fetch schedule data
  const { data: scheduledClasses, isLoading } = useQuery({
    queryKey: ['/api/classes'],
  });
  
  // Transform the data for the schedule component
  const prepareClassesData = (classes: any[]) => {
    return classes?.map((cls: any) => ({
      id: cls.id.toString(),
      title: cls.title,
      instrument: cls.instrument,
      teacher: cls.teacherName || 'Não atribuído',
      time: cls.scheduleDay.includes(',') 
        ? `${cls.scheduleDay.split(',').join(' e ')}, ${cls.startTime} - ${cls.endTime}`
        : `${cls.scheduleDay}, ${cls.startTime} - ${cls.endTime}`,
      duration: `${cls.startTime} - ${cls.endTime}`,
      roomNumber: cls.roomNumber || 'Não definido',
      studentCount: cls.studentCount || 0,
      maxStudents: cls.maxStudents,
    })) || [];
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-500 mb-2">Agenda</h1>
            <p className="text-neutral-400">Visualização e gerenciamento da agenda de aulas</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium">Período:</span>
            <div className="flex items-center">
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-auto"
              />
            </div>
          </div>
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm">
              <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">
                {viewMode === 'week' 
                  ? 'Visualizando a semana de ' + formatDate(selectedDate)
                  : 'Visualizando o mês de ' + selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                }
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setMonth(newDate.getMonth() - 1);
                }
                setSelectedDate(newDate);
              }}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setSelectedDate(new Date());
              }}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setMonth(newDate.getMonth() + 1);
                }
                setSelectedDate(newDate);
              }}>
                Próximo
              </Button>
            </div>
          </div>
          
          <TabsContent value="week" className="mt-0">
            <ClassSchedule 
              classes={prepareClassesData(scheduledClasses?.classes || [])}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="month" className="mt-0">
            <div className="text-center py-8 text-muted-foreground">
              Visualização mensal disponível em breve.
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;

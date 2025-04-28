import { Layout } from '@/components/layout/Layout';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Class } from '@/types/schema';
import { Link } from 'wouter';

export default function Classes() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // Calculate week interval
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekInterval = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  // Fetch classes
  const { data: classes, isLoading } = useQuery({
    queryKey: ['/api/classes'],
  });

  // Helper function to format time
  const formatTime = (dateString: string): string => {
    return format(new Date(dateString), 'HH:mm');
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeek(prevWeek => addDays(prevWeek, -7));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeek(prevWeek => addDays(prevWeek, 7));
  };

  // Get classes for a specific day
  const getClassesForDay = (date: Date) => {
    if (!classes) return [];
    
    const dateString = format(date, 'yyyy-MM-dd');
    return classes.filter((classItem: Class) => {
      const classDate = format(new Date(classItem.startTime), 'yyyy-MM-dd');
      return classDate === dateString;
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-green-100 text-green-800">Agendada</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Concluída</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-heading font-bold">Aulas e Horários</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(weekInterval[0], "dd 'de' MMMM", { locale: ptBR })} - {format(weekInterval[6], "dd 'de' MMMM", { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Link href="/classes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Aula
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekInterval.map((date) => {
          const dayClasses = getClassesForDay(date);
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <div key={date.toString()} className="mb-6">
              <div className={`text-center p-2 rounded-t-lg font-medium mb-2 ${isToday ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}>
                <div className="uppercase text-xs font-semibold">
                  {format(date, 'EEEE', { locale: ptBR })}
                </div>
                <div className="text-lg">{format(date, 'dd')}</div>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-20 bg-gray-200 rounded-md"></div>
                  <div className="h-20 bg-gray-200 rounded-md"></div>
                </div>
              ) : dayClasses.length === 0 ? (
                <div className="text-center py-10 text-sm text-gray-500 border border-dashed rounded-md">
                  Sem aulas
                </div>
              ) : (
                <div className="space-y-3">
                  {dayClasses.map((classItem: Class) => (
                    <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm font-medium flex justify-between">
                          <span>Curso #{classItem.courseId}</span>
                          {getStatusBadge(classItem.status)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Professor #{classItem.teacherId}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  addDays,
  isToday,
  isEqual,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos
type Class = {
  id: string;
  title: string;
  teacher: string;
  room: string;
  date: string; // ISO string
  startTime: string;
  endTime: string;
  students: number;
};

type DaySchedule = {
  date: Date;
  classes: Class[];
};

export default function Aulas() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  
  // Dados de exemplo para aulas da semana
  const classesData: Class[] = [
    {
      id: '1',
      title: 'Violão Iniciante - Turma A',
      teacher: 'João Silva',
      room: 'Sala 101',
      date: '2023-07-10T00:00:00.000Z',
      startTime: '09:00',
      endTime: '10:30',
      students: 5
    },
    {
      id: '2',
      title: 'Piano Intermediário',
      teacher: 'Maria Oliveira',
      room: 'Sala 203',
      date: '2023-07-10T00:00:00.000Z',
      startTime: '14:00',
      endTime: '16:00',
      students: 3
    },
    {
      id: '3',
      title: 'Canto Avançado',
      teacher: 'Roberto Almeida',
      room: 'Sala 105',
      date: '2023-07-11T00:00:00.000Z',
      startTime: '10:00',
      endTime: '12:00',
      students: 4
    },
    {
      id: '4',
      title: 'Bateria Iniciante',
      teacher: 'Carlos Santos',
      room: 'Sala 302',
      date: '2023-07-11T00:00:00.000Z',
      startTime: '16:30',
      endTime: '18:00',
      students: 2
    },
    {
      id: '5',
      title: 'Violão Iniciante - Turma B',
      teacher: 'João Silva',
      room: 'Sala 101',
      date: '2023-07-12T00:00:00.000Z',
      startTime: '09:00',
      endTime: '10:30',
      students: 6
    },
    {
      id: '6',
      title: 'Teoria Musical',
      teacher: 'Fernanda Lima',
      room: 'Sala 102',
      date: '2023-07-12T00:00:00.000Z',
      startTime: '11:00',
      endTime: '12:30',
      students: 8
    },
    {
      id: '7',
      title: 'Piano Avançado',
      teacher: 'Maria Oliveira',
      room: 'Sala 203',
      date: '2023-07-13T00:00:00.000Z',
      startTime: '15:00',
      endTime: '17:00',
      students: 2
    },
    {
      id: '8',
      title: 'Violino Iniciante',
      teacher: 'Paula Martins',
      room: 'Sala 204',
      date: '2023-07-14T00:00:00.000Z',
      startTime: '10:00',
      endTime: '11:30',
      students: 3
    }
  ];
  
  // Obter dias da semana atual
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek
  });
  
  // Avançar para a próxima semana
  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  // Voltar para a semana anterior
  const previousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };
  
  // Voltar para a semana atual
  const currentWeek = () => {
    setCurrentDate(new Date());
  };
  
  // Formatar período da semana
  const weekRange = `${format(startOfCurrentWeek, "dd 'de' MMMM", { locale: ptBR })} - ${format(endOfCurrentWeek, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
  
  // Obter aulas para um dia específico
  const getClassesForDay = (date: Date) => {
    // Formatar a data para comparação
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Filtrar aulas para o dia selecionado
    // Aqui estamos simplificando a comparação utilizando a parte da data apenas
    return classesData.filter(classItem => {
      const classDate = classItem.date.split('T')[0];
      return classDate === formattedDate;
    });
  };
  
  // Abrir detalhes de uma aula
  const openClassDetails = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDetailsOpen(true);
  };
  
  // Formatar o schedule para cada dia
  const schedule: DaySchedule[] = daysOfWeek.map(day => ({
    date: day,
    classes: getClassesForDay(day)
  }));
  
  // Cancelar uma aula
  const cancelClass = () => {
    if (selectedClass) {
      toast({
        title: 'Aula cancelada',
        description: `A aula de ${selectedClass.title} foi cancelada com sucesso.`,
        variant: 'destructive',
      });
      setIsDetailsOpen(false);
    }
  };
  
  return (
    <MainLayout
      title="Aulas"
      description="Calendário e agendamento de aulas da escola de música."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">{weekRange}</h3>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={currentWeek}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            Próxima
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nova Aula
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schedule.map((day) => (
          <Card key={day.date.toISOString()} className={`${isToday(day.date) ? 'border-blue-400' : ''}`}>
            <CardHeader className={`pb-2 ${isToday(day.date) ? 'bg-blue-50' : ''}`}>
              <CardTitle className="text-lg">
                {format(day.date, "EEEE", { locale: ptBR })}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {format(day.date, "dd/MM", { locale: ptBR })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {day.classes.length > 0 ? (
                <div className="space-y-3">
                  {day.classes.map((classItem) => (
                    <div 
                      key={classItem.id} 
                      className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => openClassDetails(classItem)}
                    >
                      <div className="font-medium">{classItem.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {classItem.startTime} - {classItem.endTime}
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                          strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span>{classItem.teacher}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                          strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" 
                            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                        <span>{classItem.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>Nenhuma aula agendada</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Dialog para detalhes da aula */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedClass && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data</h4>
                  <p>{format(parseISO(selectedClass.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Horário</h4>
                  <p>{selectedClass.startTime} - {selectedClass.endTime}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Professor</h4>
                  <p>{selectedClass.teacher}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sala</h4>
                  <p>{selectedClass.room}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Alunos</h4>
                <p>{selectedClass.students} alunos registrados</p>
              </div>
              
              <DialogFooter className="flex justify-between gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fechar
                </Button>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={cancelClass}>
                    Cancelar Aula
                  </Button>
                  <Button>
                    Editar
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
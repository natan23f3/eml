import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Music, Users, Clock, MapPin, MoreHorizontal } from 'lucide-react';
import { Link } from 'wouter';

interface ClassSession {
  id: string;
  title: string;
  instrument: string;
  teacher: string;
  time: string;
  duration: string;
  roomNumber: string;
  studentCount: number;
  maxStudents: number;
}

interface ClassScheduleProps {
  classes: ClassSession[];
  isLoading?: boolean;
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ classes, isLoading = false }) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all');
  
  const days = [
    { value: 'all', label: 'Todos os dias' },
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
  ];
  
  const instruments = [
    { value: 'all', label: 'Todos os instrumentos' },
    { value: 'guitar', label: 'Violão' },
    { value: 'piano', label: 'Piano' },
    { value: 'drums', label: 'Bateria' },
    { value: 'saxophone', label: 'Saxofone' },
    { value: 'violin', label: 'Violino' },
  ];
  
  const filterClasses = () => {
    let filteredClasses = [...classes];
    
    if (selectedDay !== 'all') {
      // This is a simplified filtering logic - in a real app, we'd filter based on actual schedule data
      filteredClasses = filteredClasses.filter(cls => 
        cls.time.toLowerCase().includes(selectedDay.substring(0, 3))
      );
    }
    
    if (selectedInstrument !== 'all') {
      filteredClasses = filteredClasses.filter(cls => 
        cls.instrument === selectedInstrument
      );
    }
    
    return filteredClasses;
  };
  
  const getInstrumentIcon = (instrument: string) => {
    switch (instrument) {
      case 'guitar':
        return (
          <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
            <Music className="text-primary h-6 w-6" />
          </div>
        );
      case 'piano':
        return (
          <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center">
            <Music className="text-secondary h-6 w-6" />
          </div>
        );
      case 'drums':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Music className="text-amber-500 h-6 w-6" />
          </div>
        );
      case 'saxophone':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Music className="text-blue-500 h-6 w-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Music className="text-purple-500 h-6 w-6" />
          </div>
        );
    }
  };
  
  const filteredClasses = filterClasses();
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <CardTitle className="text-xl font-semibold">Agenda de Aulas</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o dia" />
            </SelectTrigger>
            <SelectContent>
              {days.map(day => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o instrumento" />
            </SelectTrigger>
            <SelectContent>
              {instruments.map(instrument => (
                <SelectItem key={instrument.value} value={instrument.value}>
                  {instrument.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4 w-full">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma aula encontrada com os filtros selecionados.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClasses.map(cls => (
              <div key={cls.id} className="flex items-center p-4 hover:bg-neutral-50 rounded-lg border">
                {getInstrumentIcon(cls.instrument)}
                
                <div className="ml-4 flex-grow">
                  <p className="font-medium text-neutral-500">{cls.title}</p>
                  <div className="flex flex-wrap gap-x-4 text-xs text-neutral-400 mt-1">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{cls.teacher}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Sala {cls.roomNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                    {cls.studentCount}/{cls.maxStudents} alunos
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Opções</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/classes/${cls.id}`}>
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Gerenciar alunos</DropdownMenuItem>
                      <DropdownMenuItem>Registrar presença</DropdownMenuItem>
                      <DropdownMenuItem>Editar aula</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassSchedule;

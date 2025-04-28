import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScheduleItem } from '@/types/schema';

interface ScheduleCardProps {
  scheduleItems: ScheduleItem[];
  isLoading?: boolean;
}

export function ScheduleCard({ scheduleItems, isLoading = false }: ScheduleCardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  // Get color for the schedule item indicator
  const getColorClass = (colorType: string): string => {
    switch (colorType) {
      case 'primary':
        return 'bg-primary-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Format the selected date
  const formattedDate = selectedDate.toLocaleDateString() === new Date().toLocaleDateString()
    ? 'Hoje'
    : format(selectedDate, "dd 'de' MMMM", { locale: ptBR });

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Agenda do Dia</h3>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="w-12 h-4 bg-gray-200 rounded"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Agenda do Dia</h3>
        <div className="flex items-center gap-2">
          <button 
            className="text-gray-400 hover:text-gray-600" 
            onClick={goToPreviousDay}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">{formattedDate}</span>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={goToNextDay}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {scheduleItems.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
          >
            <div className="flex-shrink-0 w-12 text-center">
              <p className="text-sm font-medium text-gray-700">{item.time}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">{item.student}</p>
            </div>
            <div className={`w-2 h-2 ${getColorClass(item.colorType)} rounded-full`}></div>
          </div>
        ))}
        
        <button className="w-full mt-3 text-center text-sm text-primary-600 hover:text-primary-700 py-2">
          Ver agenda completa
        </button>
      </div>
    </div>
  );
}

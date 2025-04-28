import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Clock } from 'lucide-react';

interface ClassDetail {
  id: string;
  title: string;
  teacher: string;
  time: string;
  students: number;
  instrument: 'guitar' | 'piano' | 'drums' | 'saxophone' | 'violin';
}

interface UpcomingClassesProps {
  classes: ClassDetail[];
}

const UpcomingClasses: React.FC<UpcomingClassesProps> = ({ classes }) => {
  const getInstrumentIcon = (instrument: string) => {
    switch (instrument) {
      case 'guitar':
        return (
          <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
            <svg className="text-primary h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2l-1.5 1.5L19 2" />
              <path d="M18.5 5c1.7-1.7 4.5-.7 4.5-4A16.7 16.7 0 0 1 12 8c-4.5 0-7.7 3.6-8 8 0 1.9.8 3.8 2.2 5.2a7.2 7.2 0 0 0 10.3 0C17.8 20 19 18.3 19 16c0-3.6-3-6.8-8-10h-.2" />
              <path d="M16 18a4 4 0 0 1-6.3 0" />
              <path d="M10 10a1 1 0 0 0-2 0v1a0 0 0 0 1 0 0" />
              <path d="M14.59 7a2 2 0 0 0-2.5 2.5" />
            </svg>
          </div>
        );
      case 'piano':
        return (
          <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center">
            <svg className="text-secondary h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.5 5.5V1H1v14h3.5v3.5h14V5.5h-4.5z"/>
              <rect x="1" y="1" width="13.5" height="10"/>
              <rect x="5.5" y="1" width="0.01" height="10"/>
              <rect x="10" y="1" width="0.01" height="10"/>
              <rect x="14.5" y="5.5" width="3.5" height="13.5"/>
              <rect x="14.5" y="10" width="3.5" height="0.01"/>
              <rect x="14.5" y="14.5" width="3.5" height="0.01"/>
            </svg>
          </div>
        );
      case 'saxophone':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="text-blue-500 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 18a6 6 0 0 0 0-12A6 6 0 0 1 12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 6.5 6.5 0 0 1-5.33-2.4"/>
              <path d="M9 18h.01"/>
              <path d="M6 18h.01"/>
              <path d="M3 18h.01"/>
              <path d="M9 15h.01"/>
              <path d="M6 15h.01"/>
              <path d="M3 15h.01"/>
              <path d="M9 12h.01"/>
              <path d="M6 12h.01"/>
              <path d="M3 12h.01"/>
              <path d="M9 9h.01"/>
              <path d="M6 9h.01"/>
              <path d="M3 9h.01"/>
            </svg>
          </div>
        );
      case 'drums':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="text-amber-500 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="M5 10h-1v1a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-1h-1"/>
              <path d="M17 10a5 5 0 0 0-10 0"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="text-purple-500 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 5.1a7.4 7.4 0 0 0-3-1.9"/>
              <path d="M16.7 8a3 3 0 0 0-1.3-1.4c-1.9-.8-8.6 1.8-9.1 1.9a.3.3 0 0 0-.2.3v3.9a.3.3 0 0 0 .9.7c.2.1 6.6 2.5 8.2 1.7a3 3 0 0 0 1.5-1.7"/>
              <path d="M19 8.8v4.4"/>
              <path d="M19 21v-8"/>
              <path d="M5 21v-8"/>
              <path d="M15.5 13l2 8"/>
              <path d="M8.5 13l-2 8"/>
              <path d="M12 22a4 4 0 0 0-4-4h8a4 4 0 0 0-4 4z"/>
            </svg>
          </div>
        );
    }
  };
  
  return (
    <Card className="card">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="text-lg font-medium text-neutral-500">Próximas Aulas</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div key={classItem.id} className="flex items-center p-3 hover:bg-neutral-50 rounded-lg">
              {getInstrumentIcon(classItem.instrument)}
              <div className="ml-4">
                <p className="font-medium text-neutral-500">{classItem.title}</p>
                <div className="flex items-center text-xs text-neutral-400 mt-1">
                  <User className="h-3 w-3 mr-1" />
                  <span>{classItem.teacher}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{classItem.time}</span>
                </div>
              </div>
              <div className="ml-auto">
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                  {classItem.students} alunos
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4 px-6">
        <Button variant="ghost" className="w-full text-primary hover:bg-primary hover:bg-opacity-5 rounded-lg transition">
          Ver todas as aulas
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingClasses;

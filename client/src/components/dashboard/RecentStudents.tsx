import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Music, Calendar, MoreHorizontal } from 'lucide-react';
import { Link } from 'wouter';

interface StudentDetail {
  id: string;
  name: string;
  instrument: string;
  joinDate: string;
  avatar: string;
}

interface RecentStudentsProps {
  students: StudentDetail[];
}

const RecentStudents: React.FC<RecentStudentsProps> = ({ students }) => {
  return (
    <Card className="card">
      <CardHeader className="border-b px-6 py-4 flex items-center justify-between">
        <CardTitle className="text-lg font-medium text-neutral-500">Alunos Recentes</CardTitle>
        <Button variant="link" className="text-primary hover:underline text-sm p-0">
          <Link href="/students">Ver todos</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center p-3 hover:bg-neutral-50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-medium text-neutral-500">{student.name}</p>
                <div className="flex items-center text-xs text-neutral-400 mt-1">
                  <Music className="h-3 w-3 mr-1" />
                  <span>{student.instrument}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{student.joinDate}</span>
                </div>
              </div>
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/students/${student.id}`}>
                        Ver detalhes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                    <DropdownMenuItem>Registrar pagamento</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4 px-6">
        <Button className="w-full text-primary hover:bg-primary hover:bg-opacity-5 rounded-lg transition">
          <Link href="/students/new">Adicionar Novo Aluno</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentStudents;

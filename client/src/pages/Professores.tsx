import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Tipo para professor
type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  status: 'active' | 'inactive' | 'vacation';
  hireDate: string;
  classesCount: number;
};

export default function Professores() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados de exemplo
  const teachers: Teacher[] = [
    {
      id: '1',
      name: 'Roberto Almeida',
      email: 'roberto.almeida@musicschool.com',
      phone: '(11) 97654-3210',
      specialties: ['Piano', 'Teclado', 'Teoria Musical'],
      status: 'active',
      hireDate: '2021-03-15',
      classesCount: 12
    },
    {
      id: '2',
      name: 'Carla Ferreira',
      email: 'carla.ferreira@musicschool.com',
      phone: '(11) 98765-4321',
      specialties: ['Violão', 'Guitarra'],
      status: 'active',
      hireDate: '2022-01-10',
      classesCount: 8
    },
    {
      id: '3',
      name: 'Marcos Oliveira',
      email: 'marcos.oliveira@musicschool.com',
      phone: '(11) 91234-5678',
      specialties: ['Bateria', 'Percussão'],
      status: 'vacation',
      hireDate: '2020-07-20',
      classesCount: 0
    },
    {
      id: '4',
      name: 'Juliana Santos',
      email: 'juliana.santos@musicschool.com',
      phone: '(11) 99876-5432',
      specialties: ['Violino', 'Viola'],
      status: 'active',
      hireDate: '2019-11-05',
      classesCount: 15
    },
    {
      id: '5',
      name: 'Ricardo Lima',
      email: 'ricardo.lima@musicschool.com',
      phone: '(11) 95678-1234',
      specialties: ['Canto', 'Técnica Vocal'],
      status: 'inactive',
      hireDate: '2021-09-01',
      classesCount: 0
    }
  ];
  
  // Filtrar professores com base no termo de pesquisa
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Função para obter a cor de status
  const getStatusColor = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter o texto de status
  const getStatusText = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'vacation':
        return 'Em férias';
      default:
        return status;
    }
  };
  
  return (
    <MainLayout
      title="Professores"
      description="Gerenciamento da equipe de professores da escola de música."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 relative max-w-sm">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar professores..."
            className="pl-10"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" 
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
        
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Professor
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Equipe de Professores</CardTitle>
          <CardDescription>
            Total de {filteredTeachers.length} professores no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Contratação</TableHead>
                  <TableHead>Aulas Semanais</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell className="max-w-[180px]">
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">{specialty}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{teacher.email}</div>
                        <div className="text-gray-500">{teacher.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                        {getStatusText(teacher.status)}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(teacher.hireDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="text-center font-semibold">
                        {teacher.classesCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </Button>
                        <Button variant="destructive" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                            strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTeachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      Nenhum professor encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
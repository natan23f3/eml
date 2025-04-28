import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, UserPlus, MoreVertical, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeacherForm } from '@/components/admin/TeacherForm';
import { AdminTeacherProfile } from '@/components/admin/AdminTeacherProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  hireDate: Date | string;
  status: 'active' | 'inactive';
  bio?: string;
}

export default function TeacherManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  // Fetch teachers data
  const { data: teachers, isLoading, refetch } = useQuery({
    queryKey: ['/api/teachers'],
  });

  // Filter teachers based on search term and active tab
  const filteredTeachers = (teachers || []).filter((teacher: Teacher) => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      activeTab === 'all' || 
      (activeTab === 'active' && teacher.status === 'active') ||
      (activeTab === 'inactive' && teacher.status === 'inactive');
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewTeacher = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
    setIsViewDialogOpen(true);
  };

  const handleEditTeacher = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTeacher = (teacherId: number) => {
    // In a real app, show confirmation dialog and delete from API
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      console.log('Deleting teacher', teacherId);
      // Would make API call here
    }
  };

  const handleToggleStatus = (teacherId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log(`Changing teacher ${teacherId} status to ${newStatus}`);
    // Would make API call here
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Professores</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-72" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <Skeleton className="h-9 w-9" />
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold">Gerenciamento de Professores</h1>
        <Button onClick={handleOpenCreateDialog} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar Professor
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar professores por nome, email ou especialização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'all' | 'active' | 'inactive')}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredTeachers.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Especialização</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Data de Contratação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher: Teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="font-medium">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.specialization}</TableCell>
                  <TableCell>
                    <div>{teacher.email}</div>
                    <div className="text-xs text-gray-500">{teacher.phone}</div>
                  </TableCell>
                  <TableCell>{formatDate(teacher.hireDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={teacher.status === 'active' ? 'default' : 'secondary'}
                    >
                      {teacher.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewTeacher(teacher.id)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>Ver Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTeacher(teacher.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(teacher.id, teacher.status)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          <span>
                            {teacher.status === 'active' ? 'Desativar' : 'Ativar'}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <UserX className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">Nenhum professor encontrado</h3>
          <p className="text-gray-500 mb-4">
            Não há professores cadastrados que correspondam aos critérios de busca.
          </p>
          <Button onClick={handleOpenCreateDialog}>
            Adicionar Professor
          </Button>
        </div>
      )}
      
      {/* Create Teacher Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Professor</DialogTitle>
          </DialogHeader>
          <TeacherForm 
            onComplete={() => {
              setIsCreateDialogOpen(false);
              refetch();
            }} 
          />
        </DialogContent>
      </Dialog>
      
      {/* View Teacher Dialog */}
      {selectedTeacherId && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Perfil do Professor</DialogTitle>
            </DialogHeader>
            <AdminTeacherProfile 
              teacherId={selectedTeacherId} 
              onClose={() => setIsViewDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Teacher Dialog */}
      {selectedTeacherId && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Professor</DialogTitle>
            </DialogHeader>
            <TeacherForm 
              teacherId={selectedTeacherId}
              isEditMode={true}
              onComplete={() => {
                setIsEditDialogOpen(false);
                refetch();
              }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}
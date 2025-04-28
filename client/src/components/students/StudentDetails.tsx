import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Download, 
  Mail, 
  Phone, 
  Cake, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Link } from 'wouter';

export interface StudentDetailType {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'trial' | 'pending';
  courseDetails: {
    instrument: string;
    level: string;
    teacher: string;
    startDate: string;
    schedule: string;
  };
  payments: Array<{
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    method: string;
  }>;
  classHistory: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    teacher: string;
    attendance: 'present' | 'absent';
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

interface StudentDetailsProps {
  student: StudentDetailType;
  isLoading: boolean;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Inativo</Badge>;
      case 'trial':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Período de teste</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getInstrumentName = (instrument: string) => {
    const instruments = {
      guitar: 'Violão',
      piano: 'Piano',
      drums: 'Bateria',
      saxophone: 'Saxofone',
      violin: 'Violino'
    };
    return instruments[instrument as keyof typeof instruments] || instrument;
  };
  
  const getLevelName = (level: string) => {
    const levels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return levels[level as keyof typeof levels] || level;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Summary */}
      <div className="col-span-1">
        <Card className="card">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <Avatar className="h-32 w-32 mx-auto">
                {student.avatar ? (
                  <AvatarImage src={student.avatar} alt={student.name} />
                ) : null}
                <AvatarFallback className="text-4xl">{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold text-neutral-500">{student.name}</h2>
              <p className="text-neutral-400">ID: #{student.id}</p>
              <div className="mt-2">
                {getStatusBadge(student.status)}
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-neutral-500 mb-3">Informações Pessoais</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="text-neutral-400 mr-2 h-4 w-4" />
                  <span className="text-sm text-neutral-500">{student.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-neutral-400 mr-2 h-4 w-4" />
                  <span className="text-sm text-neutral-500">{student.phone}</span>
                </div>
                <div className="flex items-center">
                  <Cake className="text-neutral-400 mr-2 h-4 w-4" />
                  <span className="text-sm text-neutral-500">{student.birthDate}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-neutral-400 mr-2 h-4 w-4" />
                  <span className="text-sm text-neutral-500">{`${student.city}, ${student.state}`}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-500 mb-3">Documentos</h4>
              <div className="space-y-2">
                {student.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="text-neutral-400 mr-2 h-4 w-4" />
                      <span className="text-sm text-neutral-500">{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button 
                className="mt-3 w-full" 
                variant="outline"
              >
                Adicionar Documento
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 flex gap-2">
          <Button className="flex-1">
            <Link href={`/students/edit/${student.id}`} className="w-full">
              Editar Aluno
            </Link>
          </Button>
          <Button variant="outline" className="flex-1">
            <Link href="/students" className="w-full">
              Voltar
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="col-span-2">
        <Tabs defaultValue="course">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="course">Curso</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="classes">Histórico de Aulas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="course">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-neutral-500">Informações do Curso</CardTitle>
                <Button variant="link" className="text-primary">Editar</Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h5 className="text-sm font-medium text-neutral-400">Instrumento</h5>
                    <p className="text-neutral-600">{getInstrumentName(student.courseDetails.instrument)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-neutral-400">Nível</h5>
                    <p className="text-neutral-600">{getLevelName(student.courseDetails.level)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-neutral-400">Professor</h5>
                    <p className="text-neutral-600">{student.courseDetails.teacher}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-neutral-400">Início do Curso</h5>
                    <p className="text-neutral-600">{student.courseDetails.startDate}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-neutral-400">Horário</h5>
                    <p className="text-neutral-600">{student.courseDetails.schedule}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-neutral-500">Pagamentos</CardTitle>
                <Button variant="link" className="text-primary">
                  <Link href="/payments">Ver Todos</Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Método
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {student.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                            {payment.date}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {getPaymentStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                            {payment.method}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <Button variant="default">Registrar Novo Pagamento</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-neutral-500">Histórico de Aulas</CardTitle>
                <Button variant="link" className="text-primary">
                  <Link href="/classes">Ver Todas</Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4 mt-4">
                  {student.classHistory.map((classItem) => (
                    <div key={classItem.id} className="flex items-center p-3 rounded-lg border border-neutral-100">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        classItem.attendance === 'present' 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}>
                        {classItem.attendance === 'present' ? (
                          <CheckCircle className="text-green-500 h-5 w-5" />
                        ) : (
                          <XCircle className="text-red-500 h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-neutral-500">{classItem.title}</p>
                        <div className="flex items-center text-xs text-neutral-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{classItem.date}, {classItem.time}</span>
                          <span className="mx-2">•</span>
                          <User className="h-3 w-3 mr-1" />
                          <span>Prof. {classItem.teacher}</span>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Badge variant="outline" className={`${
                          classItem.attendance === 'present' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {classItem.attendance === 'present' ? 'Presente' : 'Ausente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDetails;

// These imports are used in the component but need to be explicitly imported
import { Calendar, User } from 'lucide-react';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import StudentDetails from '@/components/students/StudentDetails';

const StudentDetailsPage: React.FC<{ id: string }> = ({ id }) => {
  const { data: student, isLoading } = useQuery({
    queryKey: [`/api/students/${id}`],
  });

  // Prepare the data for the StudentDetails component
  const prepareStudentData = (student: any) => {
    if (!student) return null;
    
    // Format student detail data
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      phone: student.phone,
      birthDate: student.birthDate ? new Date(student.birthDate).toLocaleDateString('pt-BR') : 'Não informado',
      address: student.address || 'Não informado',
      city: student.city || 'Não informado',
      state: student.state || 'Não informado',
      avatar: undefined, // Would come from storage in a real app
      status: student.status || 'active',
      courseDetails: {
        instrument: student.instrument || '',
        level: student.level || '',
        teacher: student.teacher || '',
        startDate: student.startDate ? new Date(student.startDate).toLocaleDateString('pt-BR') : 'Não informado',
        schedule: student.schedule || 'Não informado'
      },
      payments: student.payments?.map((payment: any) => ({
        id: payment.id.toString(),
        date: payment.date ? new Date(payment.date).toLocaleDateString('pt-BR') : 'Não definido',
        amount: payment.amount,
        status: payment.status,
        method: payment.method === 'credit_card' ? 'Cartão de Crédito' : 
                payment.method === 'debit_card' ? 'Cartão de Débito' : 
                payment.method === 'bank_transfer' ? 'Transferência Bancária' : 
                payment.method === 'cash' ? 'Dinheiro' : 
                payment.method === 'pix' ? 'PIX' : payment.method
      })) || [],
      classHistory: student.attendance?.map((record: any) => ({
        id: record.id.toString(),
        title: record.className || 'Aula de ' + student.instrument,
        date: record.date ? new Date(record.date).toLocaleDateString('pt-BR') : 'Não definido',
        time: record.time || '',
        teacher: record.teacherName || student.teacher,
        attendance: record.status
      })) || [
        {
          id: '1',
          title: `Aula de ${student.instrument} - ${student.level === 'beginner' ? 'Iniciante' : student.level === 'intermediate' ? 'Intermediário' : 'Avançado'}`,
          date: '05/07/2023',
          time: '19:00 - 20:30',
          teacher: student.teacher,
          attendance: 'present'
        },
        {
          id: '2',
          title: `Aula de ${student.instrument} - ${student.level === 'beginner' ? 'Iniciante' : student.level === 'intermediate' ? 'Intermediário' : 'Avançado'}`,
          date: '03/07/2023',
          time: '19:00 - 20:30',
          teacher: student.teacher,
          attendance: 'present'
        },
        {
          id: '3',
          title: `Aula de ${student.instrument} - ${student.level === 'beginner' ? 'Iniciante' : student.level === 'intermediate' ? 'Intermediário' : 'Avançado'}`,
          date: '28/06/2023',
          time: '19:00 - 20:30',
          teacher: student.teacher,
          attendance: 'absent'
        }
      ],
      documents: student.documents?.map((doc: any) => ({
        id: doc.id.toString(),
        name: doc.name,
        type: doc.type
      })) || [
        {
          id: '1',
          name: 'Contrato.pdf',
          type: 'contract'
        },
        {
          id: '2',
          name: 'Identificação.pdf',
          type: 'identification'
        }
      ]
    };
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-500 mb-2">Detalhes do Aluno</h1>
        <p className="text-neutral-400">Informações completas do aluno</p>
      </div>
      
      <StudentDetails 
        student={prepareStudentData(student) as any} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default StudentDetailsPage;

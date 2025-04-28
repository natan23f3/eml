import { Link } from 'wouter';
import { RecentStudent } from '@/types/schema';

interface StudentTableProps {
  students: RecentStudent[];
  isLoading?: boolean;
}

export function StudentTable({ students, isLoading = false }: StudentTableProps) {
  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Get status badge class
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Translate status to Portuguese
  const translateStatus = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Alunos Recentes</h3>
          <span className="text-sm text-primary-600 hover:text-primary-700">Ver todos</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="ml-3">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end">
                      <div className="h-4 bg-gray-200 rounded w-12 mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Alunos Recentes</h3>
        <Link href="/students" className="text-sm text-primary-600 hover:text-primary-700">Ver todos</Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${student.avatarColor} flex items-center justify-center text-xs font-medium flex-shrink-0`}>
                      {student.avatarInitials}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.course}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.teacher}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(student.status)}`}>
                    {translateStatus(student.status)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(student.date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/students/${student.id}/edit`} className="text-primary-600 hover:text-primary-900 mr-3">
                    Editar
                  </Link>
                  <Link href={`/students/${student.id}`} className="text-gray-600 hover:text-gray-900">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

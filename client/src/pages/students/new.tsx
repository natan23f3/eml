import React from 'react';
import StudentForm from '@/components/students/StudentForm';

const NewStudentPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-500 mb-2">Novo Aluno</h1>
        <p className="text-neutral-400">Cadastro de novo aluno no sistema</p>
      </div>
      
      <StudentForm />
    </div>
  );
};

export default NewStudentPage;

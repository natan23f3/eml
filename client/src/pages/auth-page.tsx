import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirecionar para o dashboard se já estiver autenticado
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Tentando login com:', email, password);
      // Convertemos todas as strings para minúsculas para evitar problemas com diferenças de capitalização
      const success = await login(email.toLowerCase().trim(), password.trim());
      if (success) {
        console.log('Login bem-sucedido, redirecionando...');
        setLocation('/');
      } else {
        console.error('Login falhou');
        setError('Credenciais inválidas. Use admin@musicschool.com / admin123');
      }
    } catch (err) {
      console.error('Erro durante o login:', err);
      setError('Ocorreu um erro durante o login. Tente admin@musicschool.com / admin123');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Lado esquerdo - Formulário */}
      <div className="w-full max-w-md p-8 m-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19C9 19.75 8.79 20 8 20H5C4.21 20 4 19.75 4 19V18C4 17.25 4.21 17 5 17H8C8.79 17 9 17.25 9 18V19Z" fill="#4299e1"/>
              <path d="M16 19C16 19.75 15.79 20 15 20H12C11.21 20 11 19.75 11 19V18C11 17.25 11.21 17 12 17H15C15.79 17 16 17.25 16 18V19Z" fill="#4299e1"/>
              <path d="M9 14C9 14.75 8.79 15 8 15H5C4.21 15 4 14.75 4 14V13C4 12.25 4.21 12 5 12H8C8.79 12 9 12.25 9 13V14Z" fill="#4299e1"/>
              <path d="M16 14C16 14.75 15.79 15 15 15H12C11.21 15 11 14.75 11 14V13C11 12.25 11.21 12 12 12H15C15.79 12 16 12.25 16 13V14Z" fill="#4299e1"/>
              <path d="M9 9C9 9.75 8.79 10 8 10H5C4.21 10 4 9.75 4 9V8C4 7.25 4.21 7 5 7H8C8.79 7 9 7.25 9 8V9Z" fill="#4299e1"/>
              <path d="M16 9C16 9.75 15.79 10 15 10H12C11.21 10 11 9.75 11 9V8C11 7.25 11.21 7 12 7H15C15.79 7 16 7.25 16 8V9Z" fill="#4299e1"/>
              <path d="M20 19C20 19.75 19.79 20 19 20H18C17.21 20 17 19.75 17 19V18C17 17.25 17.21 17 18 17H19C19.79 17 20 17.25 20 18V19Z" fill="#4299e1"/>
              <path d="M20 14C20 14.75 19.79 15 19 15H18C17.21 15 17 14.75 17 14V13C17 12.25 17.21 12 18 12H19C19.79 12 20 12.25 20 13V14Z" fill="#4299e1"/>
              <path d="M20 9C20 9.75 19.79 10 19 10H18C17.21 10 17 9.75 17 9V8C17 7.25 17.21 7 18 7H19C19.79 7 20 7.25 20 8V9Z" fill="#4299e1"/>
              <path d="M9 4C9 4.75 8.79 5 8 5H5C4.21 5 4 4.75 4 4V3C4 2.25 4.21 2 5 2H8C8.79 2 9 2.25 9 3V4Z" fill="#4299e1"/>
              <path d="M16 4C16 4.75 15.79 5 15 5H12C11.21 5 11 4.75 11 4V3C11 2.25 11.21 2 12 2H15C15.79 2 16 2.25 16 3V4Z" fill="#4299e1"/>
              <path d="M20 4C20 4.75 19.79 5 19 5H18C17.21 5 17 4.75 17 4V3C17 2.25 17.21 2 18 2H19C19.79 2 20 2.25 20 3V4Z" fill="#4299e1"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold">MusicSchool Pro</h2>
          <p className="text-gray-600 mt-2">Sistema de Gestão para Escolas de Música</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
          
          <div className="text-center text-sm mt-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="font-medium text-blue-700 mb-1">Credenciais de demonstração:</p>
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <p className="font-bold">Administrador</p>
                  <p className="mt-1"><strong>Email:</strong> admin@musicschool.com</p>
                  <p><strong>Senha:</strong> admin123</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <p className="font-bold">Professor</p>
                  <p className="mt-1"><strong>Email:</strong> professor@musicschool.com</p>
                  <p><strong>Senha:</strong> professor123</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Lado direito - Hero Section */}
      <div className="hidden lg:block w-1/2 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="flex flex-col justify-center items-center h-full px-8 text-white">
          <h1 className="text-4xl font-bold mb-6">Simplifique a gestão da sua escola de música</h1>
          <p className="text-xl mb-8 max-w-xl text-center">
            Controle alunos, professores, pagamentos e cursos em um só lugar. Tome decisões baseadas em dados e aumente a eficiência.
          </p>
          
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gerenciamento de Alunos</h3>
              <p className="text-blue-100">Cadastre, acompanhe e organize todos os dados dos alunos.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calendário de Aulas</h3>
              <p className="text-blue-100">Organize horários, professores e salas de aula.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Controle Financeiro</h3>
              <p className="text-blue-100">Gerencie pagamentos, mensalidades e emita relatórios.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Relatórios e Métricas</h3>
              <p className="text-blue-100">Analise desempenho com gráficos e dados em tempo real.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
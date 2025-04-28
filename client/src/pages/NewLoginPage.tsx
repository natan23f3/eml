import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../providers/NewAuthProvider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Enviando formulário com:', username, password);
    
    const success = await login(username, password);
    if (success) {
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            MusicSchool Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Por favor, entre com suas credenciais
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Nome de usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="font-medium text-blue-700 mb-1">Credenciais de demonstração:</p>
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <p className="font-bold">Administrador</p>
                  <p className="mt-1"><strong>Usuário:</strong> admin</p>
                  <p><strong>Senha:</strong> admin123</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <p className="font-bold">Professor</p>
                  <p className="mt-1"><strong>Usuário:</strong> professor</p>
                  <p><strong>Senha:</strong> professor123</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
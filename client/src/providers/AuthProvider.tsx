import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'staff';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Valor padrão do contexto
const defaultValue: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Verificar no localStorage se há usuário salvo
  useEffect(() => {
    const savedUser = localStorage.getItem('musicschool_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Erro ao carregar usuário do localStorage:', err);
        localStorage.removeItem('musicschool_user');
      }
    }
  }, []);

  // Credenciais mock para desenvolvimento
  const mockCredentials = [
    { 
      email: 'admin@musicschool.com',
      password: 'admin123',
      user: {
        id: '1',
        name: 'Administrador',
        email: 'admin@musicschool.com',
        role: 'admin' as const
      }
    },
    { 
      email: 'professor@musicschool.com',
      password: 'professor123',
      user: {
        id: '2',
        name: 'Professor Demo',
        email: 'professor@musicschool.com',
        role: 'teacher' as const
      }
    }
  ];

  // Simula login
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    console.log('Iniciando login para:', email);
    console.log('Credenciais esperadas: admin@musicschool.com / admin123');
    console.log('Comparação direta:', email === 'admin@musicschool.com', password === 'admin123');
    
    try {
      // Simular tempo de resposta da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Credenciais fixas para debug - sempre permitir o login do admin em desenvolvimento
      if (email === 'admin@musicschool.com' && password === 'admin123') {
        console.log('Login com admin direto');
        const adminUser = {
          id: '1',
          name: 'Administrador',
          email: 'admin@musicschool.com',
          role: 'admin' as const
        };
        setUser(adminUser);
        localStorage.setItem('musicschool_user', JSON.stringify(adminUser));
        return true;
      }
      
      // Segunda credencial de teste
      if (email === 'professor@musicschool.com' && password === 'professor123') {
        console.log('Login com professor direto');
        const teacherUser = {
          id: '2',
          name: 'Professor Demo',
          email: 'professor@musicschool.com',
          role: 'teacher' as const
        };
        setUser(teacherUser);
        localStorage.setItem('musicschool_user', JSON.stringify(teacherUser));
        return true;
      }
      
      // Se chegou aqui, credenciais são inválidas
      console.error('Login falhou: credenciais inválidas');
      throw new Error('Credenciais inválidas');
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('musicschool_user');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
